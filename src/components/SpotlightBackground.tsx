"use client";

import { useState, useRef, useEffect } from "react";

const SPOTLIGHT_RADIUS = 250;

// Elements over which the spotlight ("after" image) should NOT appear.
// Interactive controls stay fully readable and clickable.
const INTERACTIVE_SELECTOR =
  "button, a, input, select, textarea, label, summary, [role='button'], [role='link'], [role='tab'], [role='menuitem'], [contenteditable='true']";

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

    const applyPosition = (
      clientX: number,
      clientY: number,
      target: EventTarget | null
    ) => {
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Keep buttons, links and form controls crisp: never cover them with the
      // "after" spotlight so they stay readable and clickable.
      const t = target instanceof Element ? target : null;
      const overInteractive = !!t && !!t.closest(INTERACTIVE_SELECTOR);

      if (overInteractive) {
        setIsHovering(false);
        return;
      }

      setMousePos({ x, y });
      setIsHovering(x >= 0 && y >= 0 && x <= rect.width && y <= rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Snapshot coordinates now — the event object may be reused by the browser.
      const { clientX, clientY, target } = e;
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        applyPosition(clientX, clientY, target);
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
      {/* Before Image - Always visible, behind the page content */}
      <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-center bg-fixed"
          style={{
            backgroundImage: 'url("/assets/background-befor-img.png")',
            backgroundSize: "90%",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* After Image - ABOVE the page content (below header z-50) so it visually
          replaces text under the cursor inside a big spotlight.
          Hidden over buttons/links so they stay readable & clickable. */}
      {isHovering && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-40"
          style={{
            backgroundImage: 'url("/assets/background-after-img.png")',
            backgroundSize: "90%",
            backgroundPosition: "center",
            maskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 70%)`,
            WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 70%)`,
          }}
        />
      )}
    </>
  );
}