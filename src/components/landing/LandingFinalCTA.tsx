import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";

export const LandingFinalCTA = () => {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--lp-ink))] px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] p-10 text-center sm:p-16">
            <div className="absolute inset-0 lp-aurora-bg lp-animate-pan opacity-90" />
            <div className="pointer-events-none absolute inset-0 lp-grid-overlay opacity-40" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-4xl font-black leading-[1.05] text-white sm:text-6xl">
                Your world of endless possibilities is one tap away.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
                Join Mobigate today and step into wallets, commerce, community and rewards —
                all in one place.
              </p>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="mt-9 inline-block"
              >
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-[hsl(var(--lp-ink))] shadow-2xl"
                >
                  Enter Mobigate now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
