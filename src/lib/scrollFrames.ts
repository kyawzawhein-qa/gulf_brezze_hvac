/** Dense WebP fly-through under /scroll/sequence/. */
export type ScrollFrame = {
  src: string;
  alt: string;
};

export type ScrollCaption = {
  at: number;
  text: string;
};

export type FramesManifest = {
  mode: "sequence";
  frames: ScrollFrame[];
  captions: ScrollCaption[];
  frameCount: number;
  width?: number;
  height?: number;
};

export const FALLBACK_CAPTIONS: ScrollCaption[] = [
  { at: 0.0, text: "Blistering Florida Heat Outside? Stay 100% Cool Inside." },
  { at: 0.25, text: "Engineered for Southwest Florida Humidity & Comfort." },
  { at: 0.55, text: "Whisper-Quiet, Zoned Temperature Control in Every Room." },
  { at: 0.85, text: "Voted Best HVAC Contractor in Lee County." },
];

type RemoteManifest = {
  frames?: string[];
  frameCount?: number;
  width?: number;
  height?: number;
  captions?: ScrollCaption[];
  pattern?: string;
};

function buildSequenceManifest(
  urls: string[],
  captions: ScrollCaption[],
  width = 1920,
  height = 1080,
): FramesManifest {
  return {
    mode: "sequence",
    width,
    height,
    frameCount: urls.length,
    captions,
    frames: urls.map((src, i) => ({
      src,
      alt: `Gulf Breeze HVAC cinematic frame ${String(i + 1).padStart(3, "0")}`,
    })),
  };
}

/**
 * Load the single fly-through frame sequence from /scroll/sequence/.
 * Returns null when no dense sequence is available (no keyframe crossfade fallback).
 */
export async function loadScrollFrames(): Promise<FramesManifest | null> {
  try {
    const res = await fetch("/scroll/sequence/manifest.json", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as RemoteManifest;
      const urls = (data.frames ?? []).filter(Boolean);
      const count = data.frameCount ?? urls.length;
      if (count >= 8 && urls.length >= 8) {
        return buildSequenceManifest(
          urls,
          data.captions?.length ? data.captions : FALLBACK_CAPTIONS,
          data.width ?? 1920,
          data.height ?? 1080,
        );
      }
    }
  } catch {
    /* fall through */
  }

  // Manifest absent but numbered frames exist on disk.
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
        return buildSequenceManifest(urls, FALLBACK_CAPTIONS);
      }
    }
  } catch {
    /* fall through */
  }

  return null;
}

/** Map scroll progress [0,1] to a frame index; clamps at the last frame (no wrap). */
export function frameIndexForProgress(progress: number, frameCount: number): number {
  if (frameCount <= 1) return 0;
  const p = Math.min(1, Math.max(0, progress));
  return Math.min(frameCount - 1, Math.round(p * (frameCount - 1)));
}

/** Scroll distance (viewport %) for one full pass through the sequence. */
export function scrollLengthForFrameCount(frameCount: number): number {
  return Math.max(400, Math.round(frameCount * 3.33));
}
