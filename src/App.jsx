import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Typing Animation Hook ──────────────────────────────────────────────────
function useTypingEffect(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setDisplay(current.slice(0, charIdx + 1));
          if (charIdx + 1 === current.length) {
            setTimeout(() => setDeleting(true), pause);
          } else {
            setCharIdx((c) => c + 1);
          }
        } else {
          setDisplay(current.slice(0, charIdx - 1));
          if (charIdx - 1 === 0) {
            setDeleting(false);
            setWordIdx((i) => (i + 1) % words.length);
            setCharIdx(0);
          } else {
            setCharIdx((c) => c - 1);
          }
        }
      },
      deleting ? speed / 2 : speed,
    );
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ── Scroll-triggered Section Wrapper ──────────────────────────────────────
function FadeInSection({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Glassmorphism Card ─────────────────────────────────────────────────────
function GlassCard({ children, className = "", hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── Nav ────────────────────────────────────────────────────────────────────
const navLinks = [
  "About",
  "Skills",
  "Projects",
  "Experience",
  "Certifications",
  "Education",
  "Contact",
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a1628]/90 backdrop-blur-xl shadow-2xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="font-bold text-xl bg-gradient-to-r from-sky-400 to-blue-300 bg-clip-text text-transparent cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Pooja Sri ✦
        </motion.span>

        {/* Desktop */}
        <ul className="hidden md:flex gap-7">
          {navLinks.map((link) => (
            <motion.li
              key={link}
              whileHover={{ y: -2 }}
              onClick={() => scrollTo(link)}
              className="text-blue-200 hover:text-sky-300 cursor-pointer text-sm font-medium transition-colors"
            >
              {link}
            </motion.li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-sky-300 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-sky-300 transition-all ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-sky-300 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a1628]/95 backdrop-blur-xl border-t border-white/10"
          >
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="block w-full text-left px-6 py-3 text-blue-200 hover:text-sky-300 hover:bg-white/5 transition-colors text-sm"
              >
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ── Floating Orbs Background ───────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[
        {
          size: 500,
          top: "5%",
          left: "-10%",
          color: "from-blue-600/20 to-sky-400/10",
          dur: 20,
        },
        {
          size: 400,
          top: "50%",
          right: "-10%",
          color: "from-cyan-500/15 to-blue-400/10",
          dur: 25,
        },
        {
          size: 300,
          bottom: "10%",
          left: "30%",
          color: "from-sky-400/20 to-indigo-500/10",
          dur: 18,
        },
      ].map((orb, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.05, 1] }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full bg-gradient-radial ${orb.color} blur-3xl`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            background: `radial-gradient(circle, ${orb.color.includes("blue-600") ? "rgba(37,99,235,0.25)" : orb.color.includes("cyan") ? "rgba(6,182,212,0.18)" : "rgba(14,165,233,0.22)"} 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}

// ── HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  const typed = useTypingEffect([
    "MERN Stack Developer",
    "AI & ML Enthusiast",
    "Full Stack Developer",
    "Problem Solver",
    "B.Tech IT Student",
  ]);

  const socials = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
      href: "https://github.com/poojasri-ghanta",
      label: "GitHub",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      href: "https://www.linkedin.com/in/poojasri-ghanta-956135357/",
      label: "LinkedIn",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      href: "mailto:poojasrighanta955@gmail.com",
      label: "Email",
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        {/* Avatar ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full border border-dashed border-sky-400/40"
        />
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-5xl font-bold text-white shadow-2xl shadow-blue-500/40 border-4 border-white/20">
            P
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#0a1628]"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sky-400 font-semibold tracking-widest text-sm uppercase mb-3"
        >
          ✦ Welcome to my portfolio ✦
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Pooja Sri{" "}
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Ghanta
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-blue-200 mb-8 h-10 flex items-center justify-center gap-2"
        >
          <span className="text-sky-300">{">"}</span>
          <span>{typed}</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-0.5 h-6 bg-sky-400 ml-0.5"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-blue-300/80 max-w-2xl mx-auto mb-10 text-base leading-relaxed"
        >
          B.Tech IT student at Vignan's LARA Institute of Technology & Science,
          building impactful MERN stack applications and exploring the frontiers
          of AI & Machine Learning.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex flex-wrap gap-4 justify-center mb-10"
        >
          <motion.a
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(56,189,248,0.5)",
            }}
            whileTap={{ scale: 0.97 }}
            href="mailto:poojasrighanta955@gmail.com"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-sky-500/30 border border-sky-400/30"
          >
            Hire Me 🚀
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href="https://github.com/poojasri-ghanta"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full border border-sky-400/50 text-sky-300 font-semibold text-sm hover:bg-sky-400/10 transition-colors"
          >
            View GitHub
          </motion.a>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-4 justify-center"
        >
          {socials.map((s) => (
            <motion.a
              key={s.label}
              whileHover={{ y: -4, scale: 1.15 }}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sky-300 hover:text-sky-100 hover:bg-sky-500/20 transition-colors"
              aria-label={s.label}
            >
              {s.icon}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-blue-400/60"
      >
        <span className="text-xs tracking-widest">SCROLL</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.div>
    </section>
  );
}

// ── ABOUT ──────────────────────────────────────────────────────────────────
function About() {
  const info = [
    {
      icon: "🎓",
      label: "College",
      value: "Vignan's LARA Institute of Technology & Science",
    },
    { icon: "📍", label: "Location", value: "Andhra Pradesh, India" },
    { icon: "📞", label: "Phone", value: "9390445867" },
    { icon: "✉️", label: "Email", value: "poojasrighanta955@gmail.com" },
    { icon: "💼", label: "Year", value: "4th Year B.Tech IT" },
    { icon: "🔬", label: "Focus", value: "AI/ML & Full Stack Development" },
  ];

  return (
    <section id="about" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <SectionHeader title="About Me" subtitle="Get to know me better" />
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
          <FadeInSection delay={0.1}>
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-white mb-5">
                Passionate Developer &{" "}
                <span className="text-sky-400">Researcher</span>
              </h3>
              <p className="text-blue-200/80 leading-relaxed text-base">
                I am a B.Tech 3rd year Information Technology student deeply
                passionate about software development, Artificial Intelligence,
                Machine Learning, and Full Stack Development.
              </p>
              <p className="text-blue-200/80 leading-relaxed text-base mt-4">
                I enjoy building MERN stack projects and exploring AI-based
                applications. I am currently working on a research-based
                Text-to-SQL project and continuously improving my programming
                and problem-solving skills.
              </p>
              <div className="mt-6 flex gap-6">
                {[
                  ["15+", "Projects"],
                  ["2+", "Internships"],
                  ["4+", "Certifications"],
                ].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <div className="text-3xl font-black text-sky-400">
                      {num}
                    </div>
                    <div className="text-xs text-blue-300/60 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {info.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-xl border border-white/15 bg-white/8 backdrop-blur-sm p-4"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="text-xs text-sky-400/80 mt-1 font-medium uppercase tracking-wide">
                    {item.label}
                  </div>
                  <div className="text-blue-100 text-sm mt-0.5 font-medium leading-snug">
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

// ── SKILLS ─────────────────────────────────────────────────────────────────
const skillGroups = [
  {
    category: "Languages",
    icon: "⚡",
    color: "from-sky-400 to-blue-500",
    skills: ["Python", "Java", "JavaScript", "SQL"],
  },
  {
    category: "Frontend",
    icon: "🎨",
    color: "from-cyan-400 to-sky-500",
    skills: ["React.js", "HTML", "CSS"],
  },
  {
    category: "Backend",
    icon: "🛠️",
    color: "from-blue-400 to-indigo-500",
    skills: ["Node.js", "Express.js"],
  },
  {
    category: "Database",
    icon: "🗄️",
    color: "from-sky-500 to-cyan-400",
    skills: ["MongoDB"],
  },
  {
    category: "AI / ML",
    icon: "🤖",
    color: "from-indigo-400 to-blue-500",
    skills: [
      "Machine Learning",
      "Artificial Intelligence",
      "NLP",
      "Data Analysis",
    ],
  },
  {
    category: "Frameworks",
    icon: "🔗",
    color: "from-sky-300 to-blue-400",
    skills: ["MERN Stack"],
  },
];

function Skills() {
  return (
    <section id="skills" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <SectionHeader title="Skills" subtitle="Technologies I work with" />
        </FadeInSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {skillGroups.map((group, gi) => (
            <FadeInSection key={group.category} delay={gi * 0.07}>
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center text-lg shadow-lg`}
                  >
                    {group.icon}
                  </div>
                  <h3 className="font-bold text-white text-base">
                    {group.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, si) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: gi * 0.07 + si * 0.05 }}
                      whileHover={{
                        scale: 1.08,
                        backgroundColor: "rgba(56,189,248,0.25)",
                      }}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border border-sky-400/30 bg-sky-500/10 text-sky-300 cursor-default transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </GlassCard>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PROJECTS ───────────────────────────────────────────────────────────────
const projects = [
  {
    title: "Text-to-SQL with Constraint-Guided Join Path Selection",
    subtitle: "Research AI Project",
    description:
      "A research-based AI project focused on improving Text-to-SQL systems for generating accurate complex SQL queries using intelligent join path selection techniques.",
    tech: ["Python", "SQL", "NLP", "Machine Learning"],
    icon: "🧠",
    gradient: "from-sky-500/20 to-blue-600/20",
    badge: "Research",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    github: "https://github.com/poojasri-ghanta",
  },
  {
    title: "MERN Stack Web Application",
    subtitle: "Full Stack Project",
    description:
      "Developed a responsive full-stack web application with frontend, backend, authentication, and database integration using the complete MERN stack.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    icon: "💻",
    gradient: "from-cyan-500/20 to-sky-600/20",
    badge: "Full Stack",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    github: "https://github.com/poojasri-ghanta",
  },
];

function Projects() {
  return (
    <section id="projects" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <SectionHeader title="Projects" subtitle="What I've built" />
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {projects.map((proj, i) => (
            <FadeInSection key={proj.title} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                className={`rounded-2xl border border-white/20 bg-gradient-to-br ${proj.gradient} backdrop-blur-md shadow-xl p-7 flex flex-col h-full`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
                    {proj.icon}
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${proj.badgeColor}`}
                  >
                    {proj.badge}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg leading-snug mb-1">
                  {proj.title}
                </h3>
                <p className="text-sky-400/80 text-xs font-medium mb-3">
                  {proj.subtitle}
                </p>
                <p className="text-blue-200/70 text-sm leading-relaxed flex-1">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-md bg-white/10 text-blue-200 border border-white/15"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  <motion.a
                    whileHover={{ scale: 1.04 }}
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-sky-100 border border-sky-400/30 px-4 py-2 rounded-full hover:bg-sky-500/10 transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    View on GitHub
                  </motion.a>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── EXPERIENCE ─────────────────────────────────────────────────────────────
function Experience() {
  return (
    <section id="experience" className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeInSection>
          <SectionHeader
            title="Internship Experience"
            subtitle="Real-world exposure"
          />
        </FadeInSection>

        <FadeInSection delay={0.15}>
          <GlassCard className="mt-16 p-8" hover={false}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-sky-500/30">
                🤖
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">SmartBridge</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Currently Active
                  </span>
                </div>
                <p className="text-sky-400 font-semibold text-sm mb-1">
                  Artificial Intelligence & Machine Learning — Virtual
                  Internship
                </p>
                <p className="text-blue-300/60 text-xs mb-4">
                  📅 May 25, 2026 – July 8, 2026
                </p>
                <p className="text-blue-200/80 text-sm leading-relaxed">
                  Currently pursuing a Short-Term Virtual Internship Program in
                  Artificial Intelligence and Machine Learning, gaining
                  practical exposure to AI concepts, Machine Learning
                  fundamentals, Python, Data Analysis, and real-world AI
                  applications.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {[
                    "Python",
                    "Machine Learning",
                    "AI Concepts",
                    "Data Analysis",
                    "Real-world Applications",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </FadeInSection>
      </div>
    </section>
  );
}

// ── CERTIFICATIONS ─────────────────────────────────────────────────────────
const certs = [
  {
    title: "The Joy of Computing Using Python",
    issuer: "NPTEL",
    icon: "🐍",
    color: "from-yellow-400/20 to-orange-500/20",
    border: "border-yellow-400/20",
  },
  {
    title: "Cybersecurity Analyst Virtual Internship",
    issuer: "TATA / Forage",
    icon: "🔐",
    color: "from-red-400/20 to-pink-500/20",
    border: "border-red-400/20",
  },
  {
    title: "Data Analytics Virtual Experience",
    issuer: "Various Platforms",
    icon: "📊",
    color: "from-green-400/20 to-emerald-500/20",
    border: "border-green-400/20",
  },
  {
    title: "AI & ML Virtual Internship",
    issuer: "SmartBridge",
    icon: "🤖",
    color: "from-sky-400/20 to-blue-500/20",
    border: "border-sky-400/20",
  },
];

function Certifications() {
  return (
    <section id="certifications" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <SectionHeader
            title="Certifications"
            subtitle="Credentials & achievements"
          />
        </FadeInSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {certs.map((cert, i) => (
            <FadeInSection key={cert.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className={`rounded-2xl border ${cert.border} bg-gradient-to-br ${cert.color} backdrop-blur-sm p-6 text-center h-full flex flex-col items-center`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl mb-4 shadow-inner">
                  {cert.icon}
                </div>
                <p className="text-xs text-sky-400/80 font-semibold uppercase tracking-widest mb-2">
                  {cert.issuer}
                </p>
                <h3 className="text-white font-semibold text-sm leading-snug">
                  {cert.title}
                </h3>
                <div className="mt-auto pt-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/15">
                    ✓ Certified
                  </span>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── EDUCATION ──────────────────────────────────────────────────────────────
function Education() {
  return (
    <section id="education" className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeInSection>
          <SectionHeader title="Education" subtitle="Academic background" />
        </FadeInSection>

        <FadeInSection delay={0.15}>
          <div className="mt-16 relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-400 via-blue-500 to-transparent hidden sm:block" />
            <div className="sm:pl-20 relative">
              <div className="absolute left-3.5 top-3 w-5 h-5 rounded-full bg-sky-400 border-4 border-[#0a1628] shadow-lg shadow-sky-400/50 hidden sm:block" />
              <GlassCard className="p-8" hover={false}>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-2xl shadow-lg">
                    🎓
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      B.Tech — Information Technology
                    </h3>
                    <p className="text-sky-400 font-semibold text-sm mb-1">
                      Vignan's LARA Institute of Technology & Science
                    </p>
                    <p className="text-blue-300/60 text-xs mb-3">
                      📍 Andhra Pradesh, India • 4th Year (2023–2027)
                    </p>
                    <p className="text-blue-200/70 text-sm leading-relaxed">
                      Pursuing B.Tech in Information Technology with focus on
                      software engineering, artificial intelligence, machine
                      learning, and full-stack web development.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {[
                        "Data Structures",
                        "Algorithms",
                        "DBMS",
                        "AI/ML",
                        "Web Technologies",
                        "Operating Systems",
                      ].map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ── CONTACT ────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.open(
      `mailto:poojasrighanta955@gmail.com?subject=${subject}&body=${body}`,
    );
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <SectionHeader title="Get In Touch" subtitle="Let's connect" />
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-10 mt-16">
          {/* Info */}
          <FadeInSection delay={0.1}>
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Let's Build Together! 🚀
                </h3>
                <p className="text-blue-200/80 text-sm leading-relaxed">
                  I'm always open to discussing new opportunities, interesting
                  projects, collaborations, or just a friendly hello. Feel free
                  to reach out!
                </p>
              </GlassCard>
              {[
                {
                  icon: "✉️",
                  label: "Email",
                  value: "poojasrighanta955@gmail.com",
                  href: "mailto:poojasrighanta955@gmail.com",
                },
                {
                  icon: "📞",
                  label: "Phone",
                  value: "+91 9390445867",
                  href: "tel:9390445867",
                },
                {
                  icon: "🔗",
                  label: "LinkedIn",
                  value: "poojasri-ghanta",
                  href: "https://www.linkedin.com/in/poojasri-ghanta-956135357/",
                },
                {
                  icon: "🐙",
                  label: "GitHub",
                  value: "poojasri-ghanta",
                  href: "https://github.com/poojasri-ghanta",
                },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  whileHover={{ x: 6 }}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/15 bg-white/5 hover:bg-sky-500/10 transition-colors group"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-xs text-sky-400/80 font-medium">
                      {item.label}
                    </div>
                    <div className="text-blue-100 text-sm font-medium group-hover:text-sky-300 transition-colors">
                      {item.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </FadeInSection>

          {/* Form */}
          <FadeInSection delay={0.2}>
            <GlassCard className="p-8" hover={false}>
              <div className="space-y-4">
                {["name", "email"].map((field) => (
                  <div key={field}>
                    <label className="block text-xs text-sky-400/80 font-semibold uppercase tracking-wide mb-1.5">
                      {field === "name" ? "Your Name" : "Email Address"}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={form[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      placeholder={
                        field === "name" ? "John Doe" : "john@example.com"
                      }
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-blue-400/40 focus:outline-none focus:border-sky-400/60 focus:bg-sky-500/5 transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-sky-400/80 font-semibold uppercase tracking-wide mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Hello Pooja, I'd love to connect..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-blue-400/40 focus:outline-none focus:border-sky-400/60 focus:bg-sky-500/5 transition-all resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 25px rgba(56,189,248,0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 border border-sky-400/30 transition-all"
                >
                  {sent ? "✓ Message Sent!" : "Send Message →"}
                </motion.button>
              </div>
            </GlassCard>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-10 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sky-400 font-bold text-xl mb-2"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Pooja Sri Ghanta ✦
        </motion.p>
        <p className="text-blue-300/50 text-sm mb-6">
          B.Tech IT Student · MERN Stack Developer · AI & ML Enthusiast
        </p>
        <div className="flex justify-center gap-6 mb-6">
          {[
            { href: "https://github.com/poojasri-ghanta", label: "GitHub" },
            {
              href: "https://www.linkedin.com/in/poojasri-ghanta-956135357/",
              label: "LinkedIn",
            },
            { href: "mailto:poojasrighanta955@gmail.com", label: "Email" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400/60 hover:text-sky-400 text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-blue-400/40 text-xs">
          © {new Date().getFullYear()} Pooja Sri Ghanta. Crafted with ❤️ using
          React · Tailwind · Framer Motion
        </p>
      </div>
    </footer>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center">
      <p className="text-sky-400/80 text-xs font-semibold uppercase tracking-widest mb-3">
        {subtitle}
      </p>
      <h2
        className="text-4xl md:text-5xl font-black text-white"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {title.split(" ").map((word, i) =>
          i === title.split(" ").length - 1 ? (
            <span
              key={i}
              className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent"
            >
              {word}{" "}
            </span>
          ) : (
            <span key={i}>{word} </span>
          ),
        )}
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mx-auto mt-4" />
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden"
      style={{
        background:
          "linear-gradient(135deg, #020d1f 0%, #061529 30%, #04111f 60%, #030b1a 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #020d1f; }
        ::-webkit-scrollbar-thumb { background: #38bdf8; border-radius: 4px; }
      `}</style>

      <FloatingOrbs />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
