"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useTransformHeroScroll(
  sectionRef: React.RefObject<HTMLDivElement | null>,
  shellRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (!sectionRef.current || !shellRef.current) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "top+=120%",
          scrub: true,
          pin: true,
        },
      });

      /* Raumformung */
      timeline.fromTo(
        shellRef.current,
        {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
        },
        {
          width: "87.5vw",
          height: "80vh",
          borderRadius: 40,
          ease: "none",
        },
        0
      );

      /* Titel → Beschreibung */
      timeline.to(
        ".transform-hero-title",
        { opacity: 0, y: -48, ease: "none" },
        0
      );

      timeline.fromTo(
        ".transform-hero-description",
        { opacity: 0, y: 48 },
        { opacity: 1, y: 0, ease: "none" },
        0.15
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, shellRef]);
}
