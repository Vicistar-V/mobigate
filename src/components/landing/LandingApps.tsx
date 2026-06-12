import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { Download, Smartphone, ShoppingBag } from "lucide-react";
import mobifaceIcon from "@/assets/mobiface-icon.svg";

const apps = [
  {
    name: "Mobiface",
    tagline: "Your social commerce companion — wallet, communities and feed in your pocket.",
    icon: mobifaceIcon,
    fallback: Smartphone,
    cta: "Download Mobiface",
    glow: "from-sky-500/30",
  },
  {
    name: "Mobi-Store",
    tagline: "Shop bulk and retail merchants, redeem vouchers and grab tiered discounts.",
    icon: null,
    fallback: ShoppingBag,
    cta: "Download Mobi-Store",
    glow: "from-fuchsia-500/30",
  },
];

export const LandingApps = () => {
  return (
    <section id="apps" className="relative overflow-hidden bg-[hsl(var(--lp-ink))] py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[hsl(var(--lp-violet))] opacity-20 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--lp-cyan))]">
            Take it everywhere
          </p>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Two apps. <span className="lp-text-gradient">One Mobigate.</span>
          </h2>
          <p className="mt-4 text-lg text-white/65">
            Make your choice — we're ready to take you there.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {apps.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-3xl lp-glass p-7"
              >
                <div className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${a.glow} to-transparent opacity-50 blur-3xl transition-opacity group-hover:opacity-90`} />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    {a.icon ? (
                      <img src={a.icon} alt={a.name} className="h-9 w-9" />
                    ) : (
                      <a.fallback className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-bold text-white">{a.name}</h3>
                    <p className="mt-1.5 text-base leading-relaxed text-white/65">{a.tagline}</p>
                  </div>
                </div>
                <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-base font-bold text-[hsl(var(--lp-ink))] transition-transform hover:scale-[1.02] active:scale-95">
                  <Download className="h-5 w-5" />
                  {a.cta}
                </button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
