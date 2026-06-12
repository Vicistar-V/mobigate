import { motion } from "framer-motion";
import { Wallet, Users, Store, Trophy, Gift, Vote } from "lucide-react";
import { Reveal } from "./Reveal";

const cards = [
  {
    icon: Wallet,
    title: "Mobi Wallet",
    body: "Fund, send and spend in Mobi (1 Mobi = ₦1). Every transaction in full figures, crystal clear, instantly reflected.",
    span: "md:col-span-2",
    grad: "from-emerald-500 to-teal-600",
    tint: "from-emerald-500/15",
  },
  {
    icon: Users,
    title: "Communities",
    body: "Join, lead and govern. Run elections, manage dues and rally members.",
    span: "",
    grad: "from-fuchsia-500 to-purple-600",
    tint: "from-fuchsia-500/15",
  },
  {
    icon: Store,
    title: "Bulk & Retail Merchants",
    body: "Tiered discounts, voucher inventory and a storefront built for scale.",
    span: "",
    grad: "from-sky-500 to-blue-600",
    tint: "from-sky-500/15",
  },
  {
    icon: Trophy,
    title: "Quizzes & Rewards",
    body: "Compete, hit accuracy thresholds and earn real Mobi rewards backed by merchant solvency.",
    span: "md:col-span-2",
    grad: "from-amber-500 to-orange-600",
    tint: "from-amber-500/15",
  },
  {
    icon: Gift,
    title: "Vouchers",
    body: "Generate, distribute and redeem with one-to-one PIN mapping.",
    span: "",
    grad: "from-rose-500 to-pink-600",
    tint: "from-rose-500/15",
  },
  {
    icon: Vote,
    title: "Fundraisers",
    body: "Launch campaigns, track contributions and celebrate milestones together.",
    span: "",
    grad: "from-violet-500 to-indigo-600",
    tint: "from-violet-500/15",
  },
];

export const LandingEcosystem = () => {
  return (
    <section id="ecosystem" className="relative bg-[hsl(var(--lp-bg))] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="lp-eyebrow mb-3 text-xs font-bold uppercase">One ecosystem</p>
          <h2 className="lp-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Everything you need,
            <span className="lp-text-gradient"> beautifully connected</span>
          </h2>
          <p className="mt-4 text-lg text-[hsl(var(--lp-muted))]">
            Mobigate weaves wallets, commerce, communities and play into a single,
            seamless surface.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06} className={c.span}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-3xl lp-surface p-6 transition-shadow hover:shadow-[var(--lp-shadow-lg)]"
              >
                <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${c.tint} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="relative">
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.grad} text-white shadow-lg`}>
                    <c.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[hsl(var(--lp-fg))]">{c.title}</h3>
                  <p className="text-base leading-relaxed text-[hsl(var(--lp-muted))]">{c.body}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
