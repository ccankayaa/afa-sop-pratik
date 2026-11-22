import { fileURLToPath } from "node:url";

const nextConfig = {
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  async headers() {
    // Old tabs can still resolve this file. New pages use the inline sprite.
    return [
      {
        source: "/assets/icons.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
};

export default nextConfig;
