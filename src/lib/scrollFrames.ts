/** Fallback keyframes when /scroll/sequence/*.webp is not present. */
export type ScrollFrame = {
  src: string;
  alt: string;
};

export type ScrollCaption = {
  at: number;
  text: string;
};

export type FramesManifest = {
  mode: "sequence" | "keyframes";
  frames: ScrollFrame[];
  captions: ScrollCaption[];
  width?: number;
  height?: number;
};

export const FALLBACK_CAPTIONS: ScrollCaption[] = [
  { at: 0.0, text: "Blistering Florida Heat Outside? Stay 100% Cool Inside." },
  { at: 0.25, text: "Engineered for Southwest Florida Humidity & Comfort." },
  { at: 0.55, text: "Whisper-Quiet, Zoned Temperature Control in Every Room." },
  { at: 0.85, text: "Voted Best HVAC Contractor in Lee County." },
];

export const FALLBACK_FRAMES: ScrollFrame[] = [
  {
    src: "/scroll/keyframes/kf-01-exterior.webp",
    alt: "Cape Coral villa exterior with pool under Florida sun",
  },
  {
    src: "/scroll/keyframes/kf-02-living.webp",
    alt: "Living room open to pool with cool airflow from ceiling vents",
  },
  {
    src: "/scroll/keyframes/kf-03-bedroom.webp",
    alt: "Hallway into master bedroom with linear AC diffusers",
  },
  {
    src: "/scroll/keyframes/kf-04-bathroom.webp",
    alt: "Master ensuite bathroom with discreet ceiling vents",
  },
];

type RemoteManifest = {
  frames?: string[];
  frameCount?: number;
  width?: number;
  height?: number;
  captions?: ScrollCaption[];
};

/**
 * Prefer /scroll/sequence/manifest.json (sequence drop-in (manifest-driven)).
 * Fall back to probing frame_001.webp, then the 4 keyframes.
 */
export async function loadScrollFrames(): Promise<FramesManifest> {
  try {
    const res = await fetch("/scroll/sequence/manifest.json", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as RemoteManifest;
      const urls = (data.frames ?? []).filter(Boolean);
      if (urls.length >= 8) {
        return {
          mode: "sequence",
          width: data.width ?? 1600,
          height: data.height ?? 900,
          captions: data.captions?.length ? data.captions : FALLBACK_CAPTIONS,
          frames: urls.map((src, i) => ({
            src,
            alt: `Gulf Breeze HVAC cinematic frame ${String(i + 1).padStart(3, "0")}`,
          })),
        };
      }
    }
  } catch {
    /* fall through */
  }

  // Probe first sequence frame in case manifest is absent but files exist
  try {
    const probe = await fetch("/scroll/sequence/frame_001.webp", {
      method: "HEAD",
      cache: "no-store",
    });
    if (probe.ok) {
      const urls: string[] = [];
      for (let i = 1; i <= 300; i++) {
        const src = `/scroll/sequence/frame_${String(i).padStart(3, "0")}.webp`;
        const r = await fetch(src, { method: "HEAD", cache: "no-store" });
        if (!r.ok) break;
        urls.push(src);
      }
      if (urls.length >= 8) {
        return {
          mode: "sequence",
          width: 1600,
          height: 900,
          captions: FALLBACK_CAPTIONS,
          frames: urls.map((src, i) => ({
            src,
            alt: `Gulf Breeze HVAC cinematic frame ${String(i + 1).padStart(3, "0")}`,
          })),
        };
      }
    }
  } catch {
    /* fall through */
  }

  return {
    mode: "keyframes",
    captions: FALLBACK_CAPTIONS,
    frames: FALLBACK_FRAMES,
  };
}
