"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["subscribers", "likes & comments", "engagement"];
const CYCLE_MS = 7500;
const GLYPHS = "abcdefghijklmnopqrstuvwxyz";
/** Time between flips of one cell. Matches the flap-in animation in globals.css. */
const STEP_MS = 80;
/** Delay between neighbouring cells starting, so the board ripples left to right. */
const STAGGER_MS = 45;
/** How long a leaving cell takes to close up. Matches .flap-cell in globals.css. */
const CLOSE_MS = 260;

type Cell = {
  /** Character the cell ends on ("" when it is leaving). */
  target: string;
  /** Character currently on the flap. */
  shown: string;
  /** Bumped on every flip so the animation replays. */
  flip: number;
};

const toCells = (word: string): Cell[] => [...word].map((ch) => ({ target: ch, shown: ch, flip: 0 }));

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/** Measures every glyph the board can show, in em, using the headline's own font. */
function measureGlyphs(host: HTMLElement) {
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre;";
  host.appendChild(probe);
  const fontSize = parseFloat(getComputedStyle(host).fontSize);
  const widths: Record<string, number> = {};
  for (const ch of new Set([...GLYPHS, ...WORDS.join("")])) {
    probe.textContent = ch;
    widths[ch] = probe.getBoundingClientRect().width / fontSize;
  }
  probe.remove();
  return widths;
}

/** Splits cells into words so lines only break at settled spaces. */
function groupWords(cells: Cell[]) {
  const groups: { cells: Cell[]; start: number }[] = [];
  let current: { cells: Cell[]; start: number } | null = null;
  cells.forEach((cell, i) => {
    if (cell.target === " " && cell.shown === " ") {
      current = null;
      groups.push({ cells: [cell], start: i });
      return;
    }
    if (!current) {
      current = { cells: [], start: i };
      groups.push(current);
    }
    current.cells.push(cell);
  });
  return groups;
}

/** Cycles the hero's last word like a split-flap departures board. */
export function FlapWord() {
  const [index, setIndex] = useState(0);
  const [cells, setCells] = useState(() => toCells(WORDS[0]));
  const [widths, setWidths] = useState<Record<string, number> | null>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const lengthRef = useRef(WORDS[0].length);

  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => {
      if (live && hostRef.current) setWidths(measureGlyphs(hostRef.current));
    });
    const id = window.setInterval(() => setIndex((i) => (i + 1) % WORDS.length), CYCLE_MS);
    return () => {
      live = false;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (index === 0 && lengthRef.current === WORDS[0].length) return;
    const next = WORDS[index];
    const prevLength = lengthRef.current;
    lengthRef.current = next.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCells(toCells(next));
      return;
    }

    const length = Math.max(prevLength, next.length);
    setCells((prev) =>
      Array.from({ length }, (_, i) => ({
        target: next[i] ?? "",
        shown: prev[i]?.shown ?? "",
        flip: prev[i]?.flip ?? 0,
      })),
    );

    const timers: number[] = [];
    let last = 0;
    for (let i = 0; i < length; i++) {
      const target = next[i] ?? "";
      const spins = target === "" || target === " " ? 1 : 3 + Math.floor(Math.random() * 3);
      for (let s = 1; s <= spins; s++) {
        const at = i * STAGGER_MS + s * STEP_MS;
        last = Math.max(last, at);
        const shown = s === spins ? target : randomGlyph();
        timers.push(
          window.setTimeout(() => {
            setCells((prev) => prev.map((c, j) => (j === i ? { ...c, shown, flip: c.flip + 1 } : c)));
          }, at),
        );
      }
    }
    // Drop closed-up cells. Flip counts are kept so settled letters don't replay.
    timers.push(
      window.setTimeout(
        () => setCells((prev) => prev.filter((c) => c.target !== "")),
        last + CLOSE_MS + 50,
      ),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [index]);

  return (
    <>
      <span className="sr-only">{WORDS[0]}</span>
      <span ref={hostRef} className={widths ? "flap flap--measured" : "flap"} aria-hidden="true">
        {groupWords(cells).map(({ cells: group, start }) =>
          group.length === 1 && group[0].target === " " && group[0].shown === " " ? (
            " "
          ) : (
            <span key={start} className="flap-word">
              {group.map((cell, k) => (
                <span
                  key={start + k}
                  className="flap-cell"
                  // Each cell is exactly as wide as the letter on it, so scrambling
                  // letters never spill onto their neighbours.
                  style={widths ? { width: `${widths[cell.shown] ?? 0}em` } : undefined}
                >
                  <span className="flap-sizer">{cell.target || cell.shown || "​"}</span>
                  <span key={cell.flip} className="flap-glyph">
                    {cell.shown === " " ? " " : cell.shown}
                  </span>
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </>
  );
}
