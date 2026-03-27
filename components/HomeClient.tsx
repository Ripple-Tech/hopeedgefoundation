"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, cubicBezier } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

// ── Theme Toggle ──────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 theme-toggle-btn"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.22 }}
          className="text-base leading-none select-none"
        >
          {isDark ? "☀️" : "🌙"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: cubicBezier(0.22, 1, 0.36, 1) },
  }),
};

function useScrollIn() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

// Shared scroll helper used everywhere
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

// ── Modal / Volunteer Form ────────────────────────────────────────────────────
function VolunteerModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", country: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            <motion.div className="flex flex-col items-center gap-4 py-8 text-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-5xl">🌿</div>
              <h3 className="font-oswald text-2xl tracking-widest uppercase text-accent">Thank You!</h3>
              <p className="text-sm leading-relaxed theme-text-sub">
                We've received your application. Our team will reach out within 48 hours.
              </p>
              <button onClick={onClose}
                className="mt-4 rounded-full bg-[#58d98c] px-8 py-2 text-sm font-bold tracking-widest uppercase hover:bg-[#3dbf76] transition-colors text-[#13111e]">
                Close
              </button>
            </motion.div>
          ) : (
            <>
              <h2 className="font-oswald text-2xl tracking-[0.2em] uppercase mb-1 theme-text-main">Be a Volunteer</h2>
              <div className="mb-5 h-0.5 w-16 bg-[#58d98c]" />
              <p className="text-sm mb-6 leading-relaxed theme-text-sub open-sans">
                Join changemakers across Nigeria and beyond. Fill out the form and we'll contact you about volunteer opportunities.
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
                      type={type} required placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors theme-input"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-1 theme-text-muted">
                    Why do you want to volunteer?
                  </label>
                  <textarea
                    rows={3} placeholder="Tell us about your motivation..."
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors resize-none theme-input"
                  />
                </div>
                <button type="submit"
                  className="mt-2 rounded-full bg-[#58d98c] py-3 font-bold tracking-[0.25em] text-sm text-[#13111e] uppercase hover:bg-[#3dbf76] active:scale-95 transition-all">
                  Submit Application
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ onVolunteer }: { onVolunteer: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll-aware background
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Auto-close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close menu + scroll — 50ms delay lets exit animation start first
  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => scrollTo(id), 50);
  };

  const links = [
    { label: "About",    id: "about"    },
    { label: "Programs", id: "programs" },
    { label: "Impact",   id: "impact"   },
    { label: "Contact",  id: "contact"  },
  ];

  return (
    <>
      {/* ── Fixed navbar bar ── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? "theme-nav-scrolled" : ""}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0 text-left"
          >
            <Image src="/logo.png" alt="RKGEF Logo" width={46} height={46} className="rounded-full" />
            <div>
              <span className="block font-oswald text-lg tracking-[0.15em] uppercase theme-text-main">
                Rigar Kariya
              </span>
              <span className="block text-[9px] tracking-[0.25em] uppercase leading-none theme-text-muted">
                Gender Empowerment Foundation
              </span>
            </div>
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {links.map(({ label, id }) => (
              <li key={id}>
                <button
                  onClick={() => handleNavClick(id)}
                  className="text-xs tracking-[0.2em] uppercase hover:text-[#58d98c] transition-colors theme-text-sub bg-transparent border-none cursor-pointer p-0"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={onVolunteer}
              className="rounded-full border border-[#58d98c] px-5 py-2 text-xs tracking-widest uppercase text-[#58d98c] hover:bg-[#58d98c] hover:text-[#13111e] transition-all duration-300"
            >
              Volunteer
            </button>
            <button className="rounded-full bg-[#58d98c] px-5 py-2 text-xs tracking-widest font-bold uppercase text-[#13111e] hover:bg-[#3dbf76] transition-colors">
              Donate
            </button>
          </div>

          {/* Mobile: theme + animated hamburger */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="relative flex h-9 w-9 flex-col items-center justify-center bg-transparent border-none cursor-pointer p-0"
            >
              {/* Bar 1 → top arm of × */}
              <motion.span
                className="absolute block h-0.5 w-6 rounded-full theme-hamburger-bar"
                animate={menuOpen
                  ? { rotate: 45, y: 0 }
                  : { rotate: 0,  y: -8 }
                }
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
              {/* Bar 2 → fades out */}
              <motion.span
                className="absolute block h-0.5 w-6 rounded-full theme-hamburger-bar"
                animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              {/* Bar 3 → bottom arm of × */}
              <motion.span
                className="absolute block h-0.5 w-6 rounded-full theme-hamburger-bar"
                animate={menuOpen
                  ? { rotate: -45, y: 0 }
                  : { rotate: 0,   y: 8 }
                }
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile drawer (rendered outside nav — avoids overflow:hidden clip) ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Transparent backdrop — tap anywhere to close */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[38] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              className="fixed left-0 right-0 z-[39] md:hidden theme-mobile-menu shadow-xl"
              style={{ top: 72 }}            /* sits flush below the 72px navbar */
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="px-6 pt-4 pb-6 flex flex-col gap-1">
                {/* Section links — staggered slide-in */}
                {links.map(({ label, id }, i) => (
                  <motion.button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className="w-full text-left py-3.5 px-4 rounded-xl text-sm tracking-[0.2em] uppercase theme-text-sub hover:text-[#58d98c] hover:bg-[#58d98c]/10 transition-all bg-transparent border-none cursor-pointer"
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.055, duration: 0.22, ease: "easeOut" }}
                  >
                    {label}
                  </motion.button>
                ))}

                {/* Divider */}
                <motion.div
                  className="my-2 h-px theme-divider"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.22 }}
                />

                {/* CTA buttons */}
                <motion.button
                  onClick={() => { setMenuOpen(false); onVolunteer(); }}
                  className="w-full rounded-full bg-[#58d98c] py-3.5 text-sm font-bold tracking-widest uppercase text-[#13111e] hover:bg-[#3dbf76] active:scale-95 transition-all border-none cursor-pointer"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26, duration: 0.22 }}
                >
                  Be a Volunteer
                </motion.button>

                <motion.button
                  className="w-full rounded-full border border-[#58d98c] py-3.5 text-sm font-bold tracking-widest uppercase text-[#58d98c] hover:bg-[#58d98c] hover:text-[#13111e] transition-all mt-2 cursor-pointer bg-transparent"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.31, duration: 0.22 }}
                >
                  Donate
                </motion.button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ onVolunteer }: { onVolunteer: () => void }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden flex items-center theme-hero">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute h-px theme-hero-line"
            style={{ top: `${15 + i * 14}%`, left: 0, right: 0 }}
            initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.3 + i * 0.08 }} />
        ))}
        <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full theme-glow-1 blur-[120px]" />
        <div className="absolute left-1/4 bottom-0 h-[400px] w-[400px] translate-y-1/2 rounded-full theme-glow-2 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="mb-6 inline-flex items-center gap-3">
            <div className="h-px w-12 bg-[#58d98c]" />
            <span className="text-xs tracking-[0.35em] uppercase text-[#58d98c]">
              Breaking Silence. Building Futures.
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="font-oswald text-5xl md:text-6xl lg:text-7xl font-normal leading-none tracking-tight uppercase mb-4">
            <span className="theme-text-main">RIGAR KARIYA</span><br />
            <span className="theme-text-sub">GENDER</span><br />
            <span className="theme-outline-text">EMPOWERMENT</span>
          </motion.h1>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="my-6 h-px w-24 theme-divider-faint" />

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="text-base leading-relaxed max-w-md theme-text-sub open-sans">
            Rigar Kariya Gender Empowerment Foundation (RKGEF) is a registered non-governmental,
            non-profit organisation breaking the silence on gender violence, advancing menstrual
            health, and empowering women through education, legal awareness, and economic support for the less privileged and vulnerable people —
            one community at a time.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="mt-10 flex flex-wrap gap-4">
            <button onClick={onVolunteer}
              className="rounded-full bg-[#58d98c] px-8 py-4 text-sm font-bold tracking-[0.25em] uppercase text-[#13111e] transition-all hover:shadow-[0_0_30px_rgba(88,217,140,0.4)] hover:bg-[#3dbf76] border-none cursor-pointer">
              Join Our Mission
            </button>
            <button
              onClick={() => scrollTo("programs")}
              className="rounded-full border px-8 py-4 text-sm tracking-[0.2em] uppercase transition-colors theme-ghost-btn bg-transparent cursor-pointer"
            >
              Our Programs
            </button>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="mt-14 flex gap-10">
            {[
              { val: "4+",     label: "States Active"  },
              { val: "5,000+", label: "Lives Impacted" },
              { val: "200+",   label: "Volunteers"     },
            ].map(({ val, label }) => (
              <div key={label}>
                <div className="font-oswald text-3xl tracking-tight text-[#58d98c]">{val}</div>
                <div className="text-xs tracking-widest uppercase mt-0.5 theme-text-muted">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div className="relative"
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
          <div className="relative overflow-hidden rounded-2xl">
            <img src="/veil1.png"
              alt="RKGEF volunteer" className="w-full object-cover" />
            <div className="absolute inset-0 theme-img-overlay" />
          </div>
          <motion.div className="absolute -bottom-6 -left-6 rounded-xl p-4 shadow-xl theme-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-lg text-[#58d98c]"
                style={{ backgroundColor: "rgba(88,217,140,0.15)" }}>🌍</div>
              <div>
                <div className="text-sm font-semibold theme-text-main">Community Reach</div>
                <div className="text-xs theme-text-muted">Active across Nigeria</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 theme-bottom-bar" />
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const { ref, inView } = useScrollIn();
  return (
    <section id="about" className="py-24 relative overflow-hidden theme-section-alt">
      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-16 items-start">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}>
          <div className="overflow-hidden rounded-2xl theme-card-border">
            <img src="/girls.jpg" alt="RKGEF Community"
              className="w-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}
            className="mt-6 rounded-xl p-4 flex items-start gap-3 theme-card">
            <div className="text-2xl shrink-0">📜</div>
            <div>
              <p className="font-oswald text-sm uppercase tracking-wide theme-text-main">Officially Registered</p>
              <p className="text-xs leading-relaxed mt-1 theme-text-sub open-sans">
                Registered with the Corporate Affairs Commission on{" "}
                <strong className="theme-text-main">14th August 2025</strong> · Reg. No.{" "}
                <strong className="text-[#58d98c]">8701675</strong>
              </p>
            </div>
          </motion.div>
        </motion.div>

        <div>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
            className="mb-5 inline-flex items-center gap-3">
            <div className="h-px w-10 bg-[#58d98c]" />
            <span className="text-xs tracking-[0.3em] uppercase text-[#58d98c]">Who We Are</span>
          </motion.div>

          {[
            { title: "Our Goal", custom: 3,
              text: "To promote dignity, wellbeing, and empowerment among vulnerable populations through focused and sustainable social interventions." },
            { title: "Our Mission", custom: 5,
              text: "To promote social wellbeing through phased, community-driven interventions that address critical issues affecting women, girls, and vulnerable populations — beginning with priority needs and gradually expanding to achieve lasting impact." },
            { title: "Our Vision", custom: 7,
              text: "A society where vulnerable individuals and communities live with dignity, good health, equal opportunities, and sustainable support systems." },
          ].map(({ title, custom, text }, idx) => (
            <div key={title}>
              <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={custom}
                className={`font-oswald text-3xl font-normal uppercase leading-tight mb-3 tracking-wide ${idx === 0 ? "theme-text-main" : "theme-heading-accent"}`}>
                {title}
              </motion.h2>
              <motion.p variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={custom + 1}
                className="leading-relaxed mb-5 text-sm theme-text-sub open-sans">
                {text}
              </motion.p>
              {idx < 2 && <div className="h-px w-full mb-5 theme-divider" />}
            </div>
          ))}

          <motion.button
            variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={10}
            onClick={() => scrollTo("programs")}
            className="rounded-full bg-[#58d98c] px-8 py-3 text-sm font-bold tracking-[0.25em] uppercase text-[#13111e] hover:bg-[#3dbf76] transition-colors border-none cursor-pointer"
          >
            Our Programs →
          </motion.button>
        </div>
      </div>
    </section>
  );
}

// ── Programs ──────────────────────────────────────────────────────────────────
const programs = [
  { img: "/women1.png",
    title: "Gender Violence Prevention",
    desc: "Breaking the silence on gender-based violence through awareness campaigns, survivor support, and community-based protection networks.",
    tag: "Protection", icon: "🛡️" },
  { img: "/pregnant.jpg",
    title: "Menstrual & Reproductive Health",
    desc: "Creating awareness on menstrual health, cervical cancer, and bodily autonomy while increasing access to essential hygiene products.",
    tag: "Health", icon: "🌸" },
  { img: "/riga.jpg",
    title: "Women's Empowerment",
    desc: "Empowering women through financial literacy, education, entrepreneurship training, and legal awareness programs.",
    tag: "Empowerment", icon: "💪" },
  { img: "/girl.png",
    title: "Support for Vulnerable Women",
    desc: "Providing support for vulnerable women, girls, and elderly.",
    tag: "Support", icon: "🤝" },
  { img: "/children1.jpg",
    title: "Policy & Cultural Advocacy",
    desc: "Influencing policies and shifting cultural mindsets through storytelling, advocacy campaigns, and community engagement.",
    tag: "Advocacy", icon: "📢" },
];

function Programs() {
  const { ref, inView } = useScrollIn();
  return (
    <section id="programs" className="py-28 theme-section-main">
      <div className="mx-auto max-w-7xl px-6">
        <div ref={ref} className="text-center mb-16">
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}
            className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#58d98c]" />
            <span className="text-xs tracking-[0.3em] uppercase text-[#58d98c]">Our Work</span>
            <div className="h-px w-10 bg-[#58d98c]" />
          </motion.div>
          <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}
            className="font-oswald text-4xl md:text-5xl font-normal uppercase tracking-wide">
            <span className="theme-text-main">Our Programs,</span><br />
            <span className="theme-heading-accent">Our Commitments</span>
          </motion.h2>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
            className="mx-auto mt-4 h-1 w-24 theme-divider" />
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={3}
          className="grid md:grid-cols-5 rounded-2xl overflow-hidden mb-6 theme-border">
          <div className="md:col-span-3 overflow-hidden">
            <img src={programs[0].img} alt={programs[0].title}
              className="w-full h-120 md:h-140 object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="md:col-span-2 p-10 flex flex-col justify-center theme-section-alt">
            <span className="text-[10px] tracking-[0.35em] uppercase rounded-full w-fit mb-4 px-3 py-1 text-[#58d98c]"
              style={{ backgroundColor: "rgba(88,217,140,0.12)" }}>
              {programs[0].icon} {programs[0].tag}
            </span>
            <h3 className="font-oswald text-2xl uppercase tracking-wide mb-3 theme-text-main">{programs[0].title}</h3>
            <div className="h-0.5 w-14 mb-4 theme-divider" />
            <p className="text-sm leading-relaxed mb-6 theme-text-sub open-sans">{programs[0].desc}</p>
            {/* <button className="self-start rounded-full border border-[#58d98c] px-6 py-2 text-xs tracking-widest uppercase text-[#58d98c] hover:bg-[#58d98c] hover:text-[#13111e] transition-all">
              Learn More
            </button> */}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {programs.slice(1).map((p, i) => (
            <motion.div key={p.title}
              variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={4 + i}
              className="group rounded-2xl overflow-hidden transition-all duration-300 theme-card theme-card-hover">
              <div className="overflow-hidden h-44">
                <img src={p.img} alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#58d98c]">{p.icon} {p.tag}</span>
                <h3 className="font-oswald text-lg uppercase tracking-wide mt-1 mb-2 theme-text-main">{p.title}</h3>
                <div className="h-px w-10 mb-3 theme-divider" />
                <p className="text-xs leading-relaxed mb-4 theme-text-sub open-sans">{p.desc.slice(0, 110)}…</p>
                <button className="text-xs tracking-widest uppercase text-[#58d98c] hover:underline bg-transparent border-none cursor-pointer p-0">Learn More →</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Impact ────────────────────────────────────────────────────────────────────
const objectives = [
  { label: "Amplify Gender Voices",      pct: 90, icon: "📣" },
  { label: "Menstrual Health Awareness", pct: 80, icon: "🌸" },
  { label: "Hygiene Access",             pct: 70, icon: "💧" },
  { label: "Women's Empowerment",        pct: 85, icon: "💪" },
  { label: "Widow & Divorcee Support",   pct: 65, icon: "🤝" },
  { label: "Policy & Advocacy",          pct: 55, icon: "📜" },
  { label: "Legal Awareness",            pct: 75, icon: "⚖️" },
  { label: "Community Engagement",       pct: 88, icon: "🌍" },
];

function Impact() {
  const { ref, inView } = useScrollIn();
  return (
    <section id="impact" className="py-28 relative overflow-hidden theme-section-alt">
      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}
            className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#58d98c]" />
            <span className="text-xs tracking-[0.3em] uppercase text-[#58d98c]">Our Progress</span>
            <div className="h-px w-10 bg-[#58d98c]" />
          </motion.div>
          <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}
            className="font-oswald text-4xl md:text-5xl font-normal uppercase tracking-wide mb-3 theme-text-main">
            Objectives &amp; Impact
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
            className="text-sm max-w-xl mx-auto theme-text-sub open-sans">
            RKGEF adopts a phased implementation approach — addressing each objective with focus and accountability before expanding further.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {objectives.map((r, i) => (
            <motion.div key={r.label}
              variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={3 + i}
              className="rounded-xl p-6 theme-card">
              <div className="text-2xl mb-3">{r.icon}</div>
              <h3 className="font-oswald text-sm uppercase tracking-wide mb-3 theme-text-main">{r.label}</h3>
              <div className="h-2.5 w-full rounded-full mb-2 overflow-hidden theme-bar-track">
                <motion.div className="h-full rounded-full bg-[#58d98c]"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${r.pct}%` } : { width: 0 }}
                  transition={{ duration: 1.1, delay: 0.3 + i * 0.07, ease: "easeOut" }} />
              </div>
              <p className="text-xs tracking-widest uppercase mt-1 theme-text-muted">{r.pct}% target reach</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={12}
          className="mt-14 text-center">
          <button className="rounded-full bg-[#58d98c] px-12 py-4 font-bold tracking-[0.25em] text-sm uppercase text-[#13111e] hover:bg-[#3dbf76] hover:shadow-[0_0_30px_rgba(88,217,140,0.35)] transition-all border-none cursor-pointer">
            Partner With Us
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ── Donate CTA ────────────────────────────────────────────────────────────────
function DonateCTA({ onVolunteer }: { onVolunteer: () => void }) {
  const { ref, inView } = useScrollIn();
  return (
    <section className="py-20 relative overflow-hidden theme-cta-section">
      <div className="absolute inset-0 theme-cta-overlay" />
      <div ref={ref} className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}
          className="text-base leading-relaxed mb-2 max-w-2xl mx-auto theme-cta-text open-sans">
          Every contribution — big or small — multiplies into real change for women and girls across Nigeria.
          Whether you donate, volunteer, or share our story, you are part of the solution.
        </motion.p>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}
          className="h-0.5 w-16 mx-auto my-6 theme-divider" />
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
          className="flex flex-wrap gap-4 justify-center">
          <button className="rounded-full bg-[#58d98c] px-10 py-4 font-bold tracking-[0.25em] text-sm uppercase text-[#13111e] hover:bg-[#3dbf76] transition-colors border-none cursor-pointer">
            Donate Now
          </button>
          <button onClick={onVolunteer}
            className="rounded-full border-2 border-[#58d98c] px-10 py-4 text-sm tracking-[0.2em] uppercase text-[#58d98c] hover:bg-[#58d98c]/15 transition-colors bg-transparent cursor-pointer">
            Be a Volunteer
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const { ref, inView } = useScrollIn();
  return (
    <section id="contact" className="py-28 relative overflow-hidden theme-section-main">
      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-12 items-start">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}>
          <div className="h-px w-12 bg-[#58d98c] mb-4" />
          <h2 className="font-oswald text-5xl uppercase leading-none tracking-wide mb-4">
            <span className="theme-text-main">Stop</span><br />
            <span className="theme-outline-text">Violence!</span>
          </h2>
          <p className="text-sm leading-relaxed theme-text-sub open-sans">
            If you or someone you know is experiencing gender-based violence or abuse, reach out immediately.
            Our support lines are confidential and staffed by trained specialists.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}
          className="rounded-2xl p-8 text-center theme-card">
          <div className="text-4xl mb-4">📞</div>
          <h3 className="font-oswald text-xl uppercase tracking-wide mb-2 theme-text-main">Crisis Helpline</h3>
          <div className="h-px w-10 mx-auto mb-4 theme-divider" />
          <p className="text-sm mb-4 theme-text-sub open-sans">Available 24/7. Confidential. Free.</p>
          <a href="tel:+2349012345678" className="font-oswald text-2xl tracking-wide text-[#58d98c] hover:text-[#3dbf76] transition-colors">
            +234 901 234 5678
          </a>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
          className="rounded-2xl p-8 text-center theme-card">
          <div className="text-4xl mb-4">✉️</div>
          <h3 className="font-oswald text-xl uppercase tracking-wide mb-2 theme-text-main">Reach Out</h3>
          <div className="h-px w-10 mx-auto mb-4 theme-divider" />
          <p className="text-sm mb-4 theme-text-sub open-sans">
            For partnerships, programme inquiries, and media — we respond within 24 hours.
          </p>
          <a href="mailto:info@rkgef.org"
            className="font-oswald text-lg tracking-wide text-[#58d98c] hover:text-[#3dbf76] transition-colors break-all">
            info@rkgef.org
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const { ref, inView } = useScrollIn();
  const footerLinks = [
    { label: "Home",        id: "home"     },
    { label: "About Us",    id: "about"    },
    { label: "Our Programs",id: "programs" },
    { label: "Impact",      id: "impact"   },
    { label: "Contact",     id: "contact"  },
  ];

  return (
    <footer className="pt-16 pb-8 theme-footer">
      <div ref={ref} className="mx-auto max-w-7xl px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}>
          <div className="flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="RKGEF" width={32} height={32} className="rounded-full" />
            <p className="font-oswald text-sm tracking-[0.2em] uppercase text-white">RKGEF</p>
          </div>
          <div className="h-px mb-4 theme-footer-divider" />
          <p className="text-xs leading-relaxed open-sans" style={{ color: "rgba(215,207,255,0.75)" }}>
            Rigar Kariya Gender Empowerment Foundation — registered with the CAC on 14th August 2025
            (Reg. No. 8701675). A non-governmental, non-profit organisation.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}>
          <p className="font-oswald text-base tracking-[0.2em] uppercase mb-3 text-white">Quick Links</p>
          <div className="h-px mb-4 theme-footer-divider" />
          {footerLinks.map(({ label, id }) => (
            <button key={id}
              onClick={() => scrollTo(id)}
              className="block w-full text-left text-xs tracking-widest uppercase py-1.5 hover:text-[#58d98c] transition-colors bg-transparent border-none cursor-pointer"
              style={{ color: "rgba(215,207,255,0.75)" }}>
              {label}
            </button>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}>
          <p className="font-oswald text-base tracking-[0.2em] uppercase mb-3 text-white">Contact</p>
          <div className="h-px mb-4 theme-footer-divider" />
          <p className="text-xs mb-2 open-sans" style={{ color: "rgba(215,207,255,0.75)" }}>info@rkgef.org</p>
          <p className="text-xs mb-5 open-sans" style={{ color: "rgba(215,207,255,0.75)" }}>+234 901 234 5678</p>
          <div className="flex gap-3">
            {[
              { label: "Fb", href: "https://facebook.com" },
              { label: "Tw", href: "https://twitter.com"  },
              { label: "In", href: "https://linkedin.com" },
              { label: "Ig", href: "https://instagram.com"},
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border flex items-center justify-center text-xs font-bold hover:border-[#58d98c] hover:text-[#58d98c] transition-colors"
                style={{ color: "rgba(215,207,255,0.75)", borderColor: "#3d3d69" }}>
                {label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={3}>
          <p className="font-oswald text-base tracking-[0.2em] uppercase mb-3 text-white">Newsletter</p>
          <div className="h-px mb-4 theme-footer-divider" />
          <p className="text-xs mb-4 open-sans" style={{ color: "rgba(215,207,255,0.75)" }}>
            Stay updated on our programmes, events, and impact stories.
          </p>
          <div className="flex flex-col gap-2">
            <input type="email" placeholder="Your email address"
              className="w-full rounded-lg border px-4 py-3 text-xs focus:outline-none focus:border-[#58d98c] transition-colors"
              style={{ backgroundColor: "#13111e", borderColor: "#3d3d69", color: "#ffffff" }} />
            <button className="rounded-full bg-[#58d98c] py-3 text-xs font-bold tracking-[0.25em] uppercase text-[#13111e] hover:bg-[#3dbf76] transition-colors border-none cursor-pointer">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 theme-footer-bottom-border">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[#58d98c] flex items-center justify-center">
            <span style={{ color: "#13111e", fontWeight: 700, fontSize: 8 }}>RK</span>
          </div>
          <span className="font-oswald text-sm tracking-widest uppercase text-white">
            Rigar Kariya Gender Empowerment Foundation
          </span>
        </div>
        <p className="text-xs" style={{ color: "rgba(168,159,212,0.8)" }}>
          © 2025 RKGEF · CAC Reg. No. 8701675 · All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function NGOWebsite() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;600&display=swap');

        :root, .dark {
          --clr-bg:            #13111e;
          --clr-bg-alt:        #201f3d;
          --clr-card:          #201f3d;
          --clr-input:         #13111e;
          --clr-border:        #3d3d69;
          --clr-divider:       rgba(215,207,255,0.30);
          --clr-divider-faint: rgba(255,255,255,0.12);
          --clr-bar-track:     #3d3d69;
          --clr-text-main:     #ffffff;
          --clr-text-sub:      #d7cfff;
          --clr-text-muted:    #a89fd4;
          --clr-heading-acc:   #d7cfff;
          --clr-outline:       #58d98c;
          --clr-cta-text:      #d7cfff;
          --clr-hero-bg:       #13111e;
          --clr-hero-grad:     radial-gradient(ellipse 80% 60% at 70% 40%, rgba(61,61,105,0.55) 0%, transparent 70%),
                               radial-gradient(ellipse 50% 40% at 20% 80%, rgba(88,217,140,0.08) 0%, transparent 60%);
          --clr-hero-line:     linear-gradient(90deg,transparent,rgba(215,207,255,0.07),transparent);
          --clr-glow-1:        rgba(61,61,105,0.30);
          --clr-glow-2:        rgba(88,217,140,0.05);
          --clr-img-overlay:   linear-gradient(to top, rgba(19,17,30,0.5), transparent);
          --clr-bottom-bar:    #ffffff;
          --clr-overlay:       rgba(19,17,30,0.90);
          --clr-nav-bg:        rgba(19,17,30,0.95);
          --clr-mobile-menu:   #201f3d;
          --clr-cta-bg:        #3d3d69;
          --clr-cta-overlay:   rgba(61,61,105,0.82);
          --clr-footer-bg:     #201f3d;
          --clr-footer-brd:    #3d3d69;
          --clr-shadow:        rgba(0,0,0,0.4);
        }

        .light {
          --clr-bg:            #f4f1eb;
          --clr-bg-alt:        #ffffff;
          --clr-card:          #ffffff;
          --clr-input:         #ece8e0;
          --clr-border:        #ddd7f0;
          --clr-divider:       rgba(46,94,63,0.20);
          --clr-divider-faint: rgba(61,61,105,0.10);
          --clr-bar-track:     #ddd7f0;
          --clr-text-main:     #1a1435;
          --clr-text-sub:      #3b2f6e;
          --clr-text-muted:    #7c6fa8;
          --clr-heading-acc:   #2e5c3f;
          --clr-outline:       #2ea86b;
          --clr-cta-text:      #f4f1eb;
          --clr-hero-bg:       #f4f1eb;
          --clr-hero-grad:     radial-gradient(ellipse 80% 60% at 70% 40%, rgba(88,217,140,0.13) 0%, transparent 70%),
                               radial-gradient(ellipse 50% 40% at 20% 80%, rgba(61,61,105,0.07) 0%, transparent 60%);
          --clr-hero-line:     linear-gradient(90deg,transparent,rgba(61,61,105,0.06),transparent);
          --clr-glow-1:        rgba(88,217,140,0.14);
          --clr-glow-2:        rgba(61,61,105,0.05);
          --clr-img-overlay:   linear-gradient(to top, rgba(244,241,235,0.45), transparent);
          --clr-bottom-bar:    #1a1435;
          --clr-overlay:       rgba(26,20,53,0.60);
          --clr-nav-bg:        rgba(244,241,235,0.96);
          --clr-mobile-menu:   #ffffff;
          --clr-cta-bg:        #1a1435;
          --clr-cta-overlay:   rgba(26,20,53,0.93);
          --clr-footer-bg:     #1a1435;
          --clr-footer-brd:    #2e2660;
          --clr-shadow:        rgba(0,0,0,0.10);
        }

        .font-oswald { font-family: 'Oswald', sans-serif; }
        .open-sans   { font-family: 'Open Sans', sans-serif; }
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        html, body { margin: 0; padding: 0; }
        body { background-color: var(--clr-bg); color: var(--clr-text-sub); }

        .theme-text-main      { color: var(--clr-text-main); }
        .theme-text-sub       { color: var(--clr-text-sub); }
        .theme-text-muted     { color: var(--clr-text-muted); }
        .theme-heading-accent { color: var(--clr-heading-acc); }
        .theme-cta-text       { color: var(--clr-cta-text); }
        .text-accent          { color: #58d98c; }

        .theme-outline-text {
          color: transparent;
          -webkit-text-stroke: 2px var(--clr-outline);
        }

        .theme-section-main { background-color: var(--clr-bg); }
        .theme-section-alt  { background-color: var(--clr-bg-alt); }

        .theme-hero { background-color: var(--clr-hero-bg); background-image: var(--clr-hero-grad); }
        .theme-hero-line   { background: var(--clr-hero-line); }
        .theme-glow-1      { background-color: var(--clr-glow-1); }
        .theme-glow-2      { background-color: var(--clr-glow-2); }
        .theme-img-overlay { background: var(--clr-img-overlay); }
        .theme-bottom-bar  { background-color: var(--clr-bottom-bar); }

        .theme-divider       { background-color: var(--clr-divider); }
        .theme-divider-faint { background-color: var(--clr-divider-faint); }

        .theme-card          { background-color: var(--clr-card); border: 1px solid var(--clr-border); }
        .theme-card-hover:hover { border-color: rgba(88,217,140,0.5); }
        .theme-card-border   { border: 1px solid var(--clr-border); }
        .theme-border        { border: 1px solid var(--clr-border); }

        /* Hamburger bar — inherits text color via currentColor */
        .theme-hamburger-bar { background-color: var(--clr-text-main); }

        .theme-nav-scrolled {
          background-color: var(--clr-nav-bg) !important;
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 20px var(--clr-shadow);
        }

        /* Mobile drawer */
        .theme-mobile-menu {
          background-color: var(--clr-mobile-menu);
          border-bottom: 1px solid var(--clr-border);
        }

        .theme-ghost-btn {
          color: var(--clr-text-sub);
          border-color: var(--clr-divider);
        }
        .theme-ghost-btn:hover {
          color: var(--clr-text-main);
          border-color: var(--clr-text-main);
        }

        .theme-overlay   { background-color: var(--clr-overlay); }
        .theme-close-btn { color: var(--clr-text-muted); }
        .theme-close-btn:hover { color: #58d98c; }

        .theme-input {
          background-color: var(--clr-input);
          border: 1px solid var(--clr-border);
          color: var(--clr-text-main);
          width: 100%;
        }
        .theme-input:focus { border-color: #58d98c; outline: none; }
        .theme-input::placeholder { color: var(--clr-text-muted); }

        .theme-bar-track { background-color: var(--clr-bar-track); }

        .theme-cta-section { background-color: var(--clr-cta-bg); }
        .theme-cta-overlay { position: absolute; inset: 0; background-color: var(--clr-cta-overlay); }

        .theme-footer { background-color: var(--clr-footer-bg); border-top: 1px solid var(--clr-footer-brd); }
        .theme-footer-divider { background-color: rgba(255,255,255,0.15); }
        .theme-footer-bottom-border { border-top: 1px solid var(--clr-footer-brd); padding-top: 2rem; }

        .theme-toggle-btn {
          border: 1px solid var(--clr-border);
          background-color: var(--clr-card);
          color: var(--clr-text-main);
        }

        /* Theme transition — exclude transform & opacity so Framer Motion isn't interrupted */
        *, *::before, *::after {
          transition-property: background-color, border-color, color, box-shadow;
          transition-duration: 0.3s;
          transition-timing-function: ease;
        }
      `}</style>

      <AnimatePresence>
        {showModal && <VolunteerModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      <Navbar onVolunteer={() => setShowModal(true)} />
      <Hero onVolunteer={() => setShowModal(true)} />
      <About />
      <Programs />
      <Impact />
      <DonateCTA onVolunteer={() => setShowModal(true)} />
      <Contact />
      <Footer />
    </>
  );
}