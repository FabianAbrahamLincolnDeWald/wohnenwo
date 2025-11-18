import * as React from "react";

const PANEL_BG =
  "https://images.unsplash.com/photo-1613914153139-79eafdf15d23?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=4058";

export default function PanelImageSection() {
  const panelStyle = { ["--panel-h" as "--panel-h"]: "420px" };

  return (
    <section
      aria-label="panel-image"
      className="relative z-10 mt-8 md:mt-2 lg:mt-4 bg-white"
    >
      {/* Container: max-w-6xl */}
      <div className="mx-auto max-w-6xl px-6">
        <div
          className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl
                     aspect-[3/2] sm:aspect-[16/9] lg:aspect-auto lg:h-[var(--panel-h)]"
          style={panelStyle as React.CSSProperties}
        >
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${PANEL_BG})` }}
          />

          {/* feine Innenkante für klare Kontur */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]
                       shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(0,0,0,0.04)]"
          />
        </div>
      </div>
    </section>
  );
}
