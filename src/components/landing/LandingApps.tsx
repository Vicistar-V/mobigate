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
    grad: "from-sky-500 to-blue-600",
  },
  {
    name: "Mobi-Store",
    tagline: "Shop bulk and retail merchants, redeem vouchers and grab tiered discounts.",
    icon: null,
    fallback: ShoppingBag,
    cta: "Download Mobi-Store",
    grad: "from-fuchsia-500 to-purple-600",
  },
];

export const LandingApps = () => {
  return (
    <section id="apps" className="relative overflow-hidden bg-[hsl(var(--lp-bg))] py-16 sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[hsl(var(--lp-violet))] opacity-[0.10] blur-[140px]" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto mb-10 sm:mb-14 max-w-2xl text-center">
          <p className="lp-eyebrow mb-3 text-xs font-bold uppercase">Take it everywhere</p>
          <h2 className="lp-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Two apps. <span className="lp-text-gradient">One Mobigate.</span>
          </h2>
          <p className="mt-4 text-lg text-[hsl(var(--lp-muted))]">
            Make your choice — we're ready to take you there.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {apps.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-3xl lp-surface p-7 transition-shadow hover:shadow-[var(--lp-shadow-lg)]"
              >
                <div className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${a.grad} to-transparent opacity-10 blur-3xl transition-opacity group-hover:opacity-25`} />
                <div className="relative flex items-start gap-4">
                  <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${a.grad} text-white shadow-lg`}>
                    {a.icon ? (
                      <img src={a.icon} alt={a.name} className="h-9 w-9 brightness-0 invert" />
                    ) : (
                      <a.fallback className="h-8 w-8" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-bold text-[hsl(var(--lp-fg))]">{a.name}</h3>
                    <p className="mt-1.5 text-base leading-relaxed text-[hsl(var(--lp-muted))]">{a.tagline}</p>
                  </div>
                </div>
                <button className="lp-btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-bold">
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
