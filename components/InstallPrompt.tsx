"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const standalone =
      (window.navigator as any).standalone ||
      window.matchMedia("(display-mode: standalone)").matches;

    setIsIOS(ios);
    setIsStandalone(standalone);

    if (standalone) return;
    if (localStorage.getItem("pwaPromptDismissed")) return;

    // Chrome & Edge
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowModal(true), 4000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Safari / iOS fallback
    if (ios) {
      setTimeout(() => setShowModal(true), 4000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setTimeout(() => {
        setShowModal(false);
        setDeferredPrompt(null);
      }, 2000);
    }
  };

  const handleClose = () => {
    localStorage.setItem("pwaPromptDismissed", "true");
    setShowModal(false);
  };

  if (!showModal || isStandalone) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap');
      `}</style>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
            style={{ backgroundColor: "rgba(19,17,30,0.85)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
              style={{ backgroundColor: "#201f3d", border: "1px solid #3d3d69" }}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top accent bar */}
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #3d3d69, #58d98c, #3d3d69)" }} />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-lg leading-none transition-colors hover:text-[#58d98c]"
                style={{ color: "#a89fd4" }}
                aria-label="Dismiss"
              >
                ✕
              </button>

              <div className="p-8">
                {installed ? (
                  /* ── Success state ── */
                  <motion.div
                    className="flex flex-col items-center gap-4 py-4 text-center"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                      style={{ backgroundColor: "rgba(88,217,140,0.15)" }}
                    >
                      ✅
                    </div>
                    <h3
                      className="text-xl tracking-[0.15em] uppercase"
                      style={{ fontFamily: "Oswald, sans-serif", color: "#58d98c" }}
                    >
                      App Installed!
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#d7cfff", fontFamily: "Open Sans, sans-serif" }}>
                      HopeEdge Foundation is now on your home screen. Thank you for joining the mission.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* ── Header ── */}
                    <div className="flex items-center gap-4 mb-6">
                      {/* Mini logo mark */}
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: "#13111e", border: "1px solid #3d3d69" }}
                      >
                        <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="pwag" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#6ef5a8" />
                              <stop offset="100%" stopColor="#3dbf76" />
                            </linearGradient>
                          </defs>
                          <circle cx="24" cy="24" r="22" fill="#201f3d" stroke="#3d3d69" strokeWidth="1" />
                          <rect x="13" y="13" width="5" height="22" rx="2.5" fill="url(#pwag)" />
                          <rect x="30" y="13" width="5" height="22" rx="2.5" fill="url(#pwag)" />
                          <rect x="13" y="21" width="22" height="5" rx="2.5" fill="url(#pwag)" />
                        </svg>
                      </div>

                      <div>
                        <p
                          className="text-lg uppercase tracking-[0.12em] leading-tight"
                          style={{ fontFamily: "Oswald, sans-serif", color: "#ffffff" }}
                        >
                          HopeEdge
                        </p>
                        <p
                          className="text-[10px] tracking-[0.3em] uppercase"
                          style={{ fontFamily: "Oswald, sans-serif", color: "#58d98c" }}
                        >
                          Foundation
                        </p>
                      </div>
                    </div>

                    {/* ── Headline ── */}
                    <h2
                      className="text-2xl uppercase tracking-wide mb-2 leading-tight"
                      style={{ fontFamily: "Oswald, sans-serif", color: "#ffffff" }}
                    >
                      Install Our App
                    </h2>

                    <div className="h-0.5 w-12 mb-4" style={{ backgroundColor: "#58d98c" }} />

                    {/* ── Body ── */}
                    <p
                      className="text-sm leading-relaxed mb-6"
                      style={{ color: "#d7cfff", fontFamily: "Open Sans, sans-serif" }}
                    >
                      Get instant access to our programs, volunteer opportunities, and impact updates — right from your home screen. Stay connected to the mission, wherever you are.
                    </p>

                    {/* ── Feature pills ── */}
                    <div className="flex flex-wrap gap-2 mb-7">
                      {["📚 Programs", "🌍 Global Impact", "🤝 Volunteer", "🚨 Crisis Line"].map((f) => (
                        <span
                          key={f}
                          className="rounded-full px-3 py-1 text-xs tracking-wide"
                          style={{
                            backgroundColor: "rgba(88,217,140,0.1)",
                            color: "#58d98c",
                            border: "1px solid rgba(88,217,140,0.25)",
                            fontFamily: "Open Sans, sans-serif",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* ── iOS instructions ── */}
                    {isIOS && !deferredPrompt ? (
                      <div
                        className="rounded-xl p-4 mb-6 text-sm"
                        style={{
                          backgroundColor: "rgba(19,17,30,0.7)",
                          border: "1px solid #3d3d69",
                          color: "#d7cfff",
                          fontFamily: "Open Sans, sans-serif",
                        }}
                      >
                        <p className="font-semibold mb-3" style={{ color: "#ffffff" }}>
                          To install on iPhone / iPad:
                        </p>
                        <ol className="space-y-2">
                          {[
                            { icon: "⬆️", text: 'Tap the Share button in Safari' },
                            { icon: "➕", text: 'Select "Add to Home Screen"' },
                            { icon: "✅", text: 'Tap "Add" to confirm' },
                          ].map(({ icon, text }, i) => (
                            <li key={i} className="flex items-center gap-3">
                              <span
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs"
                                style={{ backgroundColor: "rgba(88,217,140,0.15)", color: "#58d98c" }}
                              >
                                {i + 1}
                              </span>
                              <span>{icon} {text}</span>
                            </li>
                          ))}
                        </ol>
                        <button
                          onClick={handleClose}
                          className="mt-5 w-full rounded-full py-3 text-xs font-bold tracking-[0.2em] uppercase transition-colors"
                          style={{ backgroundColor: "#58d98c", color: "#13111e" }}
                        >
                          Got It
                        </button>
                      </div>
                    ) : (
                      /* ── Install / Dismiss buttons ── */
                      <div className="flex gap-3">
                        <button
                          onClick={handleInstall}
                          className="flex-1 rounded-full py-3 text-xs font-bold tracking-[0.25em] uppercase transition-all hover:shadow-[0_0_20px_rgba(88,217,140,0.35)]"
                          style={{
                            backgroundColor: "#58d98c",
                            color: "#13111e",
                            fontFamily: "Oswald, sans-serif",
                          }}
                        >
                          Install Now
                        </button>
                        <button
                          onClick={handleClose}
                          className="flex-1 rounded-full py-3 text-xs tracking-[0.2em] uppercase transition-colors hover:border-[#d7cfff]"
                          style={{
                            border: "1px solid #3d3d69",
                            color: "#a89fd4",
                            fontFamily: "Oswald, sans-serif",
                          }}
                        >
                          Maybe Later
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}