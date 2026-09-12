"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FALLBACK_CAPTIONS,
  FALLBACK_FRAMES,
  loadScrollFrames,
  type FramesManifest,
  type ScrollCaption,
} from "@/lib/scrollFrames";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_STATIC = [
  { src: "/scroll/keyframes/kf-01-exterior.webp", label: "Exterior villa" },
  { src: "/scroll/keyframes/kf-02-living.webp", label: "Living room" },
  { src: "/scroll/keyframes/kf-03-bedroom.webp", label: "Bedroom" },
];

function captionIndexForProgress(captions: ScrollCaption[], p: number) {
  let idx = 0;
  for (let i = 0; i < captions.length; i++) {
    if (p >= captions[i].at) idx = i;
  }
  return idx;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    img.src = src;
  });
}

type Props = { captions?: ScrollCaption[] };

export default function Scrollytelling({ captions: captionsProp }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const frameLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [manifest, setManifest] = useState<FramesManifest | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadScrollFrames().then((m) => {
      if (!cancelled) setManifest(m);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !manifest) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    let cancelled = false;
    let ctx: gsap.Context | null = null;
    const captions =
          captionsProp?.length
            ? captionsProp
            : manifest.captions.length
              ? manifest.captions
              : FALLBACK_CAPTIONS;

    (async () => {
      const images = await Promise.all(manifest.frames.map((f) => loadImage(f.src)));
      if (cancelled) return;
      setReady(true);

      ctx = gsap.context(() => {
        captionRefs.current.forEach((el, i) => {
          if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 18 });
        });
        if (introRef.current) gsap.set(introRef.current, { opacity: 1, y: 0 });
        if (progressRef.current) gsap.set(progressRef.current, { scaleX: 0 });

        const isSequence = manifest.mode === "sequence" && images.length >= 8;
        const canvas = canvasRef.current;
        const c2d = canvas?.getContext("2d");

        const drawFrame = (progress: number) => {
          if (!isSequence || !canvas || !c2d || images.length === 0) return;
          const max = images.length - 1;
          const idx = Math.min(max, Math.max(0, Math.round(progress * max)));
          const img = images[idx];
          if (!img?.naturalWidth) return;

          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const w = canvas.clientWidth;
          const h = canvas.clientHeight;
          if (w === 0 || h === 0) return;
          const bw = Math.floor(w * dpr);
          const bh = Math.floor(h * dpr);
          if (canvas.width !== bw || canvas.height !== bh) {
            canvas.width = bw;
            canvas.height = bh;
            c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
          }

          const ir = img.naturalWidth / img.naturalHeight;
          const cr = w / h;
          let dw = w;
          let dh = h;
          let dx = 0;
          let dy = 0;
          if (ir > cr) {
            dh = h;
            dw = h * ir;
            dx = (w - dw) / 2;
          } else {
            dw = w;
            dh = w / ir;
            dy = (h - dh) / 2;
          }
          c2d.clearRect(0, 0, w, h);
          c2d.drawImage(img, dx, dy, dw, dh);
        };

        if (!isSequence) {
          frameLayerRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, { opacity: i === 0 ? 1 : 0, scale: 1.02 });
          });
        } else {
          drawFrame(0);
        }

        let lastCaption = 0;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=700%",
            pin: pin,
            scrub: 0.35,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              if (isSequence) drawFrame(p);

              const next = captionIndexForProgress(captions, p);
              if (next !== lastCaption) {
                const prevEl = captionRefs.current[lastCaption];
                const nextEl = captionRefs.current[next];
                if (prevEl) {
                  gsap.to(prevEl, { opacity: 0, y: -14, duration: 0.35, overwrite: true });
                }
                if (nextEl) {
                  gsap.to(nextEl, { opacity: 1, y: 0, duration: 0.4, overwrite: true });
                }
                lastCaption = next;
              }
            },
          },
        });

        tl.to(progressRef.current, { scaleX: 1, ease: "none", duration: 1 }, 0);

        if (introRef.current) {
          tl.to(
            introRef.current,
            { opacity: 0, y: -28, duration: 0.14, ease: "power1.out" },
            0.06,
          );
        }

        if (!isSequence) {
          const layers = frameLayerRefs.current.filter(Boolean) as HTMLDivElement[];
          const n = Math.max(layers.length - 1, 1);
          layers.forEach((el, i) => {
            const start = i / (n + 0.35);
            tl.fromTo(
              el,
              { scale: 1.02 },
              { scale: 1.12, duration: 0.55, ease: "none" },
              start,
            );
            if (i < layers.length - 1) {
              const cross = (i + 0.72) / (n + 0.35);
              tl.to(el, { opacity: 0, duration: 0.18, ease: "power1.inOut" }, cross);
              tl.to(layers[i + 1], { opacity: 1, duration: 0.18, ease: "power1.inOut" }, cross);
            }
          });
        }
      }, section);

      if (cancelled) {
        ctx.revert();
        ctx = null;
      }
    })();

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, [reducedMotion, manifest, captionsProp]);

  const captions =
    captionsProp?.length
      ? captionsProp
      : manifest?.captions?.length
        ? manifest.captions
        : FALLBACK_CAPTIONS;
  const keyframeFrames =
    manifest?.mode === "keyframes" ? manifest.frames : FALLBACK_FRAMES;
  const useSequence = Boolean(!reducedMotion && manifest?.mode === "sequence");

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative bg-gb-navy"
      aria-labelledby="story-heading"
    >
      <div
        ref={pinRef}
        className="cinematic-stage relative h-[100svh] w-full overflow-hidden"
      >
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-30 h-[2px] bg-white/10"
          aria-hidden="true"
        >
          <div
            ref={progressRef}
            className={`h-full origin-left bg-gradient-to-r from-gb-aqua via-gb-sky to-white/80 ${
              reducedMotion ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </div>

        {!manifest && !reducedMotion ? (
          <div className="absolute inset-0 z-10 bg-gb-navy" aria-hidden="true" />
        ) : null}

        {reducedMotion ? (
          <div className="relative flex h-full flex-col justify-center px-4 py-24 sm:px-6">
            <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="section-label mb-4 !bg-white/10 !text-sky-200">Our story</p>
                <h2
                  id="story-heading"
                  className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                >
                  Stay 100% Cool Inside
                </h2>
                <ul className="mt-6 space-y-3">
                  {captions.map((c) => (
                    <li key={c.text} className="text-lg text-sky-100/90">
                      {c.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/scroll/frame-story.svg"
                  alt="Gulf Breeze HVAC story overview"
                  className="w-full rounded-2xl bg-gb-deep/40 p-2"
                />
                <div className="grid grid-cols-3 gap-2">
                  {REDUCED_STATIC.map((item) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={item.src}
                      src={item.src}
                      alt={item.label}
                      className="h-16 w-full rounded-xl bg-white/10 object-contain p-2"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 z-0">
              {useSequence ? (
                <canvas
                  ref={canvasRef}
                  className={`h-full w-full transition-opacity duration-500 ${
                    ready ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden="true"
                />
              ) : (
                <div className="absolute inset-0">
                  {keyframeFrames.map((frame, i) => (
                    <div
                      key={frame.src}
                      ref={(el) => {
                        frameLayerRefs.current[i] = el;
                      }}
                      className="absolute inset-0 will-change-transform"
                      style={{ opacity: i === 0 ? 1 : 0 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={frame.src}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/35"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-gb-navy/80 to-transparent"
                aria-hidden="true"
              />
            </div>

            <div
              ref={introRef}
              className="pointer-events-none absolute inset-x-0 top-[22%] z-20 px-4 sm:px-6 md:top-[26%]"
            >
              <div className="mx-auto max-w-3xl text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-sky-200/80">
                  Lee County · 24/7 emergency AC
                </p>
                <h1
                  id="story-heading"
                  className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
                >
                  AC down in the heat?
                  <span className="mt-2 block bg-gradient-to-r from-sky-200 to-teal-200 bg-clip-text text-transparent">
                    We&apos;re on the way.
                  </span>
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-sm text-sky-100/85 sm:text-base">
                  Scroll to fly from blistering Florida heat into every cool room.
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-16 sm:pb-20">
              <div className="relative h-16 w-full max-w-2xl text-center">
                {captions.map((c, i) => (
                  <p
                    key={c.text}
                    ref={(el) => {
                      captionRefs.current[i] = el;
                    }}
                    className={`cinematic-caption absolute inset-x-0 bottom-0 text-2xl font-semibold tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl ${
                      i === 0 ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden={i !== 0}
                  >
                    {c.text}
                  </p>
                ))}
              </div>
            </div>

            <p className="pointer-events-none absolute bottom-5 left-0 right-0 z-20 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              Scroll to scrub
            </p>
          </>
        )}
      </div>
    </section>
  );
}
