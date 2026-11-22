const testIds = [
  "normal",
  "normal-b",
  "emergency",
  "emergency-b",
  "emergency-2",
  "extra",
  "similar",
  "all",
  "unseen",
  "wrong",
  "worst",
];
for (let mask = 1; mask < 64; mask++) {
  if (mask & (mask - 1)) testIds.push(`mix-${mask}`);
}
const validTests = new Set(testIds);
const languages = ["en", "tr"];

export function decodePracticeRoute(parts) {
  const language = languages.includes(parts[0]) ? parts[0] : undefined;
  const route = language ? parts.slice(1) : parts;
  if (!route.length) return { language };
  if (route.length === 2 && route[0] === "test" && validTests.has(route[1]))
    return { language, testId: route[1] };
  return null;
}

export function getStaticPracticeRoutes() {
  const paths = [[], ...testIds.map((id) => ["test", id])];
  return [
    ...paths,
    ...languages.flatMap((language) => [
      [language],
      ...paths.slice(1).map((path) => [language, ...path]),
    ]),
  ];
}
