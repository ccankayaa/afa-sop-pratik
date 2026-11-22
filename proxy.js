import { NextResponse } from "next/server";
import { decodePracticeRoute } from "./lib/practice-routes";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const route = decodePracticeRoute(pathname.split("/").filter(Boolean));
  if (
    !request.headers.has("next-router-prefetch") &&
    !request.headers.has("rsc")
  ) {
    console.info(
      "practice_request",
      JSON.stringify({
        method: request.method,
        path: route ? pathname : "/not-found",
      }),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/test/:path*", "/en/:path*", "/tr/:path*"],
};
