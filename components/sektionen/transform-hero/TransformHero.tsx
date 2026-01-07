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

const UNSPLASH_IMAGES: Slide[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80",
    alt: "Raum und Licht",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2400&q=80",
    alt: "Gestaltung und Material",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=2400&q=80",
    alt: "Mensch und Raum",
  },
];

/* ---------------- HERO ---------------- */

export default function TransformHero({
  title,
  description,
}: TransformHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* ---- Container-Transformation ---- */
  const clipTop = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const clipSide = useTransform(scrollYProgress, [0, 1], ["0%", "6.25%"]);
  const clipRadius = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);

  const clipPath = useTransform<
    [string, string, string],
    string
  >(
    [clipTop, clipSide, clipRadius],
    ([t, s, r]) => `inset(${t} ${s} round ${r})`
  );

  /* ---- Text Crossfade ---- */
  const titleOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const descriptionOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.45],
    [0, 1]
  );

  return (
    <section ref={ref} className="relative h-[220vh] bg-white">
      <div className="sticky top-0 h-screen">
        <motion.div
          style={{ clipPath }}
          className="relative h-full w-full overflow-hidden bg-black"
        >
          {/* MEDIA */}
          <HeroCarousel images={UNSPLASH_IMAGES} />

          {/* TEXT */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-center px-6">
            <div className="max-w-4xl">
              <motion.h1
                style={{ opacity: titleOpacity }}
                className="text-4xl md:text-6xl font-semibold tracking-tight text-white"
              >
                {title}
              </motion.h1>

              <motion.p
                style={{ opacity: descriptionOpacity }}
                className="mt-6 text-lg md:text-xl text-white/90 leading-relaxed"
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
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIndex((v) => (v + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
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
          transition={{ duration: 1 }}
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
