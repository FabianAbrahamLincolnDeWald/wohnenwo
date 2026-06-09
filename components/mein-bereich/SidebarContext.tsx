"use client";

import React, { createContext, useContext, useState } from "react";

type SidebarCtx = { isExpanded: boolean; toggle: () => void };

const SidebarContext = createContext<SidebarCtx>({ isExpanded: true, toggle: () => {} });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <SidebarContext.Provider value={{ isExpanded, toggle: () => setIsExpanded((p) => !p) }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebarState = () => useContext(SidebarContext);
