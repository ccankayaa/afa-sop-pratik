import { NextResponse, userAgent } from "next/server";
import { decodePracticeRoute } from "./lib/practice-routes";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const route = decodePracticeRoute(pathname.split("/").filter(Boolean));
  const response = NextResponse.next();
  if (
    !request.headers.has("next-router-prefetch") &&
    !request.headers.has("rsc")
  ) {
    const { browser, device, os, isBot } = userAgent(request);
    const reportedModel = request.headers
      .get("sec-ch-ua-model")
      ?.replace(/^"|"$/g, "")
      .trim();
    const model = reportedModel || device.model;
    const city = request.headers.get("x-vercel-ip-city");
    console.info(
      "practice_request",
      JSON.stringify({
        method: request.method,
        path: route ? pathname : "/not-found",
        country: request.headers.get("x-vercel-ip-country") || undefined,
        region: request.headers.get("x-vercel-ip-country-region") || undefined,
        city: city ? decodeCity(city) : undefined,
        browser: browser.name,
        os: os.name,
        deviceType: isBot
          ? "bot"
          : (device.type ?? (browser.name ? "desktop" : "unknown")),
        deviceModel: model && model.slice(0, 80),
      }),
    );
    if (route && !isBot) response.headers.set("Accept-CH", "Sec-CH-UA-Model");
  }
  return response;
}

function decodeCity(city) {
  try {
    return decodeURIComponent(city).slice(0, 80);
  } catch {
    return undefined;
  }
}

export const config = {
  matcher: ["/", "/test/:path*", "/en/:path*", "/tr/:path*"],
};
