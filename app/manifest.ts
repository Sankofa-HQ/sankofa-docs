import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sankofa Docs",
    short_name: "Sankofa Docs",
    description:
      "Developer documentation for Sankofa — Vision, Plan, Catch, Switch, Deploy, Analytics, Pulse, Remote Config.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FA7319",
    orientation: "portrait-primary",
    lang: "en-US",
    categories: ["developer", "documentation", "productivity"],
    icons: [
      { src: "/logo-icon.png", sizes: "any", type: "image/png", purpose: "any" },
      { src: "/logo-icon.png", sizes: "180x180", type: "image/png", purpose: "maskable" },
    ],
  };
}
