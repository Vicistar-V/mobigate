import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Sparkles, Wallet, Trophy, Store, Users, ShieldCheck, Star,
} from "lucide-react";

const floatingCards = [
  { icon: Wallet, label: "Mobi Wallet", sub: "₦150,000.00", cls: "top-[10%] -left-3 sm:-left-6 lp-animate-float", ring: "from-emerald-400 to-emerald-600" },
  { icon: Trophy, label: "Quiz Winner", sub: "+₦5,000.00 reward", cls: "top-[2%] right-0 sm:-right-4 lp-animate-float-slow", ring: "from-amber-400 to-orange-500" },
  { icon: Store, label: "Bulk Merchant", sub: "10% discount", cls: "bottom-[16%] -left-2 sm:-left-8 lp-animate-float-slow", ring: "from-sky-400 to-blue-600" },
  { icon: Users, label: "Live Election", sub: "Community vote", cls: "bottom-[4%] right-0 sm:-right-6 lp-animate-float", ring: "from-fuchsia-400 to-purple-600" },
];

export const LandingHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scaleOrb = useTransform(scrollYProgress, [0, 1], [1, 1.35]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden lp-hero-bg pt-24 pb-14 sm:pt-28 sm:pb-20">
      {/* Soft aurora orbs */}
      <motion.div style={{ scale: scaleOrb }} className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-[22rem] w-[22rem] rounded-full bg-[hsl(var(--lp-violet))] opacity-[0.16] blur-[110px] lp-animate-float sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute top-10 right-0 h-[20rem] w-[20rem] rounded-full bg-[hsl(var(--lp-cyan))] opacity-[0.14] blur-[110px] lp-animate-float-slow sm:h-[26rem] sm:w-[26rem]" />
        <div className="absolute bottom-0 left-0 h-[20rem] w-[20rem] rounded-full bg-[hsl(var(--lp-pink))] opacity-[0.12] blur-[110px] lp-animate-float sm:h-[24rem] sm:w-[24rem]" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 lp-grid-overlay" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">

        {/* Copy */}
        <motion.div style={{ y: yText, opacity }} className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full lp-pill px-4 py-1.5 text-sm font-semibold text-[hsl(var(--lp-fg))] lg:mx-0"
          >
            <Sparkles className="h-4 w-4 text-[hsl(var(--lp-amber))]" />
            One platform · endless possibilities
          </motion.div>

          <h1 className="lp-display text-[2.6rem] font-extrabold leading-[1.03] sm:text-6xl lg:text-7xl">
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
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[hsl(var(--lp-muted))] lg:mx-0"
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
              className="lp-btn-primary lp-pulse-ring group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-bold sm:w-auto"
            >
              Enter Mobiface
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://mobistore.mobi"
              className="lp-btn-ghost inline-flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-bold sm:w-auto"
            >
              Enter Mobi-store
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-[hsl(var(--lp-faint))] lg:justify-start"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[hsl(var(--lp-emerald))]" /> Bank-grade security
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
          className="relative mx-auto aspect-square w-full max-w-[17rem] sm:max-w-md"
        >
          {/* Central glowing emblem */}
          <div className="absolute inset-[22%] rounded-[2rem] lp-aurora-bg lp-animate-pan opacity-95 blur-[3px] sm:inset-[20%] sm:rounded-[2.2rem]" />
          <div className="absolute inset-[22%] flex items-center justify-center rounded-[2rem] lp-aurora-bg lp-animate-pan shadow-[var(--lp-glow-violet)] sm:inset-[20%] sm:rounded-[2.2rem]">
            <span className="text-5xl font-black text-white drop-shadow-lg sm:text-7xl">M</span>
          </div>
          <div className="lp-animate-spin-slow absolute inset-[8%] rounded-full border border-dashed border-[hsl(var(--lp-violet)/0.3)]" />

          {floatingCards.map((c) => (
            <div
              key={c.label}
              className={`absolute ${c.cls} w-[44%] max-w-[160px] rounded-2xl lp-surface-lg p-2.5 sm:p-3.5`}
            >
              <div className={`mb-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${c.ring} text-white shadow-md sm:mb-2 sm:h-9 sm:w-9 sm:rounded-xl`}>
                <c.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p className="text-xs font-bold text-[hsl(var(--lp-fg))] sm:text-sm">{c.label}</p>
              <p className="text-[0.7rem] font-medium leading-tight text-[hsl(var(--lp-muted))] sm:text-xs">{c.sub}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
