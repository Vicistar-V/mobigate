import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
};

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  once?: boolean;
  blur?: boolean;
}

/** Scroll-triggered reveal with optional directional slide + blur. */
export const Reveal = ({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
  blur = true,
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -12% 0px" });
  const from = offset[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: blur ? "blur(10px)" : "blur(0px)", ...from }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
          : { opacity: 0, filter: blur ? "blur(10px)" : "blur(0px)", ...from }
      }
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
