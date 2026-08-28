import { useRef, useEffect, useState, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

const directionStyles: Record<Direction, { hidden: string; visible: string }> = {
  up: {
    hidden: "translate-y-12 opacity-0",
    visible: "translate-y-0 opacity-100",
  },
  down: {
    hidden: "-translate-y-12 opacity-0",
    visible: "translate-y-0 opacity-100",
  },
  left: {
    hidden: "translate-x-12 opacity-0",
    visible: "translate-x-0 opacity-100",
  },
  right: {
    hidden: "-translate-x-12 opacity-0",
    visible: "translate-x-0 opacity-100",
  },
  scale: {
    hidden: "scale-90 opacity-0",
    visible: "scale-100 opacity-100",
  },
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const styles = directionStyles[direction];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className={isVisible ? styles.visible : styles.hidden} style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}>
        {children}
      </div>
    </div>
  );
}
