import { Wallet, Users, Store, Trophy, Gift, Vote, ShoppingBag, ShieldCheck, Megaphone, Coins } from "lucide-react";

const items = [
  { icon: Wallet, label: "Mobi Wallet" },
  { icon: Users, label: "Communities" },
  { icon: Store, label: "Bulk Merchants" },
  { icon: ShoppingBag, label: "Retail Merchants" },
  { icon: Trophy, label: "Quizzes & Rewards" },
  { icon: Gift, label: "Vouchers" },
  { icon: Vote, label: "Elections" },
  { icon: Megaphone, label: "Adverts" },
  { icon: Coins, label: "Fundraisers" },
  { icon: ShieldCheck, label: "Secure Payments" },
];

export const LandingMarquee = () => {
  const row = [...items, ...items];
  return (
    <section className="relative border-y border-white/10 bg-[hsl(var(--lp-ink))] py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[hsl(var(--lp-ink))] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[hsl(var(--lp-ink))] to-transparent" />
      <div className="flex w-max lp-marquee-track gap-4">
        {row.map((it, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-full lp-glass px-5 py-2.5 text-white/85"
          >
            <it.icon className="h-5 w-5 text-[hsl(var(--lp-cyan))]" />
            <span className="whitespace-nowrap text-sm font-semibold">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
