"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import AuthOverlay, { AuthMode } from "./AuthOverlay";

type AuthOverlayContextValue = {
  openAuthOverlay: (mode: AuthMode) => void;
  closeAuthOverlay: () => void;
};

const AuthOverlayContext = createContext<AuthOverlayContextValue | undefined>(
  undefined
);

export function AuthOverlayProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode | null>(null);

  const openAuthOverlay = useCallback((mode: AuthMode) => {
    setMode(mode);
  }, []);

  const closeAuthOverlay = useCallback(() => {
    setMode(null);
  }, []);

  return (
    <AuthOverlayContext.Provider value={{ openAuthOverlay, closeAuthOverlay }}>
      {children}
      {/* Overlay immer global verfügbar */}
      <AuthOverlay
        mode={mode}
        onClose={closeAuthOverlay}
        onSwitchMode={(newMode) => setMode(newMode)}
      />
    </AuthOverlayContext.Provider>
  );
}

export function useAuthOverlay(): AuthOverlayContextValue {
  const ctx = useContext(AuthOverlayContext);
  if (!ctx) {
    throw new Error("useAuthOverlay must be used within an AuthOverlayProvider");
  }
  return ctx;
}
