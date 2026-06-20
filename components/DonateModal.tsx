"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Update these with the real foundation bank details
const ACCOUNT = {
  bankName: "Your Bank Name",
  accountName: "Rigar Kariya Gender Empowerment Foundation",
  accountNumber: "0123456789",
};

export default function DonateModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", country: "", amount: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable, fail quietly
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 theme-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative z-10 w-full max-w-lg rounded-2xl p-8 shadow-2xl theme-card"
          initial={{ opacity: 0, scale: 0.92, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <button onClick={onClose} className="absolute right-5 top-5 text-xl leading-none transition-colors theme-close-btn">
            ✕
          </button>

          {submitted ? (
            <motion.div
              className="flex flex-col gap-5 py-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-5xl">🙏</div>
              <h3 className="font-oswald text-2xl tracking-widest uppercase text-accent">Thank You!</h3>
              <p className="text-sm leading-relaxed theme-text-sub open-sans">
                Please complete your donation of{" "}
                <strong className="theme-text-main">
                  ₦{form.amount ? Number(form.amount).toLocaleString() : "0"}
                </strong>{" "}
                using the account details below. We'll send a confirmation to{" "}
                <strong className="theme-text-main">{form.email}</strong> once received.
              </p>

              <div className="rounded-xl p-5 text-left theme-input">
                <p className="text-xs tracking-widest uppercase mb-1 theme-text-muted">Account Name</p>
                <p className="text-sm font-semibold mb-4 theme-text-main">{ACCOUNT.accountName}</p>

                <p className="text-xs tracking-widest uppercase mb-1 theme-text-muted">Bank Name</p>
                <p className="text-sm font-semibold mb-4 theme-text-main">{ACCOUNT.bankName}</p>

                <p className="text-xs tracking-widest uppercase mb-1 theme-text-muted">Account Number</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-oswald text-xl tracking-wide text-[#58d98c]">{ACCOUNT.accountNumber}</p>
                  <button
                    onClick={handleCopy}
                    className="rounded-full border border-[#58d98c] px-4 py-1.5 text-xs tracking-widest uppercase text-[#58d98c] hover:bg-[#58d98c] hover:text-[#13111e] transition-all bg-transparent cursor-pointer"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-2 rounded-full bg-[#58d98c] px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-[#3dbf76] transition-colors text-[#13111e] border-none cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <>
              <h2 className="font-oswald text-2xl tracking-[0.2em] uppercase mb-1 theme-text-main">Donate</h2>
              <div className="mb-5 h-0.5 w-16 bg-[#58d98c]" />
              <p className="text-sm mb-6 leading-relaxed theme-text-sub open-sans">
                Every donation helps RKGEF reach more women and girls across Nigeria. Fill in your
                details and we'll share our account information to complete the transfer.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "your@email.com" },
                  { label: "State / Country", key: "country", type: "text", placeholder: "Where are you based?" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs tracking-widest uppercase mb-1 theme-text-muted">{label}</label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors theme-input"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs tracking-widest uppercase mb-1 theme-text-muted">
                    Donation Amount (₦)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 5000"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors theme-input"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded-full bg-[#58d98c] py-3 font-bold tracking-[0.25em] text-sm text-[#13111e] uppercase hover:bg-[#3dbf76] active:scale-95 transition-all border-none cursor-pointer"
                >
                  Continue to Account Details
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}