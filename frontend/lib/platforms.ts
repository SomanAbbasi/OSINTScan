import fs from "fs";
import path from "path";
import { PlatformDisplay } from "./types";

const PLATFORM_ALIASES: Record<string, string> = {
  "github-username-search": "github-user",
  "github": "github-user",
  "reddit-username-search": "reddit",
  "instagram-username-search": "instagram",
  "x-username-search": "x",
  "twitter-username-search": "x",
  "twitter": "x",
  "youtube-username-search": "youtube-channel",
  "youtube": "youtube-channel",
  "gitlab-username-search": "gitlab",
  "steam-username-search": "steam",
  "pinterest-username-search": "pinterest",
  "medium-username-search": "medium",
  "telegram-username-search": "telegram",
  "spotify-username-search": "spotify",
  "tiktok-username-search": "tiktok",
};

export function getAllPlatforms(): PlatformDisplay[] {
  try {
    const filePath = path.join(process.cwd(), "..", "data", "platform-display.json");
    if (!fs.existsSync(filePath)) {
      // Fallback if running from root or production
      const rootPath = path.join(process.cwd(), "data", "platform-display.json");
      if (fs.existsSync(rootPath)) {
        const content = fs.readFileSync(rootPath, "utf-8");
        return JSON.parse(content).platforms || [];
      }
      return [];
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content).platforms || [];
  } catch {
    return [];
  }
}

export const TIER1_PLATFORM_SLUGS = new Set([
  "instagram",
  "tiktok",
  "youtube-channel",
  "youtube-user2",
  "x",
  "reddit",
  "spotify",
  "github-user",
  "gitlab",
  "telegram",
  "snapchat",
  "pinterest",
  "twitch",
  "steam",
  "roblox",
  "medium",
  "substack",
  "linktree",
  "patreon",
  "soundcloud",
  "vimeo",
  "quora",
  "behance",
  "dribbble",
  "deviantart",
  "chesscom",
  "huggingface",
  "leetcode",
  "kaggle",
  "duolingo",
]);

export function isTier1Platform(slugOrId: string): boolean {
  const normalized = slugOrId.toLowerCase().trim();
  return TIER1_PLATFORM_SLUGS.has(normalized) || Boolean(PLATFORM_ALIASES[normalized]);
}

export function getTier1Platforms(): PlatformDisplay[] {
  const all = getAllPlatforms();
  return all.filter((p) => TIER1_PLATFORM_SLUGS.has(p.slug.toLowerCase()) || TIER1_PLATFORM_SLUGS.has(p.id.toLowerCase()));
}

export function getPlatformBySlug(slug: string): PlatformDisplay | null {
  const all = getAllPlatforms();
  let target = slug.toLowerCase();

  // Check alias dictionary
  if (PLATFORM_ALIASES[target]) {
    target = PLATFORM_ALIASES[target];
  }

  // Also handle generic "-username-search" suffix
  if (target.endsWith("-username-search")) {
    const stripped = target.replace("-username-search", "");
    if (PLATFORM_ALIASES[stripped]) {
      target = PLATFORM_ALIASES[stripped];
    } else {
      const match = all.find(
        (p) => p.slug.toLowerCase() === stripped || p.id.toLowerCase() === stripped
      );
      if (match) return match;
    }
  }

  return (
    all.find(
      (p) =>
        p.slug.toLowerCase() === target ||
        p.id.toLowerCase() === target ||
        p.displayName.toLowerCase().replace(/[^a-z0-9]/g, "") ===
          target.replace(/[^a-z0-9]/g, "")
    ) || null
  );
}
