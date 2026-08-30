"use client";

import { useState, useRef, useEffect } from "react";

const SPOTLIGHT_RADIUS = 250;

export default function SpotlightBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Track the mouse at the window level instead of on the container itself.
  // The container has `pointer-events: none` so it can never be a pointer-event
  // target — listening on window ensures the spotlight also follows the cursor
  // when it is over the raw background image (not just over the content).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;

    const applyPosition = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      setMousePos({ x, y });
      setIsHovering(x >= 0 && y >= 0 && x <= rect.width && y <= rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Snapshot coordinates now — the event object may be reused by the browser.
      const { clientX, clientY } = e;
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        applyPosition(clientX, clientY);
      });
    };

    // Cursor left the browser viewport entirely.
    const handleMouseLeave = () => setIsHovering(false);
    // Tab/app lost focus (e.g. Alt+Tab away) — hide the spotlight.
    const handleBlur = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("blur", handleBlur);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Before Image - fixed backdrop at the very back of the page. The negative
          z-index (inside the page's `isolate` stacking context) keeps it above the
          page background but BELOW all content, so the footer, cards, buttons and
          links always stay visible and clickable on top of it. */}
      <div ref={containerRef} className="pointer-events-none fixed inset-0 -z-20">
        <div
          className="absolute inset-0 bg-center bg-fixed"
          style={{
            backgroundImage: 'url("/assets/background-befor-img.png")',
            backgroundSize: "90%",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* After Image - sits just above the before image and is revealed through a
          cursor-following spotlight mask. It lives BEHIND the page content (never
          above it), so the effect keeps running even when the cursor is over a
          button/link — the control simply stays visible on top of the spotlight.
          It is always mounted and faded with opacity so the image preloads and
          the spotlight fades in/out smoothly instead of popping in. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          backgroundImage: 'url("/assets/background-after-img.png")',
          backgroundSize: "90%",
          backgroundPosition: "center",
          maskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 70%)`,
        }}
      />
    </>
  );
}