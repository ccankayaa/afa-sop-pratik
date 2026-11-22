import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import {
  decodePracticeRoute,
  getStaticPracticeRoutes,
} from "../../lib/practice-routes";
import PracticeShell from "../practice-shell";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticPracticeRoutes().map((route) => ({ route }));
}

const symbols = readFileSync(
  join(process.cwd(), "public", "assets", "icons.svg"),
  "utf8",
)
  .replace(/^<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "");

export default async function PracticePage({ params }) {
  const route = decodePracticeRoute((await params).route ?? []);
  if (!route) notFound();

  return (
    <>
      <svg
        className="icon-sprite"
        aria-hidden="true"
        width="0"
        height="0"
        dangerouslySetInnerHTML={{ __html: symbols }}
      />
      <PracticeShell />
    </>
  );
}
