import fs from "fs";
import path from "path";
import { PlatformDisplay } from "./types";

export function getAllPlatforms(): PlatformDisplay[] {
  try {
    const filePath = path.join(process.cwd(), "..", "data", "platform-display.json");
    if (!fs.existsSync(filePath)) {
      // Fallback if running from root
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

export function getPlatformBySlug(slug: string): PlatformDisplay | null {
  const all = getAllPlatforms();
  const target = slug.toLowerCase();
  return all.find((p) => p.slug.toLowerCase() === target || p.id.toLowerCase() === target) || null;
}
