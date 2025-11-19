"use client";

import * as React from "react";

export default function GlassPanel() {
  const panelStyle = {} as React.CSSProperties;
  (panelStyle as any)["--panel-h"] = "420px";

  return (
    <section
      aria-label="panel"
      className="relative z-10 -mt-24 md:-mt-32 lg:-mt-40 px-0 sm:px-6"
    >
      <div className="mx-auto w-full sm:w-[min(86vw,1120px)] md:w-[min(84vw,1120px)] lg:w-[min(78vw,1200px)]">
        <div
          className="relative overflow-hidden rounded-3xl h-[var(--panel-h)] p-6 md:p-10 bg-transparent shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
          style={panelStyle}
        >
          {/* Glasfilter / Blur */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-[inherit] backdrop-blur-[1.5px]"
            style={{
              filter: "url(#lensFilter) saturate(1.05) brightness(1.03)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 rounded-[inherit] bg-white/10"
          />
          <div
            aria-hidden
            className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
          />

          {/* äußerer Ring / Edge */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-[inherit] ring-1 ring-white/20 ring-offset-1 ring-offset-white/30"
          />

          {/* Lens-Filter Definition */}
          <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
            <filter
              id="lensFilter"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              filterUnits="objectBoundingBox"
            >
              <feComponentTransfer in="SourceAlpha" result="alpha">
                <feFuncA type="identity" />
              </feComponentTransfer>
              <feGaussianBlur in="alpha" stdDeviation="50" result="blur" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="blur"
                scale="50"
                xChannelSelector="A"
                yChannelSelector="A"
              />
            </filter>
          </svg>

          {/* hier kannst du später Content einbauen */}
        </div>
      </div>
    </section>
  );
}
