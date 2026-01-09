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

const HERO_SRC =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80";

/* ======================================================
   COMPONENT
====================================================== */

export default function TransformHero({
  title,
  description,
}: TransformHeroProps) {
  /* ======================================================
     DESKTOP HERO (Transform / Scroll)
  ====================================================== */

  const ref = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const shrinkProgress = useTransform(
    scrollYProgress,
    [0, 0.38],
    [0, 1],
    { clamp: true }
  );

  const clipTop = useTransform(shrinkProgress, [0, 1], ["0%", "11%"]);
  const clipSide = useTransform(shrinkProgress, [0, 1], ["0%", "8%"]);
  const clipRadius = useTransform(shrinkProgress, [0, 1], ["0px", "44px"]);

  const clipPath = useTransform(
    [clipTop, clipSide, clipRadius],
    ([t, s, r]) => `inset(${t} ${s} round ${r})`
  );

  const dimOpacity = useTransform(shrinkProgress, [0.25, 1], [0, 0.45]);

  const titleOpacity = useTransform(shrinkProgress, [0, 0.3], [1, 0]);
  const descriptionOpacity = useTransform(
    shrinkProgress,
    [0.3, 0.65],
    [0, 1]
  );

  return (
    <>
      {/* ==================================================
          MOBILE HERO
      ================================================== */}
      <section className="block md:hidden relative h-[90vh] -mt-14 bg-black">
        <Image
          src={HERO_SRC}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-md">
            <h1 className="text-[2.4rem] font-semibold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-6 text-[1.1rem] font-medium leading-snug text-white/90">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          TABLET HERO
      ================================================== */}
      <section className="hidden md:block lg:hidden relative h-screen -mt-14 bg-black">
        <Image
          src={HERO_SRC}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex h-full items-center justify-center px-10 text-center">
          <div className="max-w-2xl">
            <h1 className="text-[3.4rem] font-semibold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-8 text-[1.35rem] font-medium leading-snug text-white/90">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          DESKTOP HERO
      ================================================== */}
      <section
        ref={ref}
        className="hidden lg:block relative h-[150vh] -mt-14 bg-white"
      >
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <motion.div
            style={{ clipPath }}
            className="relative h-full w-full overflow-hidden bg-black"
          >
            <HeroCarousel images={IMAGES} />

            <motion.div
              style={{ opacity: dimOpacity }}
              className="absolute inset-0 bg-black z-10"
            />

            <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center px-6">
              <div className="relative w-full max-w-208 h-40 text-center">
                <motion.h1
                  style={{ opacity: titleOpacity }}
                  className="absolute inset-0 flex items-center justify-center text-[clamp(2.5rem,5vw,4rem)] font-semibold tracking-tight text-white"
                >
                  {title}
                </motion.h1>

                <motion.p
                  style={{ opacity: descriptionOpacity }}
                  className="absolute inset-0 flex items-center justify-center text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-snug text-white/90"
                >
                  {description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ======================================================
   CAROUSEL – immer aktiv (wie vorher)
====================================================== */

function HeroCarousel({ images }: { images: Slide[] }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5200);
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
