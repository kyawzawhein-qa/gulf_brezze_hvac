"use client";

import { FormEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

const DEFAULT_ZIPS = [
  "33901", "33902", "33903", "33904", "33905", "33907", "33908", "33909",
  "33912", "33913", "33914", "33916", "33917", "33919", "33920", "33921",
  "33922", "33924", "33928", "33931", "33936", "33957", "33966", "33967",
  "33971", "33972", "33973", "33974", "33975", "33976", "33990", "33991",
  "33993", "34134", "34135",
];

const DEFAULT_ISSUES = [
  { id: "no-cool", label: "No cool / warm air" },
  { id: "frozen", label: "Frozen coil / ice" },
  { id: "noise", label: "Strange noise" },
  { id: "leak", label: "Water leak" },
  { id: "tuneup", label: "Tune-up / maintenance" },
  { id: "replace", label: "Replacement quote" },
];

const DEFAULT_SLOTS = [
  { id: "today-230", label: "Today · 2:30 PM", note: "Emergency priority" },
  { id: "today-530", label: "Today · 5:30 PM", note: "Same-day" },
  { id: "tom-9", label: "Tomorrow · 9:00 AM", note: "Morning window" },
  { id: "tom-1", label: "Tomorrow · 1:00 PM", note: "Afternoon" },
];

type Issue = { id: string; label: string };
type Slot = { id: string; label: string; note: string };

type Step =
  | "welcome"
  | "zip"
  | "issue"
  | "contact"
  | "slots"
  | "confirm"
  | "success";

type Msg = { id: string; role: "bot" | "user"; text: string };

type Props = {
  welcomeText?: string;
  validZips?: string[];
  issues?: Issue[];
  slots?: Slot[];
  launcherLabel?: string;
  avatarPath?: string;
};

let msgCounter = 0;
function mid() {
  msgCounter += 1;
  return `m-${msgCounter}`;
}

const DEFAULT_WELCOME =
  "Hi — I'm the Gulf Breeze AI dispatcher (demo). I can help book emergency AC service in Lee County, FL. Ready?";

export default function ChatWidget({
  welcomeText = DEFAULT_WELCOME,
  validZips = DEFAULT_ZIPS,
  issues = DEFAULT_ISSUES,
  slots = DEFAULT_SLOTS,
  launcherLabel = "24/7 Chat",
  avatarPath = "/ui/chat-avatar.webp",
}: Props) {
  const zipSet = useMemo(() => new Set(validZips), [validZips]);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: mid(),
      role: "bot",
      text: welcomeText,
    },
  ]);
  const [zip, setZip] = useState("");
  const [zipError, setZipError] = useState("");
  const [issue, setIssue] = useState<Issue | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [contactError, setContactError] = useState("");

  const panelId = useId();
  const titleId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const push = useCallback((role: "bot" | "user", text: string) => {
    setMessages((prev) => [...prev, { id: mid(), role, text }]);
  }, []);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-chat", openHandler);
    return () => window.removeEventListener("open-chat", openHandler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      if (step === "welcome") firstFocusRef.current?.focus();
      else if (step === "zip") zipInputRef.current?.focus();
      else if (step === "contact") nameInputRef.current?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [open, step]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  const startFlow = () => {
    push("user", "Yes — let’s book service");
    push("bot", "Great. What’s your Lee County ZIP code? (Try 33901, 33904, 33914, 33916…)");
    setStep("zip");
  };

  const submitZip = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = zip.trim();
    if (!/^\d{5}$/.test(cleaned)) {
      setZipError("Enter a 5-digit ZIP.");
      return;
    }
    if (!zipSet.has(cleaned)) {
      setZipError("That ZIP isn’t in our Lee County demo coverage. Try 33901, 33904, 33914, or 33916.");
      return;
    }
    setZipError("");
    push("user", `ZIP ${cleaned}`);
    push("bot", `Got it — we cover ${cleaned}. What’s going on with your system?`);
    setStep("issue");
  };

  const pickIssue = (item: Issue) => {
    setIssue(item);
    push("user", item.label);
    push("bot", "Thanks. Who should we contact, and what’s the best mobile number?");
    setStep("contact");
  };

  const submitContact = (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const p = phone.replace(/\D/g, "");
    if (n.length < 2) {
      setContactError("Please enter your name.");
      return;
    }
    if (p.length < 10) {
      setContactError("Enter a 10-digit US phone number.");
      return;
    }
    setContactError("");
    const pretty = `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6, 10)}`;
    push("user", `${n} · ${pretty}`);
    push("bot", "Here are the next available demo slots. Pick one that works:");
    setStep("slots");
  };

  const pickSlot = (s: Slot) => {
    setSlot(s);
    push("user", s.label);
    push(
      "bot",
      `Confirm booking: ${issue?.label} at ZIP ${zip} for ${name}, ${s.label}. We’ll simulate a tech SMS alert after you confirm.`
    );
    setStep("confirm");
  };

  const confirmBooking = () => {
    push("user", "Confirm booking");
    push(
      "bot",
      `You’re booked (demo). A tech SMS would fire to the on-call crew with your notes. Confirmation #GB-${zip}-${Date.now().toString().slice(-5)}.`
    );
    setStep("success");
  };

  const reset = () => {
    setStep("welcome");
    setZip("");
    setZipError("");
    setIssue(null);
    setName("");
    setPhone("");
    setSlot(null);
    setContactError("");
    setMessages([
      {
        id: mid(),
        role: "bot",
        text: welcomeText,
      },
    ]);
  };

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        className="focus-ring fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-gb-teal to-gb-aqua px-4 text-sm font-bold text-white shadow-xl shadow-teal-700/30 transition hover:brightness-110 sm:bottom-6 sm:right-6"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="relative flex h-8 w-8 overflow-hidden rounded-full bg-white/20 ring-1 ring-white/30" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarPath} alt="" width={32} height={32} className="h-8 w-8 object-cover" />
        </span>
        <span className="pr-1">{open ? "Close" : launcherLabel}</span>
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="chat-panel fixed bottom-24 right-4 z-50 flex w-[min(100%-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white sm:right-6"
          style={{ maxHeight: "min(640px, calc(100svh - 7rem))" }}
        >
          <header className="flex items-center justify-between gap-2 bg-gradient-to-r from-gb-navy to-gb-deep px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarPath}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/25"
              />
              <div className="min-w-0">
                <h2 id={titleId} className="truncate text-sm font-bold">
                  Gulf Breeze Dispatcher
                </h2>
                <p className="flex items-center gap-1.5 text-[11px] text-sky-200">
                  <span className="pulse-dot !h-1.5 !w-1.5" aria-hidden="true" />
                  Demo AI · Online 24/7
                </p>
              </div>
            </div>
            <button
              type="button"
              className="focus-ring rounded-lg p-1.5 text-sky-100 hover:bg-white/10"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-4" aria-live="polite">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[90%] px-3 py-2 text-sm leading-relaxed ${
                  m.role === "bot" ? "chat-msg-bot mr-auto" : "chat-msg-user ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}

            {step === "welcome" && (
              <div className="flex flex-col gap-2 pt-1">
                <button ref={firstFocusRef} type="button" className="chat-option focus-ring" onClick={startFlow}>
                  Yes — book emergency service
                </button>
                <button
                  type="button"
                  className="chat-option focus-ring"
                  onClick={() => {
                    push("user", "Just browsing the demo");
                    push("bot", "No problem. Tap below anytime to run the full booking flow — great for live pitch walkthroughs.");
                  }}
                >
                  Just browsing the demo
                </button>
              </div>
            )}

            {step === "zip" && (
              <form onSubmit={submitZip} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <label htmlFor="chat-zip" className="block text-xs font-semibold text-gb-navy">
                  Lee County ZIP
                </label>
                <input
                  ref={zipInputRef}
                  id="chat-zip"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  className="focus-ring mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="e.g. 33901"
                  aria-invalid={!!zipError}
                  aria-describedby={zipError ? "zip-err" : undefined}
                />
                {zipError && (
                  <p id="zip-err" className="mt-1.5 text-xs text-red-600" role="alert">
                    {zipError}
                  </p>
                )}
                <button type="submit" className="btn-primary focus-ring mt-3 w-full !py-2 text-sm">
                  Continue
                </button>
              </form>
            )}

            {step === "issue" && (
              <div className="grid grid-cols-1 gap-2" role="listbox" aria-label="Issue type">
                {issues.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    className="chat-option focus-ring"
                    onClick={() => pickIssue(item)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {step === "contact" && (
              <form onSubmit={submitContact} className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div>
                  <label htmlFor="chat-name" className="block text-xs font-semibold text-gb-navy">
                    Full name
                  </label>
                  <input
                    ref={nameInputRef}
                    id="chat-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus-ring mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="chat-phone" className="block text-xs font-semibold text-gb-navy">
                    Mobile phone
                  </label>
                  <input
                    id="chat-phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="focus-ring mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="(239) 555-0100"
                    autoComplete="tel"
                    required
                  />
                </div>
                {contactError && (
                  <p className="text-xs text-red-600" role="alert">
                    {contactError}
                  </p>
                )}
                <button type="submit" className="btn-primary focus-ring w-full !py-2 text-sm">
                  See available slots
                </button>
              </form>
            )}

            {step === "slots" && (
              <div className="flex flex-col gap-2">
                {slots.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="chat-option focus-ring flex items-center justify-between gap-2"
                    onClick={() => pickSlot(s)}
                  >
                    <span>{s.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gb-teal">{s.note}</span>
                  </button>
                ))}
              </div>
            )}

            {step === "confirm" && slot && (
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gb-teal">Review</p>
                <ul className="mt-2 space-y-1 text-sm text-gb-navy">
                  <li>
                    <strong>Issue:</strong> {issue?.label}
                  </li>
                  <li>
                    <strong>ZIP:</strong> {zip}
                  </li>
                  <li>
                    <strong>Contact:</strong> {name}
                  </li>
                  <li>
                    <strong>Slot:</strong> {slot.label}
                  </li>
                </ul>
                <button type="button" className="btn-primary focus-ring mt-3 w-full !py-2 text-sm" onClick={confirmBooking}>
                  Confirm booking
                </button>
              </div>
            )}

            {step === "success" && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="mt-3 text-base font-bold text-emerald-900">Booking confirmed (demo)</p>
                <p className="mt-1 text-sm text-emerald-800/90">
                  Tech SMS alert simulated. In a live build this would notify the on-call crew.
                </p>
                <p className="mt-3 rounded-lg bg-white/70 px-2 py-1.5 text-xs font-medium text-emerald-900">
                  {slot?.label} · ZIP {zip} · {issue?.label}
                </p>
                <button type="button" className="btn-outline focus-ring mt-4 w-full !py-2 text-sm" onClick={reset}>
                  Run demo again
                </button>
              </div>
            )}
          </div>

          <footer className="border-t border-slate-100 bg-white px-3 py-2 text-center text-[10px] text-gb-muted">
            Client-side mock · No OpenAI / Cal.com / Twilio
          </footer>
        </div>
      )}
    </>
  );
}
