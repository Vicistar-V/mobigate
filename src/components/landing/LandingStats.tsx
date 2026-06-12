import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

const stats = [
  { value: 250000, suffix: "+", label: "Active members" },
  { value: 18000, suffix: "+", label: "Merchants onboard" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "Member rating" },
  { value: 99.9, decimals: 1, suffix: "%", label: "Uptime" },
];

export const LandingStats = () => {
  return (
    <section className="relative overflow-hidden lp-dark py-24">
      <div className="pointer-events-none absolute inset-0 lp-grid-overlay opacity-60" />
      <div className="relative mx-auto max-w-5xl px-5">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[hsl(var(--lp-cyan))]">
            Trusted at scale
          </p>
          <h2 className="lp-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Numbers that keep <span className="lp-text-gradient">growing</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <div className="rounded-3xl lp-glass-dark px-3 py-8">
                <div className="text-4xl font-black text-white sm:text-5xl">
                  <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
                </div>
                <p className="mt-2 text-sm font-medium text-white/65">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
