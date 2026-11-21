"use strict";

const tests = window.QUESTION_BANK;
const storageKey = "afa-sop-pratik:v1";
const $ = (id) => document.getElementById(id);
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const icon = (name, extra = "") =>
  `<svg class="icon ${extra}" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const mobile = matchMedia("(max-width: 959px)");
const strings = {
  tr: {
    home: "Ana sayfa",
    dashboard: "Çalışma paneli",
    intro: "Diamond DA20-C1 · SOP sınavına kendi hızında hazırlan.",
    tests: "Testler",
    questionCount: "{n} soru",
    bank: "6 test · 144 soru",
    selectTest: "Bir test seç, kaldığın yerden devam et.",
    menu: "Çalışma menüsü",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    collapseMenu: "Menüyü daralt",
    expandMenu: "Menüyü genişlet",
    light: "Açık temaya geç",
    dark: "Koyu temaya geç",
    language: "Arayüz dili",
    skip: "İçeriğe geç",
    saved: "İlerleme bu cihazda saklanır",
    disclaimer:
      "AFA ile bağlantısı yoktur. Resmî bir belge veya eğitim materyali değildir.",
    developer: "Geliştirici · ccankaya",
    source:
      "Sorular, paylaşılan AFA SOP kitapçığından alınmıştır. Kişisel çalışma içindir. Uçuşta güncel, kontrollü SOP/AFM esas alınır.",
    solved: "Çözülen soru",
    correct: "Doğru",
    wrong: "Yanlış",
    fullTests: "Tam biten test",
    average: "Test başı ortalama",
    correctAnswers: "Doğru cevap",
    wrongAnswers: "Yanlış cevap",
    correctPerTest: "{n} doğru / test",
    allAttempts: "Tüm denemeler",
    fullOnly: "Tüm puanlı soruları cevaplanan testler",
    averageHelp:
      "Tam biten testlerin eşit ağırlıklı doğru yüzdesi ve ortalama doğru sayısı.",
    notStarted: "Henüz başlanmadı",
    inProgress: "{n}/{total} cevaplandı",
    completed: "Tamamlandı",
    recent: "Son denemeler",
    recentHint: "Son 5 sonuç",
    emptyHistory: "Bitirdiğin testlerin sonuçları burada görünecek.",
    previousAttempt: "Önceki deneme",
    partial: "Eksik tamamlandı",
    practice: "Soru çözümü",
    reviewMode: "Cevap inceleme",
    question: "Soru",
    questionOf: "SORU {n} / {total}",
    answered: "Cevaplandı",
    blank: "Boş",
    flagged: "İşaretli",
    sourceNote: "Kaynak notu",
    finish: "Testi bitir",
    showResults: "Sonucu göster",
    map: "Soru haritası",
    mapLabel: "Soru {n}, {status}",
    mapNote:
      "Cevapların ve işaretlerin otomatik kaydedilir. İstediğin zaman devam edebilirsin.",
    unscored: "Puan dışı",
    singleAnswer: "Tek cevap",
    showAnswer: "Cevabı göster",
    hideAnswer: "Cevabı gizle",
    showNote: "Kaynak notunu göster",
    hideNote: "Kaynak notunu gizle",
    correctOption: "Doğru cevap: {letter}",
    selectedOption: "Seçtiğin cevap",
    flag: "İşaretle",
    unflag: "İşareti kaldır",
    previous: "Önceki",
    next: "Sonraki",
    keyboard: "Sorular arasında gezin: ← →",
    resultTitle: "Test tamamlandı",
    resultSummary: "{total} puanlı sorunun {answered} tanesini cevapladın.",
    excluded: "{n} kaynak notu puana dahil edilmedi.",
    review: "Cevapları incele",
    restart: "Yeniden çöz",
    backHome: "Ana sayfaya dön",
    scoreLabel: "100 üzerinden {n} puan",
    confirmTitle: "Testi bitirelim mi?",
    confirmText:
      "{n} puanlı soru boş. Testi bitirirsen boş sorular puanı düşürür; bu deneme tam biten test sayısına eklenmez.",
    keepGoing: "Çözmeye devam et",
    storage:
      "Tarayıcı depolaması kullanılamıyor. İlerleme yalnızca bu oturumda saklanacak.",
    note0:
      "Kaynakta A ve B birlikte işaretli. Tek bir doğru cevap doğrulanamadığı için bu soru puan dışıdır.",
    note1:
      "Kaynak bu soruda 20 saniyeyi işaretliyor; aynı belgedeki diğer starter soruları 30 saniye veriyor. Bu soru puan dışıdır. Güncel, kontrollü kaynaktan doğrulayın.",
    note2:
      "Kaynakta birden fazla satır işaretli ve tek bir cevap anahtarı doğrulanamıyor. Bu soru puan dışıdır.",
    note3:
      "Kaynakta True işaretli; aynı belgedeki diğer soru fren kullanımının kalkış mesafesini artırdığını belirtiyor. Bu çelişki nedeniyle soru puan dışıdır.",
  },
  en: {
    home: "Home",
    dashboard: "Study dashboard",
    intro: "Diamond DA20-C1 · Prepare for your SOP exam at your own pace.",
    tests: "Tests",
    questionCount: "{n} questions",
    bank: "6 tests · 144 questions",
    selectTest: "Choose a test. Pick up where you left off.",
    menu: "Study navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    collapseMenu: "Collapse sidebar",
    expandMenu: "Expand sidebar",
    light: "Switch to light theme",
    dark: "Switch to dark theme",
    language: "Interface language",
    skip: "Skip to content",
    saved: "Progress saved on this device",
    disclaimer:
      "Not affiliated with AFA. This is not an official document or training material.",
    developer: "Developer · ccankaya",
    source:
      "Questions are taken from the shared AFA SOP booklet. For personal study. Use the current, controlled SOP/AFM for flight operations.",
    solved: "Questions answered",
    correct: "Correct",
    wrong: "Incorrect",
    fullTests: "Full tests completed",
    average: "Average per test",
    correctAnswers: "Correct answers",
    wrongAnswers: "Incorrect answers",
    correctPerTest: "{n} correct / test",
    allAttempts: "Across all attempts",
    fullOnly: "All scored questions answered",
    averageHelp:
      "Equally weighted accuracy and average correct answers across fully completed tests.",
    notStarted: "Not started",
    inProgress: "{n}/{total} answered",
    completed: "Completed",
    recent: "Recent attempts",
    recentHint: "Last 5 results",
    emptyHistory: "Your completed test results will appear here.",
    previousAttempt: "Previous attempt",
    partial: "Submitted incomplete",
    practice: "Practice",
    reviewMode: "Answer review",
    question: "Question",
    questionOf: "QUESTION {n} / {total}",
    answered: "Answered",
    blank: "Unanswered",
    flagged: "Flagged",
    sourceNote: "Source note",
    finish: "Finish test",
    showResults: "View results",
    map: "Question map",
    mapLabel: "Question {n}, {status}",
    mapNote:
      "Answers and flags are saved automatically. You can return at any time.",
    unscored: "Unscored",
    singleAnswer: "Single answer",
    showAnswer: "Show answer",
    hideAnswer: "Hide answer",
    showNote: "Show source note",
    hideNote: "Hide source note",
    correctOption: "Correct answer: {letter}",
    selectedOption: "Your answer",
    flag: "Flag question",
    unflag: "Remove flag",
    previous: "Previous",
    next: "Next",
    keyboard: "Navigate questions: ← →",
    resultTitle: "Test completed",
    resultSummary: "You answered {answered} of {total} scored questions.",
    excluded: "{n} questions with source notes were excluded from scoring.",
    review: "Review answers",
    restart: "Try again",
    backHome: "Back to dashboard",
    scoreLabel: "{n} points out of 100",
    confirmTitle: "Finish this test?",
    confirmText:
      "{n} scored questions are unanswered. Finishing now reduces your score, and this attempt will not count as a fully completed test.",
    keepGoing: "Keep practicing",
    storage:
      "Browser storage is unavailable. Progress will only be kept for this session.",
    note0:
      "Both A and B are marked in the source. A single correct answer could not be verified, so this question is not scored.",
    note1:
      "The source marks 20 seconds here, while other starter questions in the same document give 30 seconds. This question is not scored. Verify against a current, controlled source.",
    note2:
      "Multiple lines are marked in the source and a single answer key could not be verified. This question is not scored.",
    note3:
      "The source marks True, but another question in the document states that braking increases the take-off distance. This conflicting question is not scored.",
  },
};
const testTitles = {
  normal: ["Normal Prosedürler", "Normal Procedures"],
  "normal-b": ["Normal Prosedürler · Varyant", "Normal Procedures · Variant"],
  emergency: ["Acil Durum Prosedürleri", "Emergency Procedures"],
  "emergency-b": ["Acil Durum · Varyant", "Emergency Procedures · Variant"],
  "emergency-2": ["Acil Durum · Test 2", "Emergency Procedures · Test 2"],
  extra: ["Ek Sorular", "Additional Questions"],
};
let storageAvailable = true;
const state = restore();
let drawerOpen = false;
let mapOpen = false;
let view = "home";
const t = (key, values = {}) =>
  strings[state.language][key].replace(/\{(\w+)\}/g, (_, k) =>
    esc(values[k] ?? ""),
  );
const num = (value) =>
  new Intl.NumberFormat(state.language === "tr" ? "tr-TR" : "en-GB", {
    maximumFractionDigits: 1,
  }).format(value);
const title = (test) => testTitles[test.id][state.language === "tr" ? 0 : 1];
const currentTest = () => tests.find((test) => test.id === state.active);
const newRun = () => ({
  index: 0,
  choices: {},
  revealed: {},
  flags: {},
  finished: false,
  results: false,
});
const runFor = (id = state.active) => (state.runs[id] ??= newRun());

function restore() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(storageKey));
  } catch {
    /* Keep temporary state available. */
  }
  const restored = {
    active: tests[0].id,
    theme: "dark",
    language: "tr",
    collapsed: false,
    runs: {},
    history: [],
  };
  if (!saved || typeof saved !== "object") return restored;
  if (tests.some((test) => test.id === saved.active))
    restored.active = saved.active;
  if (["dark", "light"].includes(saved.theme)) restored.theme = saved.theme;
  if (["tr", "en"].includes(saved.language)) restored.language = saved.language;
  restored.collapsed = saved.collapsed === true;
  if (Array.isArray(saved.history))
    restored.history = saved.history.filter(
      (result) =>
        result &&
        ["total", "answered", "correct", "wrong", "blank"].every(
          (key) => Number.isFinite(result[key]) && result[key] >= 0,
        ) &&
        result.total > 0,
    );
  for (const test of tests) {
    const old = saved.runs?.[test.id];
    if (!old || typeof old !== "object") continue;
    const run = {
      index: Math.min(
        test.questions.length - 1,
        Math.max(0, Number.isInteger(old.index) ? old.index : 0),
      ),
      choices: {},
      revealed: {},
      flags: {},
      finished: old.finished === true,
      results: old.results === true && old.finished === true,
    };
    test.questions.forEach((question, index) => {
      const choice = old.choices?.[index];
      if (
        Number.isInteger(choice) &&
        choice >= 0 &&
        choice < question.options.length
      )
        run.choices[index] = choice;
      if (old.revealed?.[index]) run.revealed[index] = true;
      if (old.flags?.[index]) run.flags[index] = true;
    });
    restored.runs[test.id] = run;
  }
  return restored;
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    storageAvailable = false;
  }
}

function summarize(test, run) {
  const result = {
    total: 0,
    answered: 0,
    correct: 0,
    wrong: 0,
    blank: 0,
    review: 0,
  };
  test.questions.forEach((question, index) => {
    if (question.answer === null) {
      result.review++;
      return;
    }
    result.total++;
    if (!Number.isInteger(run.choices[index])) result.blank++;
    else {
      result.answered++;
      result[run.choices[index] === question.answer ? "correct" : "wrong"]++;
    }
  });
  return result;
}

function progress(test, run) {
  return run ? Object.keys(run.choices).length : 0;
}

function metricData() {
  const totals = { answered: 0, correct: 0, wrong: 0 };
  const add = (result) =>
    Object.keys(totals).forEach((key) => (totals[key] += result[key]));
  state.history.forEach(add);
  tests.forEach((test) => {
    const run = state.runs[test.id];
    if (run && !run.finished) add(summarize(test, run));
  });
  const full = state.history.filter((result) => result.blank === 0);
  const average = (fn) =>
    full.length
      ? full.reduce((sum, result) => sum + fn(result), 0) / full.length
      : 0;
  return {
    totals,
    count: full.length,
    percent: average((result) => (result.correct / result.total) * 100),
    correct: average((result) => result.correct),
  };
}

function renderMenu() {
  $("sidebar-nav").innerHTML =
    `<button class="nav-home" data-action="home" ${view === "home" ? 'aria-current="page"' : ""} title="${t("home")}">${icon("layout-dashboard")}<span class="home-label">${t("home")}</span></button>
    <div class="nav-section"><span>${t("tests")}</span><span>06</span></div>
    ${tests
      .map(
        (
          test,
          index,
        ) => `<button class="test-tab" data-test="${test.id}" ${view === "test" && test.id === state.active ? 'aria-current="page"' : ""} title="${esc(title(test))}" aria-label="${esc(title(test))}, ${t("questionCount", { n: test.questions.length })}">
      <span class="tab-number">${String(index + 1).padStart(2, "0")}</span><span class="tab-copy"><span class="tab-name">${esc(title(test))}</span><span class="tab-count">${t("questionCount", { n: test.questions.length })}</span></span>${icon("chevron-right", "tab-chevron")}</button>`,
      )
      .join("")}`;
}

function renderChrome() {
  document.documentElement.lang = state.language;
  document.documentElement.dataset.theme = state.theme;
  document.querySelector('meta[name="theme-color"]').content =
    state.theme === "dark" ? "#0b111b" : "#f3f6f9";
  $("theme-toggle").innerHTML = icon(state.theme === "dark" ? "sun" : "moon");
  $("theme-toggle").setAttribute(
    "aria-label",
    t(state.theme === "dark" ? "light" : "dark"),
  );
  $("theme-toggle").title = t(state.theme === "dark" ? "light" : "dark");
  $("sidebar").setAttribute("aria-label", t("menu"));
  $("sidebar-nav").setAttribute("aria-label", t("tests"));
  $("skip-link").textContent = t("skip");
  $("disclaimer").textContent = t("disclaimer");
  $("developer-label").textContent = t("developer");
  $("local-status").textContent = t("saved");
  $("language-switch").setAttribute("aria-label", t("language"));
  document
    .querySelectorAll("[data-language]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.language === state.language),
      ),
    );
  document.querySelector(".brand-copy strong").innerHTML =
    `SOP<span>${state.language === "tr" ? "PRATİK" : "PRACTICE"}</span>`;
  $("close-menu").innerHTML = icon("x");
  $("close-menu").setAttribute("aria-label", t("closeMenu"));
  $("scrim").setAttribute("aria-label", t("closeMenu"));
  renderSidebarState();
  renderMenu();
}

function renderSidebarState() {
  const expanded = mobile.matches ? drawerOpen : !state.collapsed;
  document.body.classList.toggle("sidebar-collapsed", state.collapsed);
  document.body.classList.toggle("menu-open", drawerOpen);
  $("menu-toggle").innerHTML = icon(
    mobile.matches
      ? "menu-2"
      : expanded
        ? "layout-sidebar-left-collapse"
        : "layout-sidebar-left-expand",
  );
  $("menu-toggle").setAttribute("aria-expanded", String(expanded));
  $("menu-toggle").setAttribute(
    "aria-label",
    t(mobile.matches ? "openMenu" : expanded ? "collapseMenu" : "expandMenu"),
  );
  $("sidebar").inert = mobile.matches && !drawerOpen;
  $("shell").inert = drawerOpen;
  $("scrim").hidden = !drawerOpen;
  if (drawerOpen) {
    $("sidebar").setAttribute("role", "dialog");
    $("sidebar").setAttribute("aria-modal", "true");
  } else {
    $("sidebar").removeAttribute("role");
    $("sidebar").removeAttribute("aria-modal");
  }
}

function footnote() {
  return `<footer class="footnote">${icon("info-circle")}<span>${t("source")}</span></footer>`;
}

function renderHome() {
  const data = metricData();
  const cards = [
    ["clipboard-check", "solved", num(data.totals.answered), "", "allAttempts"],
    [
      "circle-check",
      "correctAnswers",
      num(data.totals.correct),
      "good",
      "allAttempts",
    ],
    ["circle-x", "wrongAnswers", num(data.totals.wrong), "bad", "allAttempts"],
    ["target", "fullTests", num(data.count), "", "fullOnly"],
    [
      "chart-line",
      "average",
      data.count ? `${num(data.percent)}%` : "—",
      "",
      "averageHelp",
    ],
  ];
  return `<section aria-labelledby="home-title"><div class="page-heading"><div><h1 id="home-title">${t("dashboard")}</h1><p>${t("intro")}</p></div><span class="aircraft-tag">${icon("plane")} DIAMOND DA20-C1</span></div>
    <div class="metrics">${cards.map(([symbol, label, value, color, help]) => `<div class="metric ${color}" title="${t(help)}"><div class="metric-top"><span>${t(label)}</span>${icon(symbol)}</div><strong class="metric-value">${value}</strong><p class="metric-detail">${label === "average" ? t("correctPerTest", { n: data.count ? num(data.correct) : "—" }) : t(label === "fullTests" ? "fullOnly" : "allAttempts")}</p></div>`).join("")}</div>
    <div class="section-heading"><div><h2>${t("tests")}</h2><p>${t("selectTest")}</p></div><span>${t("bank")}</span></div>
    <div class="test-grid">${tests
      .map((test, index) => {
        const run = state.runs[test.id];
        const answered = progress(test, run);
        const status = run?.finished
          ? t("completed")
          : answered
            ? t("inProgress", { n: answered, total: test.questions.length })
            : t("notStarted");
        return `<button class="test-card" data-test="${test.id}"><span class="test-card-number">${String(index + 1).padStart(2, "0")}</span><div class="test-card-copy"><h3>${esc(title(test))}</h3><p>${t("questionCount", { n: test.questions.length })} <span>· ${status}</span></p><div class="mini-progress"><span style="width:${(answered / test.questions.length) * 100}%"></span></div></div>${icon("arrow-right")}</button>`;
      })
      .join("")}</div></section>
    <section class="recent-section" aria-labelledby="recent-title"><div class="section-heading"><h2 id="recent-title">${t("recent")}</h2><span>${t("recentHint")}</span></div>
      ${
        state.history.length
          ? `<div class="recent-list">${state.history
              .slice(-5)
              .reverse()
              .map((result) => {
                const test = tests.find((item) => item.id === result.testId);
                const date = result.date
                  ? new Date(result.date).toLocaleString(
                      state.language === "tr" ? "tr-TR" : "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : "";
                return `<div class="recent-row">${icon("clipboard-check")}<div>${test ? esc(title(test)) : t("previousAttempt")}<small>${date ? `${esc(date)} · ` : ""}${t(result.blank ? "partial" : "completed")}</small></div><span>${result.correct}/${result.total}</span><strong>${num((result.correct / result.total) * 100)}%</strong></div>`;
              })
              .join("")}</div>`
          : `<p class="empty-history">${icon("chart-line")}${t("emptyHistory")}</p>`
      }</section>${footnote()}`;
}

function questionStatus(question, run, index) {
  if (question.answer === null) return "review";
  if (!Number.isInteger(run.choices[index])) return "blank";
  if (!run.finished && !run.revealed[index]) return "answered";
  return run.choices[index] === question.answer ? "correct" : "wrong";
}
const statusKey = {
  review: "sourceNote",
  answered: "answered",
  correct: "correct",
  wrong: "wrong",
  blank: "blank",
};

function renderMap(test, run) {
  const answered = progress(test, run);
  const fraction = `${answered}/${test.questions.length}`;
  const legend = ["answered", "correct", "wrong", "flagged"];
  if (test.questions.some((q) => q.answer === null)) legend.push("review");
  return `<aside class="navigator" aria-label="${t("map")}"><div class="map-heading"><h2>${t("map")}</h2><span>${fraction}</span></div><div class="progress-track map-progress"><div class="progress-fill" style="width:${(answered / test.questions.length) * 100}%"></div></div>
    <button class="map-toggle" data-action="toggle-map" aria-expanded="${mapOpen}" aria-controls="map-content"><span>${icon("layout-dashboard")}${t("map")} <span>· ${fraction}</span></span>${icon("chevron-down")}</button>
    <div class="map-content ${mapOpen ? "is-open" : ""}" id="map-content"><div class="question-map">${test.questions
      .map((question, index) => {
        const status = questionStatus(question, run, index);
        return `<button class="map-button ${run.flags[index] ? "is-flagged" : ""}" data-index="${index}" data-status="${status}" aria-label="${t("mapLabel", { n: index + 1, status: t(statusKey[status]) })}${run.flags[index] ? `, ${t("flagged")}` : ""}" ${!run.results && index === run.index ? 'aria-current="step"' : ""}>${index + 1}</button>`;
      })
      .join(
        "",
      )}</div><div class="legend">${legend.map((status) => `<span><i class="dot ${status}" aria-hidden="true"></i>${t(statusKey[status] || status)}</span>`).join("")}</div><p class="map-note">${t("mapNote")}</p></div></aside>`;
}

function sourceNote(test, index) {
  // The bank's note is the stable lookup key; numbering can change without losing its translation.
  const notes = tests.flatMap((item) =>
    item.questions.filter((q) => q.answer === null).map((q) => q.note),
  );
  const position = notes.indexOf(test.questions[index].note);
  return t(`note${position}`);
}

function renderQuestion(test, run) {
  const question = test.questions[run.index];
  const selected = run.choices[run.index];
  const visible = run.finished || Boolean(run.revealed[run.index]);
  const unscored = question.answer === null;
  const last = run.index === test.questions.length - 1;
  const nextAction = last ? (run.finished ? "results" : "finish") : "next";
  return `<section class="question-card" aria-labelledby="question-title"><div class="question-meta"><span class="question-number">${t("questionOf", { n: String(run.index + 1).padStart(2, "0"), total: test.questions.length })}</span><div class="question-tags"><span class="chip ${unscored ? "warning" : ""}">${t(unscored ? "unscored" : "singleAnswer")}</span></div></div>
    <h2 id="question-title" class="question-text" lang="en" tabindex="-1">${esc(question.prompt)}</h2>
    <div class="options" role="radiogroup" aria-labelledby="question-title">${question.options
      .map((text, option) => {
        const correct = visible && option === question.answer;
        const wrong = visible && !unscored && option === selected && !correct;
        const checked = option === selected;
        return `<label class="option${checked ? " is-selected" : ""}${correct ? " is-correct" : wrong ? " is-wrong" : ""}${run.finished ? " is-locked" : ""}"><input type="radio" name="answer" value="${option}" ${checked ? "checked" : ""} ${run.finished ? "disabled" : ""} aria-label="${letters[option]}. ${esc(text)}${correct ? ` — ${t("correctAnswers")}` : wrong ? ` — ${t("wrongAnswers")}` : ""}" lang="en"><span class="letter" aria-hidden="true">${letters[option]}</span><span class="option-text" lang="en">${esc(text)}</span><span class="option-mark" aria-hidden="true">${correct ? icon("check") : wrong ? icon("x") : checked ? icon("check") : ""}</span></label>`;
      })
      .join("")}</div>
    ${visible ? (unscored ? `<div class="answer-note warning" role="status">${icon("info-circle")}<span>${sourceNote(test, run.index)}</span></div>` : `<div class="answer-note" role="status">${icon("circle-check")}<span><strong>${t("correctOption", { letter: letters[question.answer] })}</strong><span class="answer-text" lang="en">${esc(question.options[question.answer])}</span></span></div>`) : ""}
    <div class="question-tools">${run.finished ? `<button class="text-button" data-action="results">${icon("chart-line")}${t("showResults")}</button>` : `<button class="text-button" data-action="reveal" aria-pressed="${visible}">${icon(visible ? "eye-off" : "eye")}${t(unscored ? (visible ? "hideNote" : "showNote") : visible ? "hideAnswer" : "showAnswer")}</button>`}
      <button class="text-button ${run.flags[run.index] ? "flagged" : ""}" data-action="flag" aria-pressed="${Boolean(run.flags[run.index])}">${icon("flag")}${t(run.flags[run.index] ? "unflag" : "flag")}</button></div></section>
    <div class="paging"><button class="button button-outline" data-action="previous" ${run.index === 0 ? "disabled" : ""}>${icon("arrow-left")}${t("previous")}</button><span class="keyboard-hint">${t("keyboard")}</span><button class="button button-primary" data-action="${nextAction}">${t(last ? (run.finished ? "showResults" : "finish") : "next")}${icon(last ? "check" : "arrow-right")}</button></div>`;
}

function renderResults(test, run, result) {
  const score = num((result.correct / result.total) * 100);
  return `<section class="question-card results" aria-labelledby="question-title"><span class="result-emblem">${icon("clipboard-check")}</span><h2 id="question-title" tabindex="-1">${t("resultTitle")}</h2><p>${t("resultSummary", result)}</p><div class="score" aria-label="${t("scoreLabel", { n: score })}">${score}<span> / 100</span></div>
    <div class="result-stats">${[
      ["correct", "good"],
      ["wrong", "bad"],
      ["blank", ""],
    ]
      .map(
        ([key, color]) =>
          `<div class="result-stat ${color}"><strong>${result[key]}</strong>${t(key)}</div>`,
      )
      .join(
        "",
      )}</div>${result.review ? `<p>${t("excluded", { n: result.review })}</p>` : ""}
    <div class="result-actions"><button class="button button-outline" data-action="review">${icon("eye")}${t("review")}</button><button class="button button-primary" data-action="restart">${icon("rotate-clockwise")}${t("restart")}</button></div><button class="text-button" data-action="home">${icon("arrow-left")}${t("backHome")}</button></section>`;
}

function renderPractice() {
  const test = currentTest();
  const run = runFor();
  const result = summarize(test, run);
  const answered = progress(test, run);
  return `<div class="practice-toolbar"><div><p class="practice-caption">${t(run.finished ? "reviewMode" : "practice")}</p><h1 class="practice-title">${esc(title(test))}</h1><p class="practice-subtitle">${t("inProgress", { n: answered, total: test.questions.length })}</p></div><div class="toolbar-right"><span class="question-position">${run.index + 1} / ${test.questions.length}</span><button class="button button-outline button-small" data-action="${run.finished ? "results" : "finish"}">${t(run.finished ? "showResults" : "finish")}</button></div></div>
    <div class="progress-track practice-progress" role="progressbar" aria-label="${t("answered")}" aria-valuemin="0" aria-valuemax="${test.questions.length}" aria-valuenow="${answered}"><div class="progress-fill" style="width:${(answered / test.questions.length) * 100}%"></div></div>
    <div class="practice-grid"><div class="quiz-column">${run.results ? renderResults(test, run, result) : renderQuestion(test, run)}</div>${renderMap(test, run)}</div>${footnote()}`;
}

function render() {
  $("page-label").textContent =
    view === "home" ? t("home") : title(currentTest());
  document.title = `${view === "home" ? t("dashboard") : title(currentTest())} · AFA SOP Pratik`;
  $("main").innerHTML =
    `${!storageAvailable ? `<p class="storage-note" role="status">${t("storage")}</p>` : ""}${view === "home" ? renderHome() : renderPractice()}`;
  renderMenu();
}

function setDrawer(open, focus = true) {
  const wasOpen = drawerOpen;
  drawerOpen = open && mobile.matches;
  renderSidebarState();
  if (drawerOpen) $("close-menu").focus();
  else if (wasOpen && focus) $("menu-toggle").focus();
}

function readRoute() {
  const id = location.hash.startsWith("#test/") ? location.hash.slice(6) : "";
  view = tests.some((test) => test.id === id) ? "test" : "home";
  if (view === "test") state.active = id;
  setDrawer(false, false);
  save();
  render();
}

function navigate(id) {
  const hash = id ? `#test/${id}` : "#home";
  if (location.hash === hash) readRoute();
  else {
    location.hash = hash;
    return;
  }
  $("main").focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
}

function focusQuestion(scroll = false) {
  const heading = $("question-title");
  heading?.focus({ preventScroll: true });
  if (scroll && heading) {
    const card = document.querySelector(".question-card");
    if (
      card.getBoundingClientRect().top < 0 ||
      heading.getBoundingClientRect().bottom > innerHeight
    )
      card.scrollIntoView({ block: "start" });
  }
}

function goToQuestion(index) {
  const run = runFor();
  run.index = Math.max(0, Math.min(currentTest().questions.length - 1, index));
  run.results = false;
  save();
  render();
  focusQuestion(true);
}

function finishTest() {
  const run = runFor();
  if (run.finished) return;
  state.history.push({
    ...summarize(currentTest(), run),
    testId: state.active,
    date: new Date().toISOString(),
  });
  run.finished = true;
  run.results = true;
  save();
  render();
  focusQuestion(true);
}

function askToFinish() {
  const result = summarize(currentTest(), runFor());
  if (!result.blank) return finishTest();
  $("dialog-icon").innerHTML = icon("clipboard-check");
  $("confirmation-title").textContent = t("confirmTitle");
  $("confirmation-text").textContent = t("confirmText", { n: result.blank });
  $("cancel-finish").textContent = t("keepGoing");
  $("confirm-finish").textContent = t("finish");
  $("confirmation").returnValue = "";
  $("confirmation").showModal();
}

function performAction(action) {
  if (action === "home") return navigate();
  if (view !== "test") return;
  const run = runFor();
  if (action === "next") return goToQuestion(run.index + 1);
  if (action === "previous") return goToQuestion(run.index - 1);
  if (action === "finish") return askToFinish();
  if (action === "review") return goToQuestion(0);
  if (action === "restart") {
    state.runs[state.active] = newRun();
    return goToQuestion(0);
  }
  if (action === "results") {
    run.results = true;
    save();
    render();
    return focusQuestion(true);
  }
  if (action === "reveal") run.revealed[run.index] = !run.revealed[run.index];
  if (action === "flag") run.flags[run.index] = !run.flags[run.index];
  if (action === "toggle-map") mapOpen = !mapOpen;
  save();
  render();
  document
    .querySelector(`[data-action="${action}"]`)
    ?.focus({ preventScroll: true });
}

document.addEventListener("click", (event) => {
  const testButton = event.target.closest("[data-test]");
  if (testButton) return navigate(testButton.dataset.test);
  const mapButton = event.target.closest("[data-index]");
  if (mapButton && view === "test") {
    if (matchMedia("(max-width: 1139px)").matches) mapOpen = false;
    return goToQuestion(Number(mapButton.dataset.index));
  }
  const button = event.target.closest("[data-action]");
  if (button) performAction(button.dataset.action);
});
document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  navigate();
});
$("skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  $("main").focus();
});
$("main").addEventListener("change", (event) => {
  if (event.target.name !== "answer" || view !== "test") return;
  const run = runFor();
  if (run.finished) return;
  const choice = Number(event.target.value);
  run.choices[run.index] = choice;
  save();
  render();
  document
    .querySelector(`input[name="answer"][value="${choice}"]`)
    ?.focus({ preventScroll: true });
});
$("theme-toggle").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  save();
  renderChrome();
});
$("language-switch").addEventListener("click", (event) => {
  const button = event.target.closest("[data-language]");
  if (!button) return;
  state.language = button.dataset.language;
  save();
  renderChrome();
  render();
  button.focus({ preventScroll: true });
});
$("menu-toggle").addEventListener("click", () => {
  if (mobile.matches) setDrawer(!drawerOpen);
  else {
    state.collapsed = !state.collapsed;
    save();
    renderSidebarState();
  }
});
$("close-menu").addEventListener("click", () => setDrawer(false));
$("scrim").addEventListener("click", () => setDrawer(false));
mobile.addEventListener("change", () => setDrawer(false));
$("confirmation").addEventListener("close", () => {
  if ($("confirmation").returnValue === "finish") finishTest();
});
window.addEventListener("hashchange", () => {
  readRoute();
  $("main").focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
});
document.addEventListener("keydown", (event) => {
  if (drawerOpen) {
    if (event.key === "Escape") {
      event.preventDefault();
      return setDrawer(false);
    }
    if (event.key === "Tab") {
      const elements = [
        ...$("sidebar").querySelectorAll("a[href],button:not([disabled])"),
      ].filter((el) => el.getClientRects().length);
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    return;
  }
  if (
    view !== "test" ||
    $("confirmation").open ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    /INPUT|TEXTAREA|SELECT|BUTTON/.test(event.target.tagName)
  )
    return;
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    goToQuestion(runFor().index + (event.key === "ArrowRight" ? 1 : -1));
  }
});

readRoute();
renderChrome();
