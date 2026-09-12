import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import type { DesignDTO } from "./cms-types";
import { DEFAULT_CONTENT } from "./defaults";

export function designToCssVars(design: DesignDTO): string {
  return [
    `--gb-navy:${design.navy}`,
    `--gb-deep:${design.deep}`,
    `--gb-teal:${design.teal}`,
    `--gb-aqua:${design.aqua}`,
    `--gb-sky:${design.sky}`,
    `--gb-foam:${design.foam}`,
    `--gb-sand:${design.sand}`,
    `--gb-coral:${design.coral}`,
    `--gb-coral-dark:${design.coralDark}`,
    `--gb-slate:${design.slate}`,
    `--gb-muted:${design.muted}`,
    `--background:${design.sand}`,
    `--foreground:${design.navy}`,
  ].join(";");
}

export function writeRuntimeTheme(design: DesignDTO = DEFAULT_CONTENT.design) {
  const dir = join(process.cwd(), "public", "brand");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const payload = {
    updatedAt: new Date().toISOString(),
    tokens: {
      "gb-navy": design.navy,
      "gb-deep": design.deep,
      "gb-teal": design.teal,
      "gb-aqua": design.aqua,
      "gb-sky": design.sky,
      "gb-foam": design.foam,
      "gb-sand": design.sand,
      "gb-coral": design.coral,
      "gb-coral-dark": design.coralDark,
      "gb-slate": design.slate,
      "gb-muted": design.muted,
    },
  };
  writeFileSync(join(dir, "runtime-theme.json"), JSON.stringify(payload, null, 2) + "\n");
}

export function readRuntimeThemeCss(): string {
  try {
    const path = join(process.cwd(), "public", "brand", "runtime-theme.json");
    if (!existsSync(path)) return designToCssVars(DEFAULT_CONTENT.design);
    const raw = JSON.parse(readFileSync(path, "utf8")) as {
      tokens?: Record<string, string>;
    };
    const t = raw.tokens ?? {};
    const design: DesignDTO = {
      navy: t["gb-navy"] ?? DEFAULT_CONTENT.design.navy,
      deep: t["gb-deep"] ?? DEFAULT_CONTENT.design.deep,
      teal: t["gb-teal"] ?? DEFAULT_CONTENT.design.teal,
      aqua: t["gb-aqua"] ?? DEFAULT_CONTENT.design.aqua,
      sky: t["gb-sky"] ?? DEFAULT_CONTENT.design.sky,
      foam: t["gb-foam"] ?? DEFAULT_CONTENT.design.foam,
      sand: t["gb-sand"] ?? DEFAULT_CONTENT.design.sand,
      coral: t["gb-coral"] ?? DEFAULT_CONTENT.design.coral,
      coralDark: t["gb-coral-dark"] ?? DEFAULT_CONTENT.design.coralDark,
      slate: t["gb-slate"] ?? DEFAULT_CONTENT.design.slate,
      muted: t["gb-muted"] ?? DEFAULT_CONTENT.design.muted,
    };
    return designToCssVars(design);
  } catch {
    return designToCssVars(DEFAULT_CONTENT.design);
  }
}
