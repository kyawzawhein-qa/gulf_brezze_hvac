"use client";

import { useState, useCallback } from "react";

export function useSave() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const run = useCallback(async (fn: () => Promise<void>) => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await fn();
      setMessage("Saved — refresh the public site to see changes.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, []);

  return { saving, message, error, run, setMessage, setError };
}
