import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Sparkles, Wallet, Users, Trophy, Store, ShieldCheck, Star,
} from "lucide-react";

const floatingCards = [
  { icon: Wallet, label: "Mobi Wallet", sub: "₦150,000.00", cls: "top-[12%] -left-2 sm:left-2 lp-animate-float", accent: "from-emerald-400/30 to-emerald-600/10" },
  { icon: Trophy, label: "Quiz Winner", sub: "+₦5,000 reward", cls: "top-[6%] right-0 sm:right-4 lp-animate-float-slow", accent: "from-amber-400/30 to-amber-600/10" },
  { icon: Store, label: "Bulk Merchant", sub: "10% discount", cls: "bottom-[14%] -left-1 sm:left-6 lp-animate-float-slow", accent: "from-sky-400/30 to-sky-600/10" },
  { icon: Users, label: "Community", sub: "Live election", cls: "bottom-[8%] right-0 sm:right-2 lp-animate-float", accent: "from-fuchsia-400/30 to-fuchsia-600/10" },
];

export const LandingHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scaleOrb = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden lp-hero-bg pt-28 pb-16">
      {/* Aurora orbs */}
      <motion.div style={{ scale: scaleOrb }} className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[hsl(var(--lp-violet))] opacity-30 blur-[120px] lp-animate-float" />
        <div className="absolute top-10 right-0 h-[26rem] w-[26rem] rounded-full bg-[hsl(var(--lp-cyan))] opacity-20 blur-[120px] lp-animate-float-slow" />
        <div className="absolute bottom-0 left-0 h-[24rem] w-[24rem] rounded-full bg-[hsl(var(--lp-pink))] opacity-20 blur-[120px] lp-animate-float" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 lp-grid-overlay" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Copy */}
        <motion.div style={{ y: yText, opacity }} className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full lp-glass px-4 py-1.5 text-sm font-medium text-white/90 lg:mx-0"
          >
            <Sparkles className="h-4 w-4 text-[hsl(var(--lp-amber))]" />
            One platform · endless possibilities
          </motion.div>

          <h1 className="text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="block"
            >
              Welcome to the
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="block lp-text-gradient lp-animate-pan"
              style={{ backgroundImage: "var(--gradient-text)" }}
            >
              Mobigate world
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="block"
            >
              of opportunity.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70 lg:mx-0"
          >
            Wallets, communities, merchants, vouchers, quizzes and rewards —
            woven into one premium social commerce experience. Make your choice.
            We're ready to take you there.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.54 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link
              to="/dashboard"
              className="lp-pulse-ring group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-bold text-[hsl(var(--lp-ink))] shadow-2xl transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
            >
              Enter Mobigate
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#ecosystem"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl lp-glass px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Explore ecosystem
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 flex items-center justify-center gap-4 text-sm text-white/60 lg:justify-start"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Bank-grade security
            </span>
            <span className="inline-flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[hsl(var(--lp-amber))] text-[hsl(var(--lp-amber))]" />
              ))}
              <span className="ml-1">Trusted daily</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Visual cluster */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          {/* Central glowing emblem */}
          <div className="absolute inset-[18%] rounded-[2rem] lp-aurora-bg lp-animate-pan opacity-90 blur-[2px]" />
          <div className="absolute inset-[18%] flex items-center justify-center rounded-[2rem] lp-glass shadow-[var(--glow-violet)]">
            <span className="text-6xl font-black text-white drop-shadow-lg sm:text-7xl">M</span>
          </div>
          <div className="lp-animate-spin-slow absolute inset-[6%] rounded-full border border-dashed border-white/15" />

          {floatingCards.map((c) => (
            <div
              key={c.label}
              className={`absolute ${c.cls} w-[44%] max-w-[170px] rounded-2xl lp-glass p-3 shadow-xl`}
            >
              <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent}`}>
                <c.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-white">{c.label}</p>
              <p className="text-xs text-white/65">{c.sub}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
