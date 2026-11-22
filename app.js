"use strict";

const bankTests = window.QUESTION_BANK;
const tests = bankTests.filter((test) => test.id !== "similar");
const storageKey = "afa-sop-pratik:v1";
const preferenceKey = "afa-sop-pratik:preferences";
const consentCookie = "afa_sop_storage";
const analyticsCookie = "afa_sop_analytics";
const scoringVersion = 2;
const bankVersion = 2;
const newlyScoredIds = new Set(["AFA-022", "AFA-037", "AFA-080", "AFA-112"]);
const allQuestions = bankTests.flatMap((test) =>
  test.questions.map((question, index) => ({
    ...question,
    key: question.questionId,
    source: test.id,
    position: index,
  })),
);
const questionsByKey = new Map(
  allQuestions.map((question) => [question.key, question]),
);
const questionsById = questionsByKey;
const primaryQuestions = allQuestions.filter(
  (question) => question.source !== "similar",
);
const previousTestLayouts = {
  normal: questionIdRange(1, 20),
  "normal-b": questionIdRange(21, 40),
  emergency: questionIdRange(41, 60),
  "emergency-b": questionIdRange(61, 94),
  "emergency-2": questionIdRange(95, 117),
  extra: questionIdRange(118, 144),
};
const searchIndex = allQuestions.map((question) => ({
  question,
  prompt: searchText(question.prompt),
  choices: searchText(question.options.join(" ")),
}));
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
    unseen: "Görülmemiş sorular",
    solvedCoverage: "Soru bankası ilerlemesi",
    solvedCoverageDetail: "{n}/{total} benzersiz soru cevaplandı",
    averageScore: "Ortalama puan",
    averageScoreDetail: "Gönderilen testler · 100 üzerinden",
    testAttempts: "{n} deneme · {repeats} tekrar",
    questionAttempts: "{n} kez cevaplandı",
    noUnseen: "Tüm soruları gördün.",
    analyticsConsent: "Anonim ziyaret analizine izin ver (Vercel)",
    appName: "SOP Pratik",
    allQuestions: "Tüm soruları çöz",
    combine: "Testleri birleştir",
    mixedTest: "Birleşik test",
    startCombined: "Seçili testleri çöz ({n})",
    startCombinedHint: "Birleştirmek için en az iki test seç.",
    selectForMix: "Teste ekle: {name}",
    wrongTest: "Yanlışları tekrar çöz",
    wrongEmpty: "Şu anda tekrar çözülecek yanlış soru yok.",
    worstTest: "En zor sorular",
    mostIncorrect: "En çok yanlış yapılan sorular",
    mistakesDetail: "{wrong}/{total} yanlış · %{rate}",
    elapsedTime: "Geçen süre",
    totalTime: "Toplam çözme süresi",
    questionTimes: "Soru başına süre",
    timingPartial:
      "Süre kaydı, bu özellik eklendikten sonraki çalışmayı gösterir.",
    search: "Soru ara",
    searchPlaceholder: "Ör. AFA-012 veya oil temperature",
    searchHint: "Soru ID’sini veya sorudan ya da şıklardan birkaç kelime yaz.",
    searchCount: "{n} soru bulundu",
    searchEmpty: "Eşleşen soru bulunamadı.",
    openQuestion: "Soruyu testte aç",
    closeSearch: "Aramayı kapat",
    storageTitle: "Çerez ve tarayıcı depolama tercihleri",
    storageIntro:
      "Kabul edersen ilerleme ve istatistikler bu tarayıcıda saklanır. Yalnızca gereklileri seçersen çerez, dil ve tema tercihlerin hatırlanır.",
    acceptStorage: "Kabul et",
    necessaryStorage: "Yalnızca gereklileri kabul et",
    rejectStorage: "Reddet",
    storageSettings: "Çerez tercihleri",
    privacy:
      "Cevaplar ve çalışma kayıtları tarayıcıda kalır. İzin verirsen Vercel anonim ziyaret istatistikleri toplar.",
    sessionOnly: "İlerleme yalnızca açık sayfada tutulur",
    home: "Ana sayfa",
    dashboard: "Çalışma paneli",
    intro: "Diamond DA20-C1 · SOP sınavına kendi hızında hazırlan.",
    tests: "Testler",
    questionCount: "{n} soru",
    bank: "{n} ana soru · {similar} benzer soru",
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
  },
  en: {
    unseen: "Unseen questions",
    solvedCoverage: "Question bank progress",
    solvedCoverageDetail: "{n}/{total} unique questions answered",
    averageScore: "Average score",
    averageScoreDetail: "Submitted tests · out of 100",
    testAttempts: "{n} attempts · {repeats} repeats",
    questionAttempts: "Answered {n} times",
    noUnseen: "You’ve seen every question.",
    analyticsConsent: "Allow anonymous visitor analytics (Vercel)",
    appName: "SOP Practice",
    allQuestions: "Practice all questions",
    combine: "Combine tests",
    mixedTest: "Combined test",
    startCombined: "Start selected tests ({n})",
    startCombinedHint: "Select at least two tests to combine.",
    selectForMix: "Include in combined test: {name}",
    wrongTest: "Retest Incorrect",
    wrongEmpty: "No incorrect answers to retest yet.",
    worstTest: "Worst Questions",
    mostIncorrect: "Most missed questions",
    mistakesDetail: "{wrong}/{total} wrong · {rate}%",
    elapsedTime: "Elapsed time",
    totalTime: "Total time spent",
    questionTimes: "Time per question",
    timingPartial: "Recorded time reflects work since time tracking was added.",
    search: "Search questions",
    searchPlaceholder: "E.g. AFA-012 or oil temperature",
    searchHint:
      "Enter a question ID or a few words from a question or its choices.",
    searchCount: "{n} questions found",
    searchEmpty: "No matching questions.",
    openQuestion: "Open question in test",
    closeSearch: "Close search",
    storageTitle: "Cookie and browser storage preferences",
    storageIntro:
      "Accept to save progress and statistics in this browser. Essentials only remembers your cookie, language and theme preferences.",
    acceptStorage: "Accept",
    necessaryStorage: "Accept essentials only",
    rejectStorage: "Reject",
    storageSettings: "Cookie preferences",
    privacy:
      "Answers and study records stay in your browser. If you opt in, Vercel collects anonymous visitor analytics.",
    sessionOnly: "Progress is kept only while this page is open",
    home: "Home",
    dashboard: "Study dashboard",
    intro: "Diamond DA20-C1 · Prepare for your SOP exam at your own pace.",
    tests: "Tests",
    questionCount: "{n} questions",
    bank: "{n} core questions · {similar} similar questions",
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
  },
};
const testTitles = {
  similar: ["Benzer Sorular", "Similar Questions"],
  normal: ["Normal Prosedürler", "Normal Procedures"],
  "normal-b": ["Normal Prosedürler · Varyant", "Normal Procedures · Variant"],
  emergency: ["Acil Durum Prosedürleri", "Emergency Procedures"],
  "emergency-b": ["Acil Durum · Varyant", "Emergency Procedures · Variant"],
  "emergency-2": ["Acil Durum · Test 2", "Emergency Procedures · Test 2"],
  extra: ["Ek Sorular", "Additional Questions"],
};
let storageAvailable = true;
let consent = readConsent();
let analyticsAllowed = readAnalyticsConsent();
let consentOpen = !consent;
let state = restore();
let drawerOpen = false;
let mapOpen = false;
let view = "home";
let combining = false;
const selectedTests = new Set();
let advanceTimer;
let questionClock = null;
const t = (key, values = {}) =>
  strings[state.language][key].replace(/\{(\w+)\}/g, (_, k) =>
    esc(values[k] ?? ""),
  );
const num = (value) =>
  new Intl.NumberFormat(state.language === "tr" ? "tr-TR" : "en-GB", {
    maximumFractionDigits: 1,
  }).format(value);
const title = (test) =>
  testTitles[test.id]?.[state.language === "tr" ? 0 : 1] ??
  t(
    test.id === "all"
      ? "allQuestions"
      : test.id === "wrong"
        ? "wrongTest"
        : test.id === "worst"
          ? "worstTest"
          : test.id === "unseen"
            ? "unseen"
            : "mixedTest",
  );

function getTest(id, data = state) {
  const base = bankTests.find((test) => test.id === id);
  if (base)
    return {
      ...base,
      questions: allQuestions.filter((question) => question.source === id),
    };
  if (id === "all") return { id, questions: primaryQuestions };
  if (id === "unseen") {
    const questions =
      data.runs.unseen?.keys?.map((key) => questionsByKey.get(key)) ??
      unseenQuestions(data);
    return questions.length ? { id, questions } : undefined;
  }
  if (id === "wrong" || id === "worst") {
    const keys =
      data.runs[id]?.keys ??
      reviewPool(id, data).map((question) => question.key);
    return keys.length
      ? { id, questions: keys.map((key) => questionsByKey.get(key)) }
      : undefined;
  }
  if (!/^mix-[1-9]\d?$/.test(id)) return undefined;
  const mask = Number(id.slice(4));
  if (mask >= 2 ** tests.length) return undefined;
  const sources = tests
    .filter((_, index) => mask & (1 << index))
    .map((test) => test.id);
  if (sources.length < 2) return undefined;
  return {
    id,
    questions: allQuestions.filter((question) =>
      sources.includes(question.source),
    ),
  };
}

function questionIdRange(first, last) {
  return Array.from(
    { length: last - first + 1 },
    (_, index) => `AFA-${String(first + index).padStart(3, "0")}`,
  );
}

function resolvePreviousKey(key) {
  if (typeof key !== "string") return undefined;
  const [source, position] = key.split("/");
  return previousTestLayouts[source]?.[position] ?? key;
}

function previousLayout(id) {
  if (id === "all") return Object.values(previousTestLayouts).flat();
  if (id.startsWith("mix-")) {
    const mask = Number(id.slice(4));
    return Object.values(previousTestLayouts).flatMap((keys, index) =>
      mask & (1 << index) ? keys : [],
    );
  }
  return previousTestLayouts[id];
}

const currentTest = () => getTest(state.active);
function previousTimeLimit(test) {
  return Math.max(5, Math.ceil((test.questions.length * 75) / 60)) * 60_000;
}
const newRun = (test) => ({
  index: 0,
  choices: {},
  revealed: {},
  flags: {},
  finished: false,
  results: false,
  startedAt: Date.now(),
  questionMs: {},
  ...(["wrong", "worst", "unseen"].includes(test.id)
    ? { keys: test.questions.map((question) => question.key) }
    : {}),
});
const runFor = (id = state.active) => (state.runs[id] ??= newRun(getTest(id)));

function readConsent() {
  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${consentCookie}=`));
  const value = entry?.slice(consentCookie.length + 1);
  return ["accepted", "essential"].includes(value) ? value : null;
}

function readAnalyticsConsent() {
  return (
    readConsent() === "accepted" &&
    document.cookie.split("; ").includes(`${analyticsCookie}=yes`)
  );
}

function startAnalytics() {
  if (
    !analyticsAllowed ||
    !readAnalyticsConsent() ||
    location.origin !== "https://afa-sop-pratik.vercel.app" ||
    $("vercel-analytics")
  )
    return;
  window.va =
    window.va ||
    function () {
      (window.vaq = window.vaq || []).push(arguments);
    };
  window.va("beforeSend", (event) => {
    if (
      !analyticsAllowed ||
      !readAnalyticsConsent() ||
      event.type !== "pageview"
    )
      return null;
    return { ...event, url: `${location.origin}/` };
  });
  const script = document.createElement("script");
  script.id = "vercel-analytics";
  script.src = "/_vercel/insights/script.js";
  script.defer = true;
  document.head.append(script);
}

function restore() {
  let saved;
  if (consent === "accepted") {
    try {
      saved = JSON.parse(localStorage.getItem(storageKey));
    } catch {
      /* Keep temporary state available. */
    }
  }
  const preferences = readPreferences();
  const restored = {
    active: tests[0].id,
    theme: preferences.theme ?? (saved?.theme === "light" ? "light" : "dark"),
    language: preferences.language ?? "en",
    collapsed: false,
    runs: {},
    history: [],
    covered: [],
    missed: [],
    seen: [],
    attempts: {},
    errorCounts: {},
    incorrect: [],
    scoringVersion,
    bankVersion,
  };
  if (!saved || typeof saved !== "object") return restored;
  const needsRescore = (id) =>
    saved.scoringVersion !== scoringVersion && newlyScoredIds.has(id);
  restored.collapsed = saved.collapsed === true;
  if (Array.isArray(saved.history))
    restored.history = saved.history.filter(
      (result) =>
        result &&
        ["total", "answered", "correct", "wrong", "blank"].every(
          (key) => Number.isFinite(result[key]) && result[key] >= 0,
        ) &&
        result.total >= 0,
    );
  restored.covered = tests
    .map((test) => test.id)
    .filter(
      (id) =>
        saved.covered?.includes?.(id) ||
        restored.history.some(
          (result) => result.testId === id && result.blank === 0,
        ),
    );
  const needsBankMigration = saved.bankVersion !== bankVersion;
  const oldKeys = (keys) =>
    Array.isArray(keys)
      ? keys.map(needsBankMigration ? resolvePreviousKey : (key) => key)
      : [];
  restored.missed = validKeys(oldKeys(saved.missed));
  const legacyErrors = !saved.errorCounts || !Array.isArray(saved.incorrect);
  const latest = new Map();
  if (!legacyErrors) {
    restored.incorrect = Array.from(
      new Set(saved.incorrect.filter(isScoredId)),
    );
    for (const [id, count] of Object.entries(saved.errorCounts)) {
      if (isScoredId(id) && Number.isSafeInteger(count) && count > 0)
        restored.errorCounts[id] = count;
    }
  }
  const seen = new Set(
    Array.isArray(saved.seen)
      ? saved.seen.filter((id) => questionsById.has(id))
      : [],
  );
  const hasAttemptTotals = saved.attempts && typeof saved.attempts === "object";
  if (hasAttemptTotals) {
    for (const [id, count] of Object.entries(saved.attempts)) {
      if (questionsById.has(id) && Number.isSafeInteger(count) && count > 0) {
        if (!needsRescore(id)) restored.attempts[id] = count;
        seen.add(id);
      }
    }
  }
  for (const question of allQuestions) {
    if (
      !restored.covered.includes(question.source) ||
      question.answer === null ||
      needsRescore(question.questionId)
    )
      continue;
    seen.add(question.questionId);
  }
  for (const [id, old] of Object.entries(saved.runs ?? {})) {
    if (!old || typeof old !== "object") continue;
    const generated = ["wrong", "worst", "unseen"].includes(id);
    const previousKeys = generated
      ? oldKeys(old.keys)
      : needsBankMigration
        ? previousLayout(id)
        : undefined;
    const keys = validKeys(previousKeys, id === "unseen").filter(
      (key) => id !== "unseen" || questionsByKey.get(key).source !== "similar",
    );
    if (generated && !keys.length) continue;
    if (generated) restored.runs[id] = { keys };
    const test = getTest(id, restored);
    if (!test) {
      if (generated) delete restored.runs[id];
      continue;
    }
    const oldIndex = Math.max(0, Number.isInteger(old.index) ? old.index : 0);
    const oldPositions = previousKeys
      ? new Map(previousKeys.map((key, index) => [key, index]))
      : null;
    // Keep the same question when it still belongs to this test.
    const resumedIndex = oldPositions
      ? test.questions.findIndex(
          (question) => (oldPositions.get(question.key) ?? -1) >= oldIndex,
        )
      : oldIndex;
    const run = {
      index: Math.min(
        test.questions.length - 1,
        resumedIndex === -1 ? test.questions.length - 1 : resumedIndex,
      ),
      choices: {},
      revealed: {},
      flags: {},
      finished: old.finished === true,
      results: old.results === true && old.finished === true,
      startedAt: Number.isFinite(old.startedAt)
        ? old.startedAt
        : Number.isFinite(old.deadline)
          ? old.deadline -
            previousTimeLimit(previousKeys ? { questions: previousKeys } : test)
          : null,
      questionMs: {},
      timingPartial: old.timingPartial === true || !old.questionMs,
      ...(generated
        ? { keys: test.questions.map((question) => question.key) }
        : {}),
    };
    test.questions.forEach((question, index) => {
      const questionId = question.questionId;
      const position = oldPositions ? oldPositions.get(question.key) : index;
      if (position === undefined) return;
      const choice = old.choices?.[position];
      const changed = needsRescore(questionId);
      if (
        !changed &&
        Number.isInteger(choice) &&
        choice >= 0 &&
        choice < question.options.length
      )
        run.choices[index] = choice;
      if (!changed && old.revealed?.[position]) run.revealed[index] = true;
      if (old.flags?.[position]) run.flags[index] = true;
      const elapsed = old.questionMs?.[position];
      if (Number.isFinite(elapsed) && elapsed >= 0)
        run.questionMs[index] = elapsed;
      if (
        index === run.index ||
        Number.isInteger(choice) ||
        old.revealed?.[position] ||
        run.flags[index] ||
        run.questionMs[index] !== undefined
      )
        seen.add(questionId);
      if (!hasAttemptTotals && run.choices[index] !== undefined)
        restored.attempts[questionId] =
          (restored.attempts[questionId] ?? 0) + 1;
      if (
        legacyErrors &&
        question.answer !== null &&
        run.choices[index] !== undefined
      ) {
        const wrong = run.choices[index] !== question.answer;
        if (wrong)
          restored.errorCounts[questionId] =
            (restored.errorCounts[questionId] ?? 0) + 1;
        const date = run.startedAt ?? 0;
        if (!latest.has(questionId) || date >= latest.get(questionId).date)
          latest.set(questionId, { date, wrong });
      }
    });
    restored.runs[test.id] = run;
  }
  if (!hasAttemptTotals) {
    for (const question of allQuestions) {
      if (
        restored.covered.includes(question.source) &&
        question.answer !== null &&
        !needsRescore(question.questionId)
      )
        restored.attempts[question.questionId] ??= 1;
    }
  }
  if (legacyErrors) {
    const incorrect = new Set(
      restored.missed.map((key) => questionsByKey.get(key).questionId),
    );
    for (const id of incorrect) restored.errorCounts[id] ??= 1;
    for (const [id, { wrong }] of latest) {
      if (wrong) incorrect.add(id);
      else incorrect.delete(id);
    }
    restored.incorrect = [...incorrect];
  }
  for (const [id, count] of Object.entries(restored.errorCounts)) {
    restored.attempts[id] = Math.max(count, restored.attempts[id] ?? 0);
    seen.add(id);
  }
  restored.seen = [...seen];
  for (const [id, run] of Object.entries(restored.runs)) {
    if (run.finished && id !== "wrong")
      recordCoverage(restored, getTest(id, restored), run);
  }
  if (typeof saved.active === "string" && getTest(saved.active, restored))
    restored.active = saved.active;
  return restored;
}

function validKeys(items, includeUnscored = false) {
  return Array.isArray(items)
    ? [
        ...new Set(
          items.filter(
            (key) =>
              questionsByKey.has(key) &&
              (includeUnscored || questionsByKey.get(key).answer !== null),
          ),
        ),
      ]
    : [];
}

function unseenQuestions(data = state) {
  const seen = new Set(data.seen);
  return primaryQuestions.filter((question) => !seen.has(question.questionId));
}

function isScoredId(id) {
  const question = questionsById.get(id);
  return Boolean(question && question.answer !== null);
}

function mistakeRanking(data = state) {
  return Object.entries(data.errorCounts)
    .map(([id, wrong]) => ({
      question: questionsById.get(id),
      wrong,
      total: data.attempts[id],
    }))
    .sort(
      (a, b) =>
        b.wrong - a.wrong ||
        b.wrong / b.total - a.wrong / a.total ||
        a.question.questionId.localeCompare(b.question.questionId),
    );
}

function reviewPool(id, data = state) {
  if (id === "wrong")
    return data.incorrect.map((questionId) => questionsById.get(questionId));
  return mistakeRanking(data)
    .filter(({ wrong, total }) => total >= 3 && wrong * 10 >= total * 3)
    .map(({ question }) => question);
}

function recordQuestionAnswer(question, choice) {
  const id = question.questionId;
  state.attempts[id] = (state.attempts[id] ?? 0) + 1;
  if (question.answer === null) return;
  const index = state.incorrect.indexOf(id);
  if (choice !== question.answer) {
    state.errorCounts[id] = (state.errorCounts[id] ?? 0) + 1;
    if (index === -1) state.incorrect.push(id);
  } else if (index !== -1) {
    state.incorrect.splice(index, 1);
  }
}

function testAttempts(id) {
  const run = state.runs[id];
  return (
    state.history.filter((result) => result.testId === id).length +
    Number(Boolean(run && !run.finished && Object.keys(run.choices).length))
  );
}

function readPreferences() {
  if (consent !== "accepted" && consent !== "essential") return {};
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey));
    return {
      language: ["tr", "en"].includes(saved?.language)
        ? saved.language
        : undefined,
      theme: ["dark", "light"].includes(saved?.theme) ? saved.theme : undefined,
    };
  } catch {
    return {};
  }
}

function savePreferences() {
  if (
    (consent !== "accepted" && consent !== "essential") ||
    readConsent() !== consent
  )
    return;
  try {
    const { language, theme } = state;
    localStorage.setItem(preferenceKey, JSON.stringify({ language, theme }));
  } catch {
    // The chosen theme and language still apply to the current page.
  }
}

function save() {
  if (consent !== "accepted") return;
  // Respect a storage preference changed in another tab.
  if (readConsent() !== "accepted") {
    storageAvailable = false;
    return;
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    storageAvailable = false;
  }
}

function recordCoverage(data, test, run) {
  if (test.id === "wrong" || test.id === "worst") return;
  const included = new Map(
    test.questions.map((question, index) => [question.key, run.choices[index]]),
  );
  const missed = new Set(data.missed);
  for (const question of test.questions) {
    const answer = included.get(question.key);
    if (
      question.answer !== null &&
      Number.isInteger(answer) &&
      answer !== question.answer
    )
      missed.add(question.key);
  }
  data.missed = [...missed];
  for (const source of tests) {
    if (data.covered.includes(source.id)) continue;
    const scored = allQuestions.filter(
      (question) => question.source === source.id && question.answer !== null,
    );
    if (
      scored.every((question) => Number.isInteger(included.get(question.key)))
    )
      data.covered.push(source.id);
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
  Object.entries(state.runs).forEach(([id, run]) => {
    const test = getTest(id);
    if (!test) return;
    if (run && !run.finished) add(summarize(test, run));
  });
  const scored = state.history.filter((result) => result.total > 0);
  const full = scored.filter((result) => result.blank === 0);
  const average = (fn) =>
    full.length
      ? full.reduce((sum, result) => sum + fn(result), 0) / full.length
      : 0;
  return {
    totals,
    count: full.length,
    percent: average((result) => (result.correct / result.total) * 100),
    correct: average((result) => result.correct),
    averageScore: scored.length
      ? scored.reduce(
          (sum, result) => sum + (result.correct / result.total) * 100,
          0,
        ) / scored.length
      : null,
  };
}

function renderMenu() {
  const wrong = availableReview("wrong");
  const worst = availableReview("worst");
  const unseen = getTest("unseen");
  $("sidebar-nav").innerHTML =
    `<button class="nav-home" data-action="home" ${view === "home" ? 'aria-current="page"' : ""} title="${t("home")}">${icon("layout-dashboard")}<span class="home-label">${t("home")}</span></button>
    <div class="nav-section"><span>${t("tests")}</span><span>06</span></div>
    ${tests
      .map(
        (
          test,
          index,
        ) => `<div class="test-row">${combining ? `<input type="checkbox" data-mix="${test.id}" aria-label="${t("selectForMix", { name: title(test) })}" ${selectedTests.has(test.id) ? "checked" : ""}>` : ""}<button class="test-tab" data-test="${test.id}" ${view === "test" && test.id === state.active ? 'aria-current="page"' : ""} title="${esc(title(test))}" aria-label="${esc(title(test))}, ${t("questionCount", { n: test.questions.length })}">
      <span class="tab-number">${String(index + 1).padStart(2, "0")}</span><span class="tab-copy"><span class="tab-name">${esc(title(test))}</span><span class="tab-count">${t("questionCount", { n: test.questions.length })}</span></span>${icon("chevron-right", "tab-chevron")}</button></div>`,
      )
      .join("")}
    <div class="sidebar-tools">
      ${menuShortcut(getTest("all"), "book-2")}
      ${menuShortcut(getTest("similar"), "book-2")}
      ${unseen ? menuShortcut(unseen, "eye-off") : ""}
      <button class="nav-home" data-action="toggle-combine" aria-expanded="${combining}" aria-label="${t("combine")}" title="${t("combine")}">${icon("arrows-maximize")}<span class="home-label">${t("combine")}</span></button>
      ${combining ? `<button class="button button-primary combine-start" data-action="start-combined" aria-label="${t("startCombined", { n: selectedTests.size })}" title="${t("startCombinedHint")}" ${selectedTests.size < 2 ? "disabled" : ""}>${icon("arrow-right")}<span class="home-label">${t("startCombined", { n: selectedTests.size })}</span></button>` : ""}
      ${wrong ? menuShortcut(wrong, "rotate-clockwise") : ""}
      ${worst ? menuShortcut(worst, "chart-line") : ""}
    </div>`;
}

function menuShortcut(test, symbol) {
  const label = esc(title(test));
  return `<button class="nav-home" data-test="${test.id}" ${view === "test" && test.id === state.active ? 'aria-current="page"' : ""} aria-label="${label}" title="${label}">${icon(symbol)}<span class="home-label">${label}</span></button>`;
}

function renderStorageBanner() {
  const banner = $("storage-banner");
  banner.hidden = !consentOpen;
  document.body.classList.toggle("storage-banner-open", consentOpen);
  if (!consentOpen) return;
  banner.innerHTML = `<div><h2 id="storage-title">${t("storageTitle")}</h2><p>${t("storageIntro")}</p>
    <label class="analytics-consent"><input type="checkbox" id="analytics-opt-in" ${analyticsAllowed ? "checked" : ""}>${t("analyticsConsent")}</label></div>
    <div class="storage-actions">
      <button class="button button-primary" data-consent="accepted">${t("acceptStorage")}</button>
      <button class="button button-outline" data-consent="essential">${t("necessaryStorage")}</button>
      <button class="button button-outline" data-consent="rejected">${t("rejectStorage")}</button>
    </div>`;
  document.body.style.setProperty(
    "--storage-banner-height",
    `${banner.offsetHeight}px`,
  );
}

function chooseStorage(choice) {
  checkpointQuestion();
  analyticsAllowed =
    choice === "accepted" && Boolean($("analytics-opt-in")?.checked);
  const previous = consent;
  consent = choice;
  consentOpen = false;
  storageAvailable = true;
  const attributes = `Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  if (choice === "rejected")
    document.cookie = `${consentCookie}=; Max-Age=0; ${attributes}`;
  else
    document.cookie = `${consentCookie}=${choice}; Max-Age=31536000; ${attributes}`;
  document.cookie = `${analyticsCookie}=${analyticsAllowed ? "yes" : ""}; Max-Age=${analyticsAllowed ? 31536000 : 0}; ${attributes}`;

  if (choice === "accepted" && previous !== "accepted") {
    const saved = restore();
    const session = state;
    state = {
      ...saved,
      ...(Object.keys(session.runs).length ? { active: session.active } : {}),
      language: session.language,
      theme: session.theme,
      collapsed: saved.collapsed || session.collapsed,
      runs: { ...saved.runs, ...session.runs },
      history: [...saved.history, ...session.history],
      covered: [...new Set([...saved.covered, ...session.covered])],
      missed: [...new Set([...saved.missed, ...session.missed])],
      seen: [...new Set([...saved.seen, ...session.seen])],
      attempts: { ...saved.attempts },
      errorCounts: { ...saved.errorCounts },
      incorrect: [
        ...new Set([
          ...saved.incorrect.filter((id) => !session.attempts[id]),
          ...session.incorrect,
        ]),
      ],
    };
    for (const [id, count] of Object.entries(session.attempts))
      state.attempts[id] = (state.attempts[id] ?? 0) + count;
    for (const [id, count] of Object.entries(session.errorCounts))
      state.errorCounts[id] = (state.errorCounts[id] ?? 0) + count;
    save();
  } else if (choice !== "accepted") {
    try {
      localStorage.removeItem(storageKey);
      if (choice === "rejected") localStorage.removeItem(preferenceKey);
    } catch {
      /* Storage may be blocked. */
    }
  }
  savePreferences();
  readRoute();
  renderChrome();
  startAnalytics();
  $("main").focus({ preventScroll: true });
}

function renderChrome() {
  document.documentElement.lang = state.language;
  document.documentElement.dataset.theme = state.theme;
  document.querySelector('meta[name="theme-color"]').content =
    state.theme === "dark" ? "#0b111b" : "#ebe5d9";
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
  $("privacy-note").textContent = t("privacy");
  $("storage-settings").textContent = t("storageSettings");
  $("developer-label").textContent = t("developer");
  $("search-open").setAttribute("aria-label", t("search"));
  $("search-open").title = t("search");
  $("search-open").innerHTML = `${icon("search")}<span>${t("search")}</span>`;
  $("search-title").textContent = t("search");
  $("search-close").setAttribute("aria-label", t("closeSearch"));
  $("search-close").innerHTML = icon("x");
  $("search-input").placeholder = t("searchPlaceholder");
  $("search-input").setAttribute("aria-label", t("search"));
  $("local-status").textContent = t(canSave() ? "saved" : "sessionOnly");
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
  document
    .querySelector(".brand")
    .setAttribute("aria-label", `AFA ${t("appName")}`);
  document.querySelector(".breadcrumb-brand").textContent = t("appName");
  $("close-menu").innerHTML = icon("x");
  $("close-menu").setAttribute("aria-label", t("closeMenu"));
  $("scrim").setAttribute("aria-label", t("closeMenu"));
  renderSidebarState();
  renderMenu();
  renderStorageBanner();
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
  const wrong = availableReview("wrong");
  const worst = availableReview("worst");
  const unseen = getTest("unseen");
  const remaining = unseenQuestions().length;
  const solved = primaryQuestions.filter(
    (question) => state.attempts[question.questionId],
  ).length;
  const coverageCards = [
    [
      "eye-off",
      "unseen",
      num(remaining),
      remaining
        ? `${num(primaryQuestions.length - remaining)}/${primaryQuestions.length}`
        : t("noUnseen"),
    ],
    [
      "target",
      "solvedCoverage",
      `${num((solved / primaryQuestions.length) * 100)}%`,
      t("solvedCoverageDetail", { n: solved, total: primaryQuestions.length }),
    ],
    [
      "chart-line",
      "averageScore",
      data.averageScore === null ? "—" : num(data.averageScore),
      t("averageScoreDetail"),
    ],
  ];
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
    <div class="coverage-grid">${coverageCards.map(([symbol, label, value, detail]) => `<div class="metric" data-metric="${label}"><div class="metric-top"><span>${t(label)}</span>${icon(symbol)}</div><strong class="metric-value">${value}</strong><p class="metric-detail">${detail}</p></div>`).join("")}</div>
    <div class="section-heading"><div><h2>${t("tests")}</h2><p>${t("selectTest")}</p></div><span>${t("bank", { n: primaryQuestions.length, similar: allQuestions.length - primaryQuestions.length })}</span></div>
    <div class="test-grid">${[
      ...tests,
      getTest("all"),
      getTest("similar"),
      ...(unseen ? [unseen] : []),
      ...(wrong ? [wrong] : []),
      ...(worst ? [worst] : []),
      ...Object.keys(state.runs)
        .filter((id) => id.startsWith("mix-"))
        .map((id) => getTest(id))
        .filter(Boolean),
    ]
      .map((test, index) => {
        const run = state.runs[test.id];
        const answered = progress(test, run);
        const runTotal = run?.keys?.length ?? test.questions.length;
        const attempts = testAttempts(test.id);
        const status = run?.finished
          ? t("completed")
          : answered
            ? t("inProgress", { n: answered, total: test.questions.length })
            : t("notStarted");
        return `<button class="test-card" data-test="${test.id}"><span class="test-card-number">${index < tests.length ? String(index + 1).padStart(2, "0") : icon(test.id === "all" ? "book-2" : test.id === "unseen" ? "eye-off" : test.id === "worst" ? "chart-line" : "rotate-clockwise")}</span><div class="test-card-copy"><h3>${esc(title(test))}</h3><p>${t("questionCount", { n: test.questions.length })} <span>· ${status}</span></p><p class="test-attempts">${t("testAttempts", { n: attempts, repeats: Math.max(0, attempts - 1) })}</p><div class="mini-progress"><span style="width:${(answered / runTotal) * 100}%"></span></div></div>${icon("arrow-right")}</button>`;
      })
      .join("")}</div>
    </section>
    ${renderMistakeRanking()}
    <section class="recent-section" aria-labelledby="recent-title"><div class="section-heading"><h2 id="recent-title">${t("recent")}</h2><span>${t("recentHint")}</span></div>
      ${
        state.history.length
          ? `<div class="recent-list">${state.history
              .slice(-5)
              .reverse()
              .map((result) => {
                const test = getTest(result.testId);
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
                return `<div class="recent-row">${icon("clipboard-check")}<div>${test ? esc(title(test)) : t("previousAttempt")}<small>${date ? `${esc(date)} · ` : ""}${t(result.blank ? "partial" : "completed")}</small></div><span>${result.correct}/${result.total}</span><strong>${result.total ? `${num((result.correct / result.total) * 100)}%` : "—"}</strong></div>`;
              })
              .join("")}</div>`
          : `<p class="empty-history">${icon("chart-line")}${t("emptyHistory")}</p>`
      }</section>${footnote()}`;
}

function availableReview(id) {
  const questions = reviewPool(id);
  return questions.length ? { id, questions } : undefined;
}

function renderMistakeRanking() {
  const ranked = mistakeRanking().slice(0, 10);
  return `<section class="recent-section" aria-labelledby="mistake-title">
    <div class="section-heading"><h2 id="mistake-title">${t("mostIncorrect")}</h2></div>
    ${
      ranked.length
        ? `<ol class="mistake-list">${ranked
            .map(
              ({ question, wrong, total }) =>
                `<li><button class="mistake-row" type="button" data-search-key="${esc(question.key)}"><span class="question-id">${esc(question.questionId)}</span><span class="mistake-prompt" lang="en">${esc(question.prompt)}</span><span class="mistake-rate">${t("mistakesDetail", { wrong, total, rate: num((wrong / total) * 100) })}</span></button></li>`,
            )
            .join("")}</ol>`
        : `<p class="empty-history">${t("wrongEmpty")}</p>`
    }
  </section>`;
}

function questionStatus(question, run, index) {
  if (question.answer === null) return "review";
  if (!Number.isInteger(run.choices[index])) return "blank";
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
  const legend = ["blank", "correct", "wrong", "flagged"];
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
      )}</div><div class="legend">${legend.map((status) => `<span><i class="dot ${status}" aria-hidden="true"></i>${t(statusKey[status] || status)}</span>`).join("")}</div><p class="map-note">${t(canSave() ? "mapNote" : "sessionOnly")}</p></div></aside>`;
}

function canSave() {
  return consent === "accepted" && storageAvailable;
}

function sourceNote(question) {
  return esc(question.note?.[state.language] ?? t("unscored"));
}

function renderQuestion(test, run) {
  const question = test.questions[run.index];
  const selected = run.choices[run.index];
  const visible = run.finished || Boolean(run.revealed[run.index]);
  const unscored = question.answer === null;
  const locked = run.finished || Number.isInteger(selected);
  const incorrect =
    !unscored && Number.isInteger(selected) && selected !== question.answer;
  const last = run.index === test.questions.length - 1;
  const nextAction = last ? (run.finished ? "results" : "finish") : "next";
  return `<section class="question-card" aria-labelledby="question-title"><div class="question-meta"><div class="question-reference"><span class="question-id">${esc(question.questionId)}</span><span class="question-number">${t("questionOf", { n: String(run.index + 1).padStart(2, "0"), total: test.questions.length })}</span></div><div class="question-tags"><span class="chip ${unscored ? "warning" : ""}">${t(unscored ? "unscored" : "singleAnswer")}</span></div></div>
    <p class="question-attempts">${t("questionAttempts", { n: state.attempts[question.questionId] ?? 0 })}</p>
    <h2 id="question-title" class="question-text" lang="en" tabindex="-1">${esc(question.prompt)}</h2>
    <div class="options" role="radiogroup" aria-labelledby="question-title">${question.options
      .map((text, option) => {
        const correct =
          (visible || option === selected) && option === question.answer;
        const wrong = incorrect && option === selected;
        const checked = option === selected;
        return `<label class="option${checked && unscored ? " is-neutral" : ""}${correct ? " is-correct" : wrong ? " is-wrong" : ""}${locked ? " is-locked" : ""}"><input type="radio" name="answer" value="${option}" ${checked ? "checked" : ""} ${locked ? "disabled" : ""} aria-label="${letters[option]}. ${esc(text)}${correct ? ` — ${t("correctAnswers")}` : wrong ? ` — ${t("wrongAnswers")}` : ""}" lang="en"><span class="letter" aria-hidden="true">${letters[option]}</span><span class="option-text" lang="en">${esc(text)}</span><span class="option-mark" aria-hidden="true">${correct ? icon("check") : wrong ? icon("x") : checked ? icon("check") : ""}</span></label>`;
      })
      .join("")}</div>
    ${visible ? (unscored ? `<div class="answer-note warning" role="status">${icon("info-circle")}<span>${sourceNote(question)}</span></div>` : `<div class="answer-note" role="status">${icon("circle-check")}<span><strong>${t("correctOption", { letter: letters[question.answer] })}</strong><span class="answer-text" lang="en">${esc(question.options[question.answer])}</span></span></div>`) : incorrect ? `<p class="answer-note incorrect-note">${icon("circle-x")}${t("wrongAnswers")}</p>` : ""}
    <div class="question-tools">${run.finished ? `<button class="text-button" data-action="results">${icon("chart-line")}${t("showResults")}</button>` : `<button class="text-button" data-action="reveal" aria-pressed="${visible}">${icon(visible ? "eye-off" : "eye")}${t(unscored ? (visible ? "hideNote" : "showNote") : visible ? "hideAnswer" : "showAnswer")}</button>`}
      <button class="text-button ${run.flags[run.index] ? "flagged" : ""}" data-action="flag" aria-pressed="${Boolean(run.flags[run.index])}">${icon("flag")}${t(run.flags[run.index] ? "unflag" : "flag")}</button></div></section>
    <div class="paging"><button class="button button-outline" data-action="previous" ${run.index === 0 ? "disabled" : ""}>${icon("arrow-left")}${t("previous")}</button><span class="keyboard-hint">${t("keyboard")}</span><button class="button button-primary" data-action="${nextAction}">${t(last ? (run.finished ? "showResults" : "finish") : "next")}${icon(last ? "check" : "arrow-right")}</button></div>`;
}

function renderResults(test, run, result) {
  const score = result.total ? num((result.correct / result.total) * 100) : "—";
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
    ${renderQuestionTimes(test, run)}
    <div class="result-actions"><button class="button button-outline" data-action="review">${icon("eye")}${t("review")}</button><button class="button button-primary" data-action="restart">${icon("rotate-clockwise")}${t("restart")}</button>${test.id !== "wrong" && availableReview("wrong") ? `<button class="button button-outline" data-test="wrong">${t("wrongTest")}</button>` : ""}</div><button class="text-button" data-action="home">${icon("arrow-left")}${t("backHome")}</button></section>`;
}

function renderQuestionTimes(test, run) {
  const total = Object.values(run.questionMs).reduce(
    (sum, elapsed) => sum + elapsed,
    0,
  );
  const displayTime = (elapsed) =>
    elapsed === undefined ? "—" : formatTime(Math.floor(elapsed / 1000));
  return `<div class="result-timing">
    <div class="total-time"><strong>${t("totalTime")}</strong><span id="result-total-time">${displayTime(total || (run.timingPartial ? undefined : 0))}</span></div>
    ${run.timingPartial ? `<p>${t("timingPartial")}</p>` : ""}
    <details class="question-times" open><summary>${t("questionTimes")}</summary>
      <ol>${test.questions.map((question, index) => `<li><button type="button" data-index="${index}"><span lang="en">${esc(question.prompt)}</span><span class="question-time">${displayTime(run.questionMs[index])}</span></button></li>`).join("")}</ol>
    </details>
  </div>`;
}

function elapsedSeconds(run) {
  return Math.max(0, Math.floor((Date.now() - run.startedAt) / 1000));
}

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function timerLabel(run) {
  return `<div class="test-timer">
    <span class="timer-icon">${icon("clock")}</span>
    <div class="timer-reading"><span id="timer-label">${t("elapsedTime")}</span><strong role="timer" aria-labelledby="timer-label" id="elapsed-timer">${formatTime(elapsedSeconds(run))}</strong></div>
  </div>`;
}

function renderPractice() {
  const test = currentTest();
  const run = runFor();
  if (!run.results) markSeen(test.questions[run.index]);
  const result = summarize(test, run);
  const answered = progress(test, run);
  return `<div class="practice-toolbar"><div><p class="practice-caption">${t(run.finished ? "reviewMode" : "practice")}</p><h1 class="practice-title">${esc(title(test))}</h1><p class="practice-subtitle">${t("inProgress", { n: answered, total: test.questions.length })}</p></div><div class="toolbar-right"><button class="button button-outline button-small" data-action="${run.finished ? "results" : "finish"}">${t(run.finished ? "showResults" : "finish")}</button>${run.finished ? "" : timerLabel(run)}</div></div>
    <div class="progress-track practice-progress" role="progressbar" aria-label="${t("answered")}" aria-valuemin="0" aria-valuemax="${test.questions.length}" aria-valuenow="${answered}"><div class="progress-fill" style="width:${(answered / test.questions.length) * 100}%"></div></div>
    <div class="practice-grid"><div class="quiz-column">${run.results ? renderResults(test, run, result) : renderQuestion(test, run)}</div>${renderMap(test, run)}</div>${footnote()}`;
}

function render() {
  $("local-status").textContent = t(canSave() ? "saved" : "sessionOnly");
  $("page-label").textContent =
    view === "home" ? t("home") : title(currentTest());
  document.title = `${view === "home" ? t("dashboard") : title(currentTest())} · AFA ${t("appName")}`;
  $("main").innerHTML =
    `${!storageAvailable ? `<p class="storage-note" role="status">${t("storage")}</p>` : ""}${view === "home" ? renderHome() : renderPractice()}`;
  renderMenu();
  syncQuestionClock();
}

function setDrawer(open, focus = true) {
  const wasOpen = drawerOpen;
  drawerOpen = open && mobile.matches;
  renderSidebarState();
  if (drawerOpen) $("close-menu").focus();
  else if (wasOpen && focus) $("menu-toggle").focus();
}

function markSeen(question) {
  if (state.seen.includes(question.questionId)) return;
  state.seen.push(question.questionId);
  save();
}

function readRoute(questionIndex) {
  clearTimeout(advanceTimer);
  checkpointQuestion();
  const id = location.hash.startsWith("#test/") ? location.hash.slice(6) : "";
  const test = getTest(id);
  view = test ? "test" : "home";
  if (test) {
    state.active = id;
    const run = runFor();
    if (Number.isInteger(questionIndex)) {
      run.index = questionIndex;
      run.results = false;
    }
    if (!run.finished && run.startedAt === null) run.startedAt = Date.now();
  }
  setDrawer(false, false);
  save();
  render();
}

function navigate(id) {
  if (id === "wrong" || id === "worst") {
    const keys = reviewPool(id).map((question) => question.key);
    if (keys.length) {
      const run = state.runs[id];
      if (run?.finished) delete state.runs[id];
      else if (run) run.keys = [...new Set([...run.keys, ...keys])];
    }
  }
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
  clearTimeout(advanceTimer);
  checkpointQuestion();
  const run = runFor();
  run.index = Math.max(0, Math.min(currentTest().questions.length - 1, index));
  run.results = false;
  save();
  render();
  focusQuestion(true);
}

function finalizeRun(test, run) {
  if (run.finished) return;
  state.history.push({
    ...summarize(test, run),
    testId: test.id,
    date: new Date().toISOString(),
  });
  recordCoverage(state, test, run);
  run.finished = true;
  run.results = true;
}

function checkpointQuestion(now = performance.now()) {
  if (!questionClock) return;
  const { run, index, since } = questionClock;
  run.questionMs[index] =
    (run.questionMs[index] ?? 0) + Math.max(0, now - since);
  questionClock.since = now;
}

function syncQuestionClock() {
  const run = view === "test" ? runFor() : null;
  const tracking =
    run && !run.finished && !document.hidden && !$("search-dialog").open;
  if (
    tracking &&
    questionClock?.run === run &&
    questionClock.index === run.index
  )
    return;
  const now = performance.now();
  checkpointQuestion(now);
  questionClock = tracking ? { run, index: run.index, since: now } : null;
}

function updateTimer() {
  const now = performance.now();
  if (questionClock && now - questionClock.since >= 5000) {
    checkpointQuestion(now);
    save();
  }
  const timer = $("elapsed-timer");
  if (!timer || view !== "test") return;
  const text = formatTime(elapsedSeconds(runFor()));
  if (timer.textContent !== text) timer.textContent = text;
}

function finishTest() {
  clearTimeout(advanceTimer);
  const run = runFor();
  if (run.finished) return;
  checkpointQuestion();
  finalizeRun(currentTest(), run);
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

function searchText(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function renderSearchResults() {
  const query = searchText($("search-input").value);
  const idMatch = /^(?:afa\s*)?(\d{1,3})$/.exec(query);
  const exactQuestion =
    idMatch && questionsById.get(`AFA-${idMatch[1].padStart(3, "0")}`);
  const output = $("search-results");
  if (!exactQuestion && query.length < 2) {
    $("search-status").textContent = t("searchHint");
    output.replaceChildren();
    return;
  }
  const terms = query.split(" ");
  const matches = exactQuestion
    ? [{ question: exactQuestion }]
    : searchIndex
        .flatMap(({ question, prompt, choices }) => {
          if (
            !terms.every(
              (term) => prompt.includes(term) || choices.includes(term),
            )
          )
            return [];
          const rank = prompt.includes(query)
            ? 2
            : terms.every((term) => prompt.includes(term))
              ? 1
              : 0;
          return [{ question, rank }];
        })
        .sort((a, b) => b.rank - a.rank);
  $("search-status").textContent = matches.length
    ? t("searchCount", { n: matches.length })
    : t("searchEmpty");
  output.innerHTML = matches
    .map(
      (
        { question },
        index,
      ) => `<details class="search-match" ${index === 0 ? "open" : ""}>
    <summary><span lang="en">${esc(question.prompt)}</span><small><span class="question-id">${esc(question.questionId)}</span> · ${esc(title({ id: question.source }))} · ${t("question")} ${question.position + 1}</small></summary>
    <ol type="A" lang="en">${question.options.map((option) => `<li>${esc(option)}</li>`).join("")}</ol>
    <button class="button button-outline button-small" type="button" data-search-key="${esc(question.key)}">${t("openQuestion")} ${icon("arrow-right")}</button>
  </details>`,
    )
    .join("");
}

function openSearch() {
  clearTimeout(advanceTimer);
  $("search-dialog").showModal();
  syncQuestionClock();
  save();
  renderSearchResults();
  $("search-input").focus();
}

function openSearchQuestion(key) {
  const question = questionsByKey.get(key);
  if (!question) return;
  const index = question.position;
  if ($("search-dialog").open) $("search-dialog").close();
  const hash = `#test/${question.source}`;
  if (location.hash !== hash) {
    // Use the normal test route without rendering the old question first.
    history.pushState(null, "", hash);
    readRoute(index);
    window.scrollTo({ top: 0 });
    return focusQuestion(true);
  }
  goToQuestion(index);
}

function performAction(action) {
  if (action === "home") return navigate();
  if (action === "storage-settings") {
    consentOpen = true;
    setDrawer(false, false);
    renderStorageBanner();
    return $("storage-banner").querySelector("button").focus();
  }
  if (action === "toggle-combine") {
    combining = !combining;
    if (combining && state.collapsed && !mobile.matches) {
      state.collapsed = false;
      save();
      renderSidebarState();
    }
    renderMenu();
    return document.querySelector('[data-action="toggle-combine"]').focus();
  }
  if (action === "start-combined") {
    if (selectedTests.size < 2) return;
    const mask = tests.reduce(
      (value, test, index) =>
        selectedTests.has(test.id) ? value | (1 << index) : value,
      0,
    );
    combining = false;
    selectedTests.clear();
    return navigate(`mix-${mask}`);
  }
  if (view !== "test") return;
  const run = runFor();
  if (action === "next") return goToQuestion(run.index + 1);
  if (action === "previous") return goToQuestion(run.index - 1);
  if (action === "finish") return askToFinish();
  if (action === "review") return goToQuestion(0);
  if (action === "restart") {
    if (state.active === "unseen") {
      if (!unseenQuestions().length) return navigate();
      delete state.runs.unseen;
    }
    if (state.active === "wrong" || state.active === "worst") {
      if (!reviewPool(state.active).length) return navigate();
      delete state.runs[state.active];
    }
    state.runs[state.active] = newRun(currentTest());
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
  const searchResult = event.target.closest("[data-search-key]");
  if (searchResult) return openSearchQuestion(searchResult.dataset.searchKey);
  const consentButton = event.target.closest("[data-consent]");
  if (consentButton) return chooseStorage(consentButton.dataset.consent);
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
$("sidebar-nav").addEventListener("change", (event) => {
  const id = event.target.dataset.mix;
  if (!id) return;
  if (event.target.checked) selectedTests.add(id);
  else selectedTests.delete(id);
  const button = document.querySelector('[data-action="start-combined"]');
  const label = t("startCombined", { n: selectedTests.size });
  button.disabled = selectedTests.size < 2;
  button.setAttribute("aria-label", label);
  button.querySelector(".home-label").textContent = label;
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
  if (run.finished || Number.isInteger(run.choices[run.index])) return;
  const questionIndex = run.index;
  const test = currentTest();
  const choice = Number(event.target.value);
  run.choices[questionIndex] = choice;
  const answer = test.questions[questionIndex].answer;
  recordQuestionAnswer(test.questions[questionIndex], choice);
  checkpointQuestion();
  save();
  render();
  $("question-title")?.focus({ preventScroll: true });
  if (answer === null) return;
  $("announcer").textContent = t(
    choice === answer ? "correctAnswers" : "wrongAnswers",
  );
  if (choice !== answer) return;
  advanceTimer = setTimeout(() => {
    if (
      view !== "test" ||
      currentTest().id !== test.id ||
      runFor() !== run ||
      run.finished ||
      run.index !== questionIndex
    )
      return;
    if (questionIndex + 1 < test.questions.length)
      goToQuestion(questionIndex + 1);
    else if (summarize(test, run).blank === 0) finishTest();
  }, 100);
});
$("search-open").addEventListener("click", openSearch);
$("search-close").addEventListener("click", () => $("search-dialog").close());
$("search-input").addEventListener("input", renderSearchResults);
$("search-dialog").addEventListener("close", syncQuestionClock);
$("search-dialog").addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  event.preventDefault();
  $("search-dialog").close();
});
$("theme-toggle").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  savePreferences();
  renderChrome();
});
$("language-switch").addEventListener("click", (event) => {
  const button = event.target.closest("[data-language]");
  if (!button) return;
  state.language = button.dataset.language;
  savePreferences();
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
        ...$("sidebar").querySelectorAll(
          "a[href],button:not([disabled]),input",
        ),
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
    $("search-dialog").open ||
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
startAnalytics();
setInterval(updateTimer, 250);
window.addEventListener("pageshow", () => {
  syncQuestionClock();
  updateTimer();
});
document.addEventListener("visibilitychange", () => {
  syncQuestionClock();
  save();
  updateTimer();
});
window.addEventListener("pagehide", () => {
  checkpointQuestion();
  questionClock = null;
  save();
});
new ResizeObserver(() => {
  if (consentOpen)
    document.body.style.setProperty(
      "--storage-banner-height",
      `${$("storage-banner").offsetHeight}px`,
    );
}).observe($("storage-banner"));
