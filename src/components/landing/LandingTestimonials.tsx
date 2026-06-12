import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Ada N.", role: "Community Leader", body: "Running our elections and dues used to be chaos. Mobigate made it effortless and transparent.", rating: 5 },
  { name: "Emeka O.", role: "Bulk Merchant", body: "Tiered discounts and voucher inventory in one place. My sales doubled in a quarter.", rating: 5 },
  { name: "Chiamaka I.", role: "Quiz Champion", body: "I genuinely earn real Mobi from quizzes. Payouts are instant and fair.", rating: 5 },
  { name: "Tunde A.", role: "Retail Merchant", body: "The wallet and storefront feel premium. My customers trust the experience.", rating: 5 },
  { name: "Ngozi E.", role: "Member", body: "Everything I need — wallet, shopping, community — in one beautiful app.", rating: 5 },
  { name: "Bola K.", role: "Fundraiser Host", body: "We hit our campaign target in days. Tracking contributions is a joy.", rating: 5 },
];

const initials = (n: string) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
const avatarGrads = [
  "from-violet-500 to-indigo-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-fuchsia-500 to-purple-600",
  "from-rose-500 to-pink-600",
];

export const LandingTestimonials = () => {
  const row = [...testimonials, ...testimonials];
  return (
    <section id="loved" className="relative overflow-hidden lp-tint-bg py-24">
      <div className="mx-auto mb-12 max-w-2xl px-5 text-center">
        <Reveal>
          <p className="lp-eyebrow mb-3 text-xs font-bold uppercase">Loved by the community</p>
          <h2 className="lp-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Real people. <span className="lp-text-gradient">Real momentum.</span>
          </h2>
        </Reveal>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[hsl(var(--lp-bg-tint))] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[hsl(var(--lp-bg-tint))] to-transparent" />
        <div className="flex w-max lp-marquee-track gap-4 px-5">
          {row.map((t, i) => (
            <motion.div
              key={i}
              className="w-[300px] flex-shrink-0 rounded-3xl lp-surface p-6"
            >
              <Quote className="mb-3 h-7 w-7 text-[hsl(var(--lp-violet))]" />
              <p className="text-base leading-relaxed text-[hsl(var(--lp-fg))]">"{t.body}"</p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} text-sm font-bold text-white shadow-md`}>
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-[hsl(var(--lp-fg))]">{t.name}</p>
                    <p className="text-sm text-[hsl(var(--lp-faint))]">{t.role}</p>
                  </div>
                </div>
                <div className="flex">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-[hsl(var(--lp-amber))] text-[hsl(var(--lp-amber))]" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
