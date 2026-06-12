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
    <section className="relative overflow-hidden bg-[hsl(var(--lp-ink))] py-20">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <div className="rounded-3xl lp-glass px-3 py-8">
              <div className="text-4xl font-black text-white sm:text-5xl">
                <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm font-medium text-white/60">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
