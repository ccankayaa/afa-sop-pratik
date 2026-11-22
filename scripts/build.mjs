import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { Script } from "node:vm";

const root = new URL("../", import.meta.url);
const output = new URL("dist/", root);
const read = (path) => readFile(new URL(path, root), "utf8");

const [html, questions, app] = await Promise.all([
  read("index.html"),
  read("questions.js"),
  read("app.js"),
]);
const entryTags =
  /<script src="\/questions\.js" defer><\/script>\s*<script src="\/app\.js" defer><\/script>/;
if (!entryTags.test(html))
  throw new Error("Expected the two practice script tags in index.html.");

const bundle = '"use strict";\n' + questions + "\n" + app;
new Script(bundle, { filename: "practice.js" });
await mkdir(output, { recursive: true });
await Promise.all([
  writeFile(
    new URL("index.html", output),
    html.replace(entryTags, '<script src="/practice.js" defer></script>'),
  ),
  writeFile(new URL("practice.js", output), bundle),
  // Keep the previous HTML's asset URLs usable during the rollout.
  ...["404.html", "app.js", "questions.js", "styles.css", "assets"].map(
    (path) =>
      cp(new URL(path, root), new URL(path, output), {
        recursive: path === "assets",
      }),
  ),
]);
console.log("Built static practice site in dist/");
