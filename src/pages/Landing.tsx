import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingMarquee } from "@/components/landing/LandingMarquee";
import { LandingEcosystem } from "@/components/landing/LandingEcosystem";
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingApps } from "@/components/landing/LandingApps";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFinalCTA } from "@/components/landing/LandingFinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // SEO basics
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Mobigate — Your World of Endless Possibilities";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") || "";
    meta?.setAttribute(
      "content",
      "Mobigate unites wallets, communities, merchants, vouchers, quizzes and rewards in one premium social commerce platform. Make your choice — enter Mobigate.",
    );
    return () => {
      document.title = prevTitle;
      meta?.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[hsl(var(--lp-ink))] antialiased">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left lp-aurora-bg"
      />
      <LandingNav />
      <main>
        <LandingHero />
        <LandingMarquee />
        <LandingEcosystem />
        <LandingStats />
        <LandingHowItWorks />
        <LandingApps />
        <LandingTestimonials />
        <LandingFinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Landing;
