"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { ApiRequestError } from "@/lib/api-client";

type RemoteState<T> = { status: "loading" } | { status: "ready"; data: T } | { status: "error"; message: string };

/** Loads data for a screen with explicit loading, error, and retry states. */
export function useRemoteData<T>(load: () => Promise<T>, key: string) {
  const [state, setState] = useState<RemoteState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const runLoad = useEffectEvent(load);

  useEffect(() => {
    let active = true;
    runLoad()
      .then((data) => active && setState({ status: "ready", data }))
      .catch((error: unknown) => {
        const message = error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
        if (active) setState({ status: "error", message });
      });
    return () => {
      active = false;
    };
  }, [key, attempt]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }

  return { state, retry };
}
