"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { useEventListener, useLocalStorage } from "usehooks-ts";
import { sounds } from "@/lib/sounds";

export type SoundType =
    | "click"
    | "success"
    | "error"
    | "pop"
    | "toggle"
    | "tick"
    | "whoosh"
    | "confirm"
    | "warning";

type SoundContextValue = {
    playSound: (type?: SoundType) => void;
    muted: boolean;
    setMuted: (v: boolean) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const MUTED_KEY = "site:sound:muted";

const SOUND_FN: Record<SoundType, (() => void) | undefined> = {
    click: sounds.click,
    success: sounds.success,
    error: sounds.error,
    pop: sounds.pop,
    toggle: sounds.toggle,
    tick: sounds.tick,
    whoosh: sounds.whoosh,
    confirm: sounds.confirm,
    warning: sounds.warning,
};

const INTERACTIVE_SELECTOR =
    [
        "[data-sound]",
        "button",
        '[role="button"]',
        "a[href]",
        'input[type="button"]',
        'input[type="submit"]',
    ].join(",");

function isDisabled(el: Element): boolean {
    // Covers native disabled + aria-disabled patterns.
    if (el.getAttribute("aria-disabled") === "true") return true;

    // Some elements (button/input) have a real disabled property.
    const maybeDisabled = el as unknown as { disabled?: boolean };
    return Boolean(maybeDisabled.disabled);
}

function shouldPlayForElement(el: Element): boolean {
    const attr = el.getAttribute("data-sound");
    if (attr === "false") return false; // explicit opt-out
    return !isDisabled(el);
}

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // SSR-safe: initializeWithValue false avoids reading localStorage during SSR/hydration.
    const [muted, setMuted] = useLocalStorage<boolean>(MUTED_KEY, false, {
        initializeWithValue: false,
    });

    const unlockedRef = useRef(false);

    const ensureUnlocked = useCallback(() => {
        if (unlockedRef.current) return;
        unlockedRef.current = true;

        // Touch audio on first gesture to satisfy autoplay policies.
        // This aligns with the general requirement that audio contexts often need user interaction. :contentReference[oaicite:1]{index=1}
        try {
            SOUND_FN.tick?.();
        } catch {
            // ignore
        }
    }, []);

    const playSound = useCallback(
        (type: SoundType = "click") => {
            if (muted) return;

            try {
                (SOUND_FN[type] ?? SOUND_FN.click)?.();
            } catch {
                // ignore
            }
        },
        [muted],
    );

    // Delegated click listener (capture phase) for "native interactive" + [data-sound] opt-in.
    useEventListener(
        "click",
        (e: MouseEvent) => {
            const target = e.target as Element | null;
            if (!target) return;

            const el = target.closest(INTERACTIVE_SELECTOR);
            if (!el) return;
            if (!shouldPlayForElement(el)) return;

            ensureUnlocked();
            playSound("click");
        },
        useMemo(() => ({ current: document }), []),
        { capture: true },
    );

    const value = useMemo<SoundContextValue>(
        () => ({ playSound, muted, setMuted }),
        [playSound, muted, setMuted],
    );

    return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export function useSound(): SoundContextValue {
    const ctx = useContext(SoundContext);
    if (!ctx) throw new Error("useSound must be used within a SoundProvider");
    return ctx;
}
