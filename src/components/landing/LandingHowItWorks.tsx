import { Reveal } from "./Reveal";
import { UserPlus, Wallet, Compass, Rocket } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create your account", body: "Sign up in seconds and set up your secure Mobigate profile." },
  { icon: Wallet, title: "Fund your Mobi Wallet", body: "Top up in Mobi (1 Mobi = ₦1) and you're ready to transact anywhere." },
  { icon: Compass, title: "Explore the ecosystem", body: "Join communities, shop merchants, play quizzes and grab vouchers." },
  { icon: Rocket, title: "Earn & grow", body: "Win rewards, unlock discounts and build your reputation as you go." },
];

export const LandingHowItWorks = () => {
  return (
    <section id="how" className="relative lp-tint-bg py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="lp-eyebrow mb-3 text-xs font-bold uppercase">How it works</p>
          <h2 className="lp-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Up and running in <span className="lp-text-gradient">four moves</span>
          </h2>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-4">
          {/* connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-[hsl(var(--lp-violet)/0.35)] to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="relative">
              <div className="h-full rounded-3xl lp-surface p-6 text-center md:text-left">
                <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl lp-aurora-bg lp-animate-pan shadow-[var(--lp-glow-violet)] md:mx-0">
                  <s.icon className="h-7 w-7 text-white" />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--lp-fg))] text-sm font-black text-white shadow-md">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-[hsl(var(--lp-fg))]">{s.title}</h3>
                <p className="text-base leading-relaxed text-[hsl(var(--lp-muted))]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
