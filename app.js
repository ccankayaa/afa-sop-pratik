"use strict";

const tests = window.QUESTION_BANK;
const storageKey = "afa-sop-pratik:v1";
const byId = (id) => document.getElementById(id);
const format = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 });
const drawerMedia = matchMedia("(max-width: 959px)");
const letters = ["A", "B", "C", "D"];
const statusText = { blank: "Boş", answered: "İşaretli", correct: "Doğru", wrong: "Yanlış", review: "Kaynak notu" };
const icon = (name) => `<span class="icon" aria-hidden="true">${name}</span>`;

const state = restore();
let drawerOpen = false;
let storageAvailable = true;

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && tests.some(({ id }) => id === saved.active) && saved.runs && Array.isArray(saved.history)) return saved;
  } catch {
    // The app also works with temporary state when storage is unavailable.
  }
  return { active: tests[0].id, theme: "light", runs: {}, history: [] };
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    if (storageAvailable) {
      storageAvailable = false;
      const note = document.createElement("p");
      note.textContent = "Tarayıcı depolaması kullanılamıyor. İlerleme bu oturum boyunca saklanır.";
      note.className = "storage-note";
      document.querySelector("main").prepend(note);
    }
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function currentTest() {
  return tests.find(({ id }) => id === state.active);
}

function newRun() {
  return { index: 0, choices: {}, revealed: {}, finished: false, results: false };
}

function runFor(id = state.active) {
  state.runs[id] ??= newRun();
  return state.runs[id];
}

function summarize(test, run, showAll = false) {
  const result = { total: 0, answered: 0, correct: 0, wrong: 0, blank: 0, review: 0 };
  test.questions.forEach((question, index) => {
    if (question.answer === null) {
      result.review += 1;
      return;
    }
    result.total += 1;
    const choice = run.choices[index];
    if (!Number.isInteger(choice)) {
      result.blank += 1;
      return;
    }
    result.answered += 1;
    if (showAll || run.revealed[index]) {
      if (question.answer === choice) result.correct += 1;
      else result.wrong += 1;
    }
  });
  return result;
}

function updateMetrics() {
  const totals = { answered: 0, correct: 0, wrong: 0 };
  const accumulate = (result) => {
    for (const key of Object.keys(totals)) totals[key] += result[key];
  };
  state.history.forEach(accumulate);
  for (const test of tests) {
    const run = state.runs[test.id];
    if (run && !run.finished) accumulate(summarize(test, run));
  }

  const fullTests = state.history.filter((result) => result.blank === 0);
  const fullCount = fullTests.length;
  const average = (value) => fullCount ? fullTests.reduce((sum, result) => sum + value(result), 0) / fullCount : 0;
  const stats = [
    ["checklist", "", "Çözülen soru", format.format(totals.answered), ""],
    ["check_circle", "green", "Doğru cevap", format.format(totals.correct), ""],
    ["close", "red", "Yanlış cevap", format.format(totals.wrong), ""],
    ["track_changes", "amber", "Tam biten test", format.format(fullCount), ""],
    ["show_chart", "", "Test başı ortalama", fullCount ? `%${format.format(average((result) => result.correct * 100 / result.total))}` : "—",
      fullCount ? `${format.format(average((result) => result.correct))} doğru / test` : "— doğru / test"]
  ];
  const metrics = document.createDocumentFragment();
  for (const [symbol, color, label, value, detail] of stats) {
    const card = byId("metric").content.cloneNode(true);
    if (color) card.querySelector(".metric-icon").classList.add(color);
    card.querySelector(".icon").textContent = symbol;
    card.querySelector(".metric-label").textContent = label;
    card.querySelector(".metric-value").textContent = value;
    card.querySelector(".metric-detail").textContent = detail;
    metrics.append(card);
  }
  byId("metrics").replaceChildren(metrics);
  byId("metrics").children[1].title = "Cevabı gösterilen sorular ve bitirilen testler";
  byId("metrics").children[2].title = "Cevabı gösterilen sorular ve bitirilen testler";
  byId("metrics").children[3].title = "Puanlanan tüm soruları cevaplanan testler";
  byId("metrics").children[4].title = "Tamamı cevaplanan testlerin eşit ağırlıklı ortalaması";
}

function renderMenu() {
  byId("test-count").textContent = tests.length;
  byId("bank-count").textContent = `${tests.reduce((total, test) => total + test.questions.length, 0)} soru`;
  byId("test-menu").innerHTML = tests.map((test, index) => `
    <button class="test-tab" type="button" data-test="${test.id}" ${test.id === state.active ? 'aria-current="true"' : ""}>
      <span class="tab-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      <span><span class="tab-name">${escapeHtml(test.title)}</span><span class="tab-count">${test.questions.length} soru</span></span>
      ${icon("chevron_right")}
    </button>
  `).join("");
}

function renderTheme() {
  const dark = state.theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]').content = dark ? "#0b1424" : "#f3f6fa";
  byId("theme-toggle").innerHTML = dark ? `${icon("light_mode")} Açık tema` : `${icon("dark_mode")} Koyu tema`;
}

function questionStatus(question, run, index) {
  if (question.answer === null) return "review";
  if (!Number.isInteger(run.choices[index])) return "blank";
  if (!run.finished && !run.revealed[index]) return "answered";
  return run.choices[index] === question.answer ? "correct" : "wrong";
}

function renderMap(test, run) {
  const statuses = ["answered", "correct", "wrong", "blank"];
  if (test.questions.some(({ answer }) => answer === null)) statuses.push("review");
  byId("navigator").innerHTML = `
    <h2>${icon("grid_view")} Soru Haritası</h2>
    <p>Gitmek istediğiniz soruyu seçin.</p>
    <div class="question-map">
      ${test.questions.map((question, index) => {
        const status = questionStatus(question, run, index);
        return `<button type="button" class="map-button" data-index="${index}" data-status="${status}"
          aria-label="Soru ${index + 1}, ${statusText[status]}" ${!run.results && index === run.index ? 'aria-current="true"' : ""}>${index + 1}</button>`;
      }).join("")}
    </div>
    <div class="legend">${statuses.map((status) => `<span><i class="dot ${status}"></i>${statusText[status]}</span>`).join("")}</div>
    <button type="button" class="button ${run.finished ? "button-outline" : "button-primary"} finish" data-action="${run.finished ? "results" : "finish"}">
      ${icon(run.finished ? "speed" : "checklist")} ${run.finished ? "Sonucu Göster" : "Testi Bitir"}
    </button>
  `;
}

function renderResults(result) {
  const score = format.format(result.correct * 100 / result.total);
  return `
    <div class="results">
      <div class="score">${icon("speed")} <strong>${score}</strong><span> / 100 puan</span></div>
      <h3 id="question-title" tabindex="-1">Test Sonucu</h3>
      <p>Puanlanan ${result.total} sorunun ${result.answered} tanesi cevaplandı.${result.review ? ` ${result.review} kaynak notu puana dahil edilmedi.` : ""}</p>
      <div class="result-stats">
        <div class="result-stat good"><strong>${result.correct}</strong>Doğru</div>
        <div class="result-stat bad"><strong>${result.wrong}</strong>Yanlış</div>
        <div class="result-stat"><strong>${result.blank}</strong>Boş</div>
      </div>
      <div class="result-actions">
        <button type="button" data-action="review" class="button button-outline">${icon("visibility")} Cevapları İncele</button>
        <button type="button" data-action="restart" class="button button-primary">${icon("refresh")} Yeniden Başla</button>
      </div>
    </div>
  `;
}

function renderQuestion(test, run) {
  const { index, choices, finished, revealed } = run;
  const question = test.questions[index];
  const selected = choices[index];
  const unscored = question.answer === null;
  const visible = finished || Boolean(revealed[index]);
  const options = question.options.map((text, option) => {
    const correct = visible && option === question.answer;
    const wrong = visible && !unscored && option === selected && !correct;
    const selectedClass = option === selected ? " is-selected" : "";
    const answerClass = correct ? " is-correct" : wrong ? " is-wrong" : "";
    const mark = correct ? "check_circle" : wrong ? "close" : option === selected ? "check" : "radio_button_unchecked";
    const status = correct ? " · Doğru cevap" : wrong ? " · Yanlış cevap" : "";
    return `
      <label class="option${selectedClass}${answerClass}${finished ? " is-locked" : ""}">
        <input type="radio" name="answer" value="${option}" ${option === selected ? "checked" : ""} ${finished ? "disabled" : ""} aria-label="${letters[option]}. ${escapeHtml(text)}${status}">
        <span class="letter" aria-hidden="true">${letters[option]}</span>
        <span class="option-text" lang="en">${escapeHtml(text)}</span>
        <span class="option-mark">${icon(mark)}</span>
      </label>
    `;
  }).join("");
  const hint = (visible && unscored) ? `<div class="answer-note warning" role="status">${icon("quiz")}<span>${escapeHtml(question.note)}</span></div>`
    : visible ? `<div class="answer-note" role="status">${icon("check_circle")}<span>Doğru cevap <strong>${letters[question.answer]}</strong> şıkkı.</span></div>` : "";
  const last = index === test.questions.length - 1;
  const nextAction = last ? (finished ? "results" : "finish") : "next";
  const nextLabel = last ? (finished ? "Test Sonucu" : "Testi Bitir") : "Sonraki";
  return `
    <div class="question-body">
      <div class="question-index"><span class="chip">SORU ${String(index + 1).padStart(2, "0")} / ${test.questions.length}</span>
        ${unscored ? '<span class="chip review">PUAN DIŞI</span>' : ""}</div>
      <h3 id="question-title" class="question-text" lang="en" tabindex="-1">${escapeHtml(question.prompt)}</h3>
      <div class="options" role="radiogroup" aria-labelledby="question-title">${options}</div>
      ${hint}
    </div>
    <div class="quiz-actions">
      ${finished ? '<button class="button button-outline" type="button" data-action="results">Test Sonucu</button>' : `
        <button class="button button-outline reveal" type="button" data-action="reveal" aria-pressed="${visible}">
          ${icon(visible ? "visibility_off" : "visibility")} ${visible ? (unscored ? "Notu Gizle" : "Cevabı Gizle") : (unscored ? "Kaynak Notu" : "Cevabı Göster")}
        </button>`}
      <div class="paging">
        <button class="button button-outline" type="button" data-action="previous" aria-label="Önceki soru" ${index === 0 ? "disabled" : ""}>
          ${icon("arrow_back")} <span class="previous-text">Önceki</span>
        </button>
        <button class="button button-primary" type="button" data-action="${nextAction}">
          ${nextLabel} ${icon(last ? "check" : "arrow_forward")}
        </button>
      </div>
    </div>
  `;
}

function renderPractice() {
  const test = currentTest();
  const run = runFor();
  const result = summarize(test, run, run.finished);
  const progress = (result.answered / result.total) * 100;
  byId("quiz").innerHTML = `
    <div class="quiz-header">
      <div class="quiz-header-row">
        <h2 class="quiz-title">${escapeHtml(test.title)}</h2>
        <span class="progress-label">${result.answered} / ${result.total} cevaplandı</span>
      </div>
      <div class="progress-track" role="progressbar" aria-label="Cevaplanan puanlı sorular"
        aria-valuemin="0" aria-valuemax="${result.total}" aria-valuenow="${result.answered}">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
    </div>
    ${run.results ? renderResults(result) : renderQuestion(test, run)}
  `;
  renderMap(test, run);
  updateMetrics();
}

function focusQuestion(scroll = false) {
  const heading = byId("question-title");
  heading.focus({ preventScroll: true });
  if (!scroll) return;
  const quiz = byId("quiz").getBoundingClientRect();
  if (quiz.top < 0 || heading.getBoundingClientRect().bottom > innerHeight) {
    byId("quiz").scrollIntoView({ block: "start" });
  }
}

function goToQuestion(index) {
  const run = runFor();
  run.index = Math.max(0, Math.min(currentTest().questions.length - 1, index));
  run.results = false;
  save();
  renderPractice();
  focusQuestion(true);
}

function finishTest() {
  const run = runFor();
  if (run.finished) return;
  state.history.push(summarize(currentTest(), run, true));
  run.finished = true;
  run.results = true;
  save();
  renderPractice();
  focusQuestion(true);
}

function askToFinish() {
  const { blank } = summarize(currentTest(), runFor(), true);
  if (!blank) return finishTest();
  const dialog = byId("confirmation");
  dialog.returnValue = "";
  byId("confirmation-text").textContent = `${blank} soru boş. Boş sorular puana dahil edilir ve bu deneme tam biten test sayısına eklenmez.`;
  dialog.showModal();
}

function setDrawer(open, restoreFocus = true) {
  const wasOpen = drawerOpen;
  drawerOpen = open && drawerMedia.matches;
  document.body.classList.toggle("menu-open", drawerOpen);
  document.querySelector(".shell").inert = drawerOpen;
  byId("sidebar").inert = drawerMedia.matches && !drawerOpen;
  byId("open-menu").setAttribute("aria-expanded", String(drawerOpen));
  byId("scrim").hidden = !drawerOpen;
  if (drawerOpen) byId("close-menu").focus();
  else if (wasOpen && restoreFocus && drawerMedia.matches) byId("open-menu").focus();
}

byId("theme-toggle").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  save();
  renderTheme();
});
byId("open-menu").addEventListener("click", () => setDrawer(true));
byId("close-menu").addEventListener("click", () => setDrawer(false));
byId("scrim").addEventListener("click", () => setDrawer(false));
drawerMedia.addEventListener("change", () => setDrawer(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawerOpen) setDrawer(false);
  if (event.key !== "Tab" || !drawerOpen) return;
  const first = byId("close-menu");
  const last = byId("test-menu").lastElementChild;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

byId("test-menu").addEventListener("click", (event) => {
  const button = event.target.closest("[data-test]");
  if (!button) return;
  state.active = button.dataset.test;
  setDrawer(false, false);
  save();
  renderMenu();
  renderPractice();
  focusQuestion(true);
});

byId("confirmation").addEventListener("close", (event) => {
  if (event.target.returnValue === "finish") finishTest();
});

byId("quiz").addEventListener("change", (event) => {
  if (event.target.name !== "answer") return;
  const run = runFor();
  if (run.finished) return;
  const option = Number(event.target.value);
  run.choices[run.index] = option;
  save();
  renderPractice();
  byId("quiz").querySelector(`input[value="${option}"]`).focus({ preventScroll: true });
});

document.querySelector(".practice").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.index !== undefined) return goToQuestion(Number(button.dataset.index));
  const run = runFor();
  switch (button.dataset.action) {
    case "next":
      return goToQuestion(run.index + 1);
    case "previous":
      return goToQuestion(run.index - 1);
    case "reveal":
      run.revealed[run.index] = !run.revealed[run.index];
      save();
      renderPractice();
      byId("quiz").querySelector(".reveal").focus({ preventScroll: true });
      break;
    case "finish":
      return askToFinish();
    case "results":
      run.results = true;
      save();
      renderPractice();
      focusQuestion(true);
      break;
    case "review":
      return goToQuestion(0);
    case "restart":
      state.runs[state.active] = newRun();
      return goToQuestion(0);
  }
});

setDrawer(false);
renderTheme();
renderMenu();
renderPractice();
