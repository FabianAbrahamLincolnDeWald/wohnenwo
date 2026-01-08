"use client";

import * as React from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/* ---------------- TYPES ---------------- */

type Slide = {
  id: string;
  src: string;
  alt?: string;
};

type TransformHeroProps = {
  title: ReactNode;
  description: ReactNode;
};

/* ---------------- IMAGES ---------------- */

const IMAGES: Slide[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2400&q=80",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=2400&q=80",
  },
];

export default function TransformHero({
  title,
  description,
}: TransformHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* -------------------------------------------------
     SHRINK PHASE – endet bewusst früher (Plateau)
  ------------------------------------------------- */
  const shrinkProgress = useTransform(
    scrollYProgress,
    [0, 0.55],
    [0, 1],
    { clamp: true }
  );

  /* --- CONTAINER SIZE (max ~1680px sichtbar) --- */
  const clipTop = useTransform(shrinkProgress, [0, 1], ["0%", "11%"]);
  const clipSide = useTransform(shrinkProgress, [0, 1], ["0%", "8%"]);
  const clipRadius = useTransform(shrinkProgress, [0, 1], ["0px", "44px"]);

  const clipPath = useTransform<
    [string, string, string],
    string
  >(
    [clipTop, clipSide, clipRadius],
    ([t, s, r]) => `inset(${t} ${s} round ${r})`
  );

  /* --- BACKGROUND DIM --- */
  const dimOpacity = useTransform(
    shrinkProgress,
    [0.3, 1],
    [0, 0.45]
  );

  /* --- TEXT CROSSFADE (gleiche Position!) --- */
  const titleOpacity = useTransform(shrinkProgress, [0, 0.25], [1, 0]);
  const descriptionOpacity = useTransform(
    shrinkProgress,
    [0.25, 0.6],
    [0, 1]
  );

  return (
    <section ref={ref} className="relative h-[300vh] -mt-14 bg-white">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <motion.div
          style={{ clipPath }}
          className="relative h-full w-full overflow-hidden bg-black"
        >
          {/* IMAGES */}
          <HeroCarousel images={IMAGES} />

          {/* DIM OVERLAY */}
          <motion.div
            style={{ opacity: dimOpacity }}
            className="absolute inset-0 bg-black z-10"
          />

          {/* TEXT – exakt übereinander */}
          <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center px-6">
            <div className="relative w-full max-w-[52rem] h-[10rem]">
              {/* TITLE */}
              <motion.h1
                style={{ opacity: titleOpacity }}
                className="
                  absolute inset-0
                  flex items-center justify-center
                  text-center
                  text-[clamp(3.5rem,7vw,6rem)]
                  font-semibold
                  tracking-tight
                  text-white
                "
              >
                {title}
              </motion.h1>

              {/* DESCRIPTION */}
              <motion.p
                style={{ opacity: descriptionOpacity }}
                className="
                  absolute inset-0
                  flex items-center justify-center
                  text-center
                  text-[clamp(1.5rem,2.6vw,2rem)]
                  font-medium
                  leading-snug
                  text-white/90
                "
              >
                {description}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- CAROUSEL ---------------- */

function HeroCarousel({ images }: { images: Slide[] }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () => setIndex((v) => (v + 1) % images.length),
      5200
    );
    return () => clearInterval(id);
  }, [images.length]);

  const current = images[index];
  if (!current) return null;

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Image
            src={current.src}
            alt={current.alt ?? ""}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
