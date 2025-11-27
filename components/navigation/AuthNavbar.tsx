// components/navigation/AuthAvatar.tsx
"use client";

import { useState } from "react";
import { User } from "lucide-react";
import AuthOverlay, { AuthMode } from "@/components/auth/AuthOverlay";

export default function AuthAvatar() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  const openSignin = () => setAuthMode("signin");
  const closeAuth = () => setAuthMode(null);

  return (
    <>
      {/* Button in der Navbar */}
      <button
        type="button"
        aria-label="Anmelden"
        onClick={openSignin}
        className="
          inline-flex h-8 w-8 items-center justify-center
          rounded-full bg-slate-900 text-white
          hover:bg-black
          transition-colors
        "
      >
        <User className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Overlay – nur sichtbar, wenn authMode != null */}
      <AuthOverlay
        mode={authMode}
        onClose={closeAuth}
        onSwitchMode={setAuthMode}
      />
    </>
  );
}
