"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, cubicBezier } from "framer-motion";
import Image from "next/image";

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-[#13111e]/92 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <motion.div
          className="relative z-10 w-full max-w-lg rounded-2xl border border-[#3d3d69] bg-[#201f3d] p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.92, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-xl leading-none text-[#a89fd4] hover:text-[#58d98c] transition-colors"
          >
            ✕
          </button>

          {submitted ? (
            <motion.div
              className="flex flex-col items-center gap-4 py-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-5xl">🌿</div>
              <h3 className="font-oswald text-2xl tracking-widest text-[#58d98c] uppercase">
                Thank You!
              </h3>
              <p className="text-[#d7cfff] text-sm leading-relaxed">
                We've received your application. Our team will reach out within 48 hours.
              </p>
              <button
                onClick={onClose}
                className="mt-4 rounded-full bg-[#58d98c] px-8 py-2 text-sm font-bold tracking-widest text-[#13111e] uppercase hover:bg-[#3dbf76] transition-colors"
              >
                Close
              </button>
            </motion.div>
          ) : (
            <>
              <h2 className="font-oswald text-2xl tracking-[0.2em] text-white uppercase mb-1">
                Be a Volunteer
              </h2>
              <div className="mb-5 h-0.5 w-16 bg-[#58d98c]" />
              <p className="text-[#d7cfff] text-sm mb-6 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                Join thousands of changemakers around the world. Fill out the form and we'll contact you about volunteer opportunities.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "your@email.com" },
                  { label: "Country", key: "country", type: "text", placeholder: "Where are you based?" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs tracking-widest text-[#a89fd4] uppercase mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full rounded-lg bg-[#13111e] border border-[#3d3d69] px-4 py-3 text-sm text-white focus:border-[#58d98c] focus:outline-none transition-colors"
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs tracking-widest text-[#a89fd4] uppercase mb-1">
                    Why do you want to volunteer?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your motivation..."
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full rounded-lg bg-[#13111e] border border-[#3d3d69] px-4 py-3 text-sm text-white focus:border-[#58d98c] focus:outline-none transition-colors resize-none"
                    style={{ color: "#ffffff" }}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 rounded-full bg-[#58d98c] py-3 font-bold tracking-[0.25em] text-sm text-[#13111e] uppercase hover:bg-[#3dbf76] active:scale-95 transition-all"
                >
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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["About", "Programs", "Impact", "Contact"];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-[#13111e]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full ">
            <Image src="/logo.png" alt="Rigar KariyaLogo" width={46} height={46} />
          </div>
          <div>
            <span className="font-oswald text-lg tracking-[0.15em] uppercase" style={{ color: "#ffffff" }}>
              Rigar Kariya
            </span>
            <span className="block text-[9px] tracking-[0.3em] uppercase leading-none" style={{ color: "#a89fd4" }}>
              Foundation
            </span>
          </div>
        </div>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className="text-xs tracking-[0.2em] uppercase hover:text-[#58d98c] transition-colors"
                style={{ color: "#d7cfff" }}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onVolunteer}
            className="rounded-full border border-[#58d98c] px-5 py-2 text-xs tracking-widest uppercase hover:bg-[#58d98c] hover:text-[#13111e] transition-all duration-300"
            style={{ color: "#58d98c" }}
          >
            Volunteer
          </button>
          <button
            className="rounded-full bg-[#58d98c] px-5 py-2 text-xs tracking-widest font-bold uppercase hover:bg-[#3dbf76] transition-colors"
            style={{ color: "#13111e" }}
          >
            Donate
          </button>
        </div>

        <button className="md:hidden" style={{ color: "#ffffff" }} onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-[#201f3d] border-t border-[#3d3d69] px-6 py-6"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="block py-3 text-sm tracking-widest uppercase hover:text-[#58d98c]"
                style={{ color: "#d7cfff" }}
                onClick={() => setMenuOpen(false)}
              >
                {l}
              </a>
            ))}
            <button
              onClick={() => { onVolunteer(); setMenuOpen(false); }}
              className="mt-4 w-full rounded-full bg-[#58d98c] py-3 text-sm font-bold tracking-widest uppercase"
              style={{ color: "#13111e" }}
            >
              Be a Volunteer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ onVolunteer }: { onVolunteer: () => void }) {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{
        backgroundColor: "#13111e",
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(61,61,105,0.55) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(88,217,140,0.08) 0%, transparent 60%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px"
            style={{
              top: `${15 + i * 14}%`, left: 0, right: 0,
              background: "linear-gradient(90deg, transparent, rgba(215,207,255,0.07), transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.3 + i * 0.08 }}
          />
        ))}
        <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-[#3d3d69]/30 blur-[120px]" />
        <div className="absolute left-1/4 bottom-0 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-[#58d98c]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-30 md:py-30 lg:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="mb-6 inline-flex items-center gap-3">
            <div className="h-px w-12 bg-[#58d98c]" />
            <span className="text-xs tracking-[0.35em] uppercase" style={{ color: "#58d98c" }}>
              Empowering Communities Worldwide
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="font-oswald text-5xl md:text-7xl font-normal leading-none tracking-tight uppercase mb-4"
          >
            <span style={{ color: "#ffffff" }}>RIGAR KARIYA</span>
            <br />
            <span style={{ color: "#d7cfff" }}>GENDER</span>
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: "2px #58d98c" }}>EMPOWERMENT PROGRAM</span>
          </motion.h1>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="my-6 h-px w-24" style={{ background: "rgba(255,255,255,0.2)" }} />

          <motion.p
  variants={fadeUp} initial="hidden" animate="show" custom={3}
  className="text-base leading-relaxed max-w-md"
  style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}
>
  Rigar Kariya Gender Empowerment Foundation (RKGEF) is a registered non-governmental,
  non-profit organization breaking the silence on gender violence, advancing menstrual
  health, and empowering women through education, legal awareness, and economic support —
  one community at a time.
</motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={onVolunteer}
              className="group relative overflow-hidden rounded-full bg-[#58d98c] px-8 py-4 text-sm font-bold tracking-[0.25em] uppercase transition-all hover:shadow-[0_0_30px_rgba(88,217,140,0.4)]"
              style={{ color: "#13111e" }}
            >
              <span className="relative z-10">Join Our Mission</span>
            </button>
            <a
              href="#programs"
              className="rounded-full border px-8 py-4 text-sm tracking-[0.2em] uppercase hover:border-white hover:text-white transition-colors"
              style={{ color: "#d7cfff", borderColor: "rgba(215,207,255,0.4)" }}
            >
              Our Programs
            </a>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="mt-14 flex gap-10">
            {[
              { val: "4+", label: "Countries" },
              { val: "5000+", label: "Lives Impacted" },
              { val: "200+", label: "Volunteers" },
            ].map(({ val, label }) => (
              <div key={label}>
                <div className="font-oswald text-3xl tracking-tight" style={{ color: "#58d98c" }}>{val}</div>
                <div className="text-xs tracking-widest uppercase mt-0.5" style={{ color: "#a89fd4" }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="relative "
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6381/Woman_Landing.png"
              alt="Rigar Kariyavolunteer"
              className="w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(19,17,30,0.5), transparent)" }} />
          </div>
          <motion.div
            className="absolute -bottom-6 -left-6 rounded-xl border p-4 shadow-xl"
            style={{ backgroundColor: "#201f3d", borderColor: "#3d3d69" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: "rgba(88,217,140,0.15)", color: "#58d98c" }}>🌍</div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "#ffffff" }}>Global Reach</div>
                <div className="text-xs" style={{ color: "#a89fd4" }}>Active in 4+ nations</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" />
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const { ref, inView } = useScrollIn();
  return (
    <section id="about" className="py-24 relative overflow-hidden" style={{ backgroundColor: "#201f3d" }}>
      <div className="pointer-events-none absolute inset-0 opacity-10"
        style={{ backgroundImage: "url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6381/Fondo_Donate_01.png')", backgroundSize: "cover" }} />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}>
          <div className="overflow-hidden rounded-2xl border border-[#3d3d69]">
            <img
              src="/women.jpg"
              alt="Our team"
              className="w-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>

        <div>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}
            className="mb-4 inline-flex items-center gap-3">
            <div className="h-px w-10 bg-[#58d98c]" />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#58d98c" }}>Who We Are</span>
          </motion.div>

          <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
            className="font-oswald text-3xl md:text-3xl font-normal uppercase leading-tight mb-4 tracking-wide">
            <span style={{ color: "#ffffff" }}>Our Goals,</span><br />
          </motion.h2>

        
          <motion.p variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={4}
            className="leading-relaxed mb-5 text-sm"
            style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
           To promote dignity, wellbeing, and empowerment among vulnerable populations through focused and sustainable social interventions.
            </motion.p>

<motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
            className="font-oswald text-3xl md:text-3xl font-normal uppercase leading-tight mb-4 tracking-wide">
            <span style={{ color: "#d7cfff" }}>Our Mission</span>
          </motion.h2>

          <motion.p variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={5}
            className="leading-relaxed mb-8 text-sm"
            style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
           To promote social wellbeing through phased, community-driven interventions that address critical issues affecting women, girls, and vulnerable populations, beginning with priority needs and gradually expanding to achieve lasting impact.
            </motion.p>

         <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
            className="font-oswald text-3xl md:text-3xl font-normal uppercase leading-tight mb-4 tracking-wide">
            <span style={{ color: "#d7cfff" }}>Our Vision</span>
          </motion.h2>

          <motion.p variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={5}
            className="leading-relaxed mb-8 text-sm"
            style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
           society where vulnerable individuals and communities live with dignity, good health, equal opportunities, and sustainable support systems.
             </motion.p>

        </div>
      </div>
    </section>
  );
}

// ── Programs ──────────────────────────────────────────────────────────────────
const programs = [
  {
    img: "https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6381/programs_02.jpg",
    title: "Gender Violence",
    desc: "We operate crisis centers, legal aid clinics, and awareness campaigns to protect survivors and hold perpetrators accountable across our network.",
    tag: "Protection",
  },
  {
    img: "https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6381/programs_01.jpg",
    title: "Education Programs",
    desc: "From early childhood literacy to vocational training for adults — our education initiatives break the cycle of poverty for over 300,000 learners annually.",
    tag: "Education",
  },
  {
    img: "https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6381/programs_05.jpg",
    title: "Maternal Support",
    desc: "Prenatal care, safe delivery support, and postnatal mental health resources for mothers in underserved regions where maternal mortality remains high.",
    tag: "Health",
  },
  {
    img: "https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6381/programs_03.jpg",
    title: "Labor Insertion",
    desc: "Job placement, microfinance, and entrepreneurship training enabling economic independence — particularly for women reentering the workforce.",
    tag: "Economic",
  },
  {
    img: "https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6381/programs_04l.jpg",
    title: "International Solidarity",
    desc: "Cross-border humanitarian response teams and NGO partnerships that mobilize resources rapidly when crises strike vulnerable populations.",
    tag: "Global",
  },
];

function Programs() {
  const { ref, inView } = useScrollIn();
  return (
    <section id="programs" className="py-28" style={{ backgroundColor: "#13111e" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div ref={ref} className="text-center mb-16">
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}
            className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#58d98c]" />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#58d98c" }}>What We Do</span>
            <div className="h-px w-10 bg-[#58d98c]" />
          </motion.div>
          <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}
            className="font-oswald text-4xl md:text-5xl font-normal uppercase tracking-wide">
            <span style={{ color: "#ffffff" }}>Our Programs,</span><br />
            <span style={{ color: "#d7cfff" }}>Our Volunteers</span>
          </motion.h2>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
            className="mx-auto mt-4 h-1 w-24" style={{ backgroundColor: "rgba(215,207,255,0.35)" }} />
        </div>

        {/* Featured card */}
        <motion.div
          variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={3}
          className="grid md:grid-cols-5 rounded-2xl overflow-hidden border border-[#3d3d69] mb-6"
        >
          <div className="md:col-span-3 overflow-hidden">
            <img src={programs[0].img} alt={programs[0].title}
              className="w-full h-72 md:h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="md:col-span-2 p-10 flex flex-col justify-center" style={{ backgroundColor: "#201f3d" }}>
            <span className="text-[10px] tracking-[0.35em] uppercase rounded-full w-fit mb-4 px-3 py-1"
              style={{ color: "#58d98c", backgroundColor: "rgba(88,217,140,0.12)" }}>
              {programs[0].tag}
            </span>
            <h3 className="font-oswald text-3xl uppercase tracking-wide mb-3" style={{ color: "#ffffff" }}>
              {programs[0].title}
            </h3>
            <div className="h-0.5 w-14 mb-4" style={{ backgroundColor: "rgba(215,207,255,0.35)" }} />
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
              {programs[0].desc}
            </p>
            <button
              className="self-start rounded-full border px-6 py-2 text-xs tracking-widest uppercase hover:bg-[#58d98c] hover:text-[#13111e] transition-all"
              style={{ color: "#58d98c", borderColor: "#58d98c" }}>
              More Information
            </button>
          </div>
        </motion.div>

        {/* 4-card grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {programs.slice(1).map((p, i) => (
            <motion.div
              key={p.title}
              variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={4 + i}
              className="group rounded-2xl overflow-hidden border hover:border-[#58d98c]/60 transition-colors duration-300"
              style={{ borderColor: "#3d3d69", backgroundColor: "#201f3d" }}
            >
              <div className="overflow-hidden h-44">
                <img src={p.img} alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "#58d98c" }}>{p.tag}</span>
                <h3 className="font-oswald text-xl uppercase tracking-wide mt-1 mb-2" style={{ color: "#ffffff" }}>{p.title}</h3>
                <div className="h-px w-10 mb-3" style={{ backgroundColor: "rgba(215,207,255,0.35)" }} />
                <p className="text-xs leading-relaxed mb-4" style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
                  {p.desc.slice(0, 105)}…
                </p>
                <button className="text-xs tracking-widest uppercase hover:underline" style={{ color: "#58d98c" }}>
                  More Information →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Impact ────────────────────────────────────────────────────────────────────
const regions = [
  { country: "United States", count: "124,325", pct: 100 },
  { country: "Canada", count: "89,005", pct: 72 },
  { country: "Germany", count: "62,457", pct: 50 },
  { country: "Italy", count: "41,289", pct: 33 },
  { country: "Japan", count: "45,125", pct: 36 },
  { country: "United Kingdom", count: "32,140", pct: 26 },
  { country: "France", count: "22,648", pct: 18 },
  { country: "Spain", count: "25,370", pct: 20 },
];

function Impact() {
  const { ref, inView } = useScrollIn();
  return (
    <section
      id="impact"
      className="py-28 relative overflow-hidden"
      style={{
        backgroundColor: "#201f3d",
        backgroundImage: "url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6381/Fondo_hornamento_map2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(32,31,61,0.85)" }} />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}
            className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#58d98c]" />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#58d98c" }}>Our Reach</span>
            <div className="h-px w-10 bg-[#58d98c]" />
          </motion.div>
          <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}
            className="font-oswald text-4xl md:text-5xl font-normal uppercase tracking-wide mb-3"
            style={{ color: "#ffffff" }}>
            We in the World
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
            className="text-sm max-w-xl mx-auto"
            style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
            Our volunteers span six continents, working on the ground in communities that need support the most.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {regions.map((r, i) => (
            <motion.div key={r.country}
              variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={3 + i}
              className="rounded-xl p-6 border"
              style={{ backgroundColor: "rgba(19,17,30,0.75)", borderColor: "#3d3d69" }}
            >
              <h3 className="font-oswald text-base uppercase tracking-wide mb-2" style={{ color: "#ffffff" }}>
                {r.country}
              </h3>
              <div className="h-3 w-full rounded-full mb-3 overflow-hidden" style={{ backgroundColor: "#3d3d69" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: "#d7cfff" }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${r.pct}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.07, ease: "easeOut" }}
                />
              </div>
              <p className="font-oswald text-2xl tracking-wide" style={{ color: "#ffffff" }}>{r.count}</p>
              <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#58d98c" }}>volunteers</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={12}
          className="mt-14 text-center">
          <button
            className="rounded-full bg-[#58d98c] px-12 py-4 font-bold tracking-[0.25em] text-sm uppercase hover:bg-[#3dbf76] hover:shadow-[0_0_30px_rgba(88,217,140,0.35)] transition-all"
            style={{ color: "#13111e" }}>
            Join Us
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
    <section
      className="py-20 relative overflow-hidden"
      style={{
        backgroundColor: "#3d3d69",
        backgroundImage: "url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6381/Fondo_Donate_02.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(61,61,105,0.80)" }} />
      <div ref={ref} className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.p
          variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}
          className="text-base leading-relaxed mb-5 max-w-2xl mx-auto"
          style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
          Every contribution — big or small — multiplies into real change. Whether you donate, volunteer, or spread the word, you are part of the solution.
        </motion.p>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}
          className="h-0.5 w-16 mx-auto mb-6" style={{ backgroundColor: "rgba(215,207,255,0.4)" }} />
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
          className="flex flex-wrap gap-4 justify-center">
          <button
            className="rounded-full bg-[#58d98c] px-10 py-4 font-bold tracking-[0.25em] text-sm uppercase hover:bg-[#3dbf76] transition-colors"
            style={{ color: "#13111e" }}>
            Donate Now
          </button>
          <button
            onClick={onVolunteer}
            className="rounded-full border-2 border-[#58d98c] px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#58d98c]/15 transition-colors"
            style={{ color: "#58d98c" }}>
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
    <section
      id="contact"
      className="py-28 relative overflow-hidden"
      style={{
        backgroundColor: "#13111e",
        backgroundImage: "url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/6381/Fondo_mujer_landing.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(19,17,30,0.88)" }} />
      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-12 items-start">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}>
          <div className="h-px w-12 bg-[#58d98c] mb-4" />
          <h2 className="font-oswald text-5xl uppercase leading-none tracking-wide mb-4">
            <span style={{ color: "#ffffff" }}>Stop</span><br />
            <span style={{ color: "transparent", WebkitTextStroke: "2px #58d98c" }}>Violence!</span>
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
            If you or someone you know is in danger, reach out immediately. Our crisis lines are available 24/7, staffed by trained specialists.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}
          className="rounded-2xl border p-8 text-center"
          style={{ backgroundColor: "#201f3d", borderColor: "#3d3d69" }}>
          <div className="text-4xl mb-4">📞</div>
          <h3 className="font-oswald text-xl uppercase tracking-wide mb-2" style={{ color: "#ffffff" }}>Emergency Helpline</h3>
          <div className="h-px w-10 mx-auto mb-4" style={{ backgroundColor: "rgba(215,207,255,0.35)" }} />
          <p className="text-sm mb-4" style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
            Available 24 hours a day, 7 days a week. Confidential. Free.
          </p>
          <a href="tel:99888888" className="font-oswald text-2xl tracking-wide hover:text-[#3dbf76] transition-colors"
            style={{ color: "#58d98c" }}>
            99 888 888
          </a>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}
          className="rounded-2xl border p-8 text-center"
          style={{ backgroundColor: "#201f3d", borderColor: "#3d3d69" }}>
          <div className="text-4xl mb-4">✉️</div>
          <h3 className="font-oswald text-xl uppercase tracking-wide mb-2" style={{ color: "#ffffff" }}>Send Us a Message</h3>
          <div className="h-px w-10 mx-auto mb-4" style={{ backgroundColor: "rgba(215,207,255,0.35)" }} />
          <p className="text-sm mb-4" style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
            For partnerships, media inquiries, and general questions — we respond within 24 hours.
          </p>
          <a href="mailto:info@hopeedge.org"
            className="font-oswald text-lg tracking-wide hover:text-[#3dbf76] transition-colors break-all"
            style={{ color: "#58d98c" }}>
            info@hopeedge.org
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const { ref, inView } = useScrollIn();
  return (
    <footer className="pt-16 pb-8 border-t" style={{ backgroundColor: "#201f3d", borderColor: "#3d3d69" }}>
      <div ref={ref} className="mx-auto max-w-7xl px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={0}>
          <p className="font-oswald text-base tracking-[0.2em] uppercase mb-3" style={{ color: "#ffffff" }}>About Us</p>
          <div className="h-px mb-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          <p className="text-xs leading-relaxed" style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
            Rigar Kariya Foundation is a global NGO committed to empowering communities through education, healthcare, and social justice programs.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={1}>
          <p className="font-oswald text-base tracking-[0.2em] uppercase mb-3" style={{ color: "#ffffff" }}>Links</p>
          <div className="h-px mb-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          {["Home", "Be a Volunteer", "Who We Are", "Our Programs", "Global Impact", "Stop Violence"].map((l) => (
            <a key={l} href="#"
              className="block text-xs tracking-widest uppercase py-1.5 hover:text-[#58d98c] transition-colors"
              style={{ color: "#d7cfff" }}>
              {l}
            </a>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={2}>
          <p className="font-oswald text-base tracking-[0.2em] uppercase mb-3" style={{ color: "#ffffff" }}>Here We Are</p>
          <div className="h-px mb-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          <p className="text-xs mb-2" style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>info@hopeedge.org</p>
          <p className="text-xs mb-5" style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>+1 900 500 400</p>
          <div className="flex gap-3">
            {[
              { label: "Fb", href: "https://facebook.com" },
              { label: "Tw", href: "https://twitter.com" },
              { label: "In", href: "https://linkedin.com" },
              { label: "Ig", href: "https://instagram.com" },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border flex items-center justify-center text-xs font-bold hover:border-[#58d98c] hover:text-[#58d98c] transition-colors"
                style={{ color: "#d7cfff", borderColor: "#5a5285" }}>
                {label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} custom={3}>
          <p className="font-oswald text-base tracking-[0.2em] uppercase mb-3" style={{ color: "#ffffff" }}>Newsletter</p>
          <div className="h-px mb-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          <p className="text-xs mb-4" style={{ color: "#d7cfff", fontFamily: "'Open Sans', sans-serif" }}>
            Stay updated with our latest programs and impact stories.
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="rounded-lg border px-4 py-3 text-xs focus:outline-none transition-colors"
              style={{
                backgroundColor: "#13111e",
                borderColor: "#3d3d69",
                color: "#ffffff",
              }}
            />
            <button
              className="rounded-full bg-[#58d98c] py-3 text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#3dbf76] transition-colors"
              style={{ color: "#13111e" }}>
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderColor: "rgba(61,61,105,0.5)" }}>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[#58d98c] flex items-center justify-center">
            <span style={{ color: "#13111e", fontWeight: 700, fontSize: 8 }}>HE</span>
          </div>
          <span className="font-oswald text-sm tracking-widest uppercase" style={{ color: "#ffffff" }}>
            Rigar Kariya Foundation
          </span>
        </div>
        <p className="text-xs" style={{ color: "#a89fd4" }}>© 2025 Rigar Kariya Foundation. All rights reserved.</p>
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
        .font-oswald { font-family: 'Oswald', sans-serif; }
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        html, body { margin: 0; padding: 0; background-color: #13111e; color: #d7cfff; }
        h1, h2, h3, h4, h5, h6, p, span, a, li, label, input, textarea, button {
          font-family: inherit;
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