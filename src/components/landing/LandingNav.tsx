import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import mobifaceLogo from "@/assets/mobiface-logo.png";

const NAV_LINKS = [
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Why Mobigate", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Apps", href: "#apps" },
];

export const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${
          scrolled ? "lp-glass shadow-2xl" : "bg-transparent"
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src={mobifaceLogo} alt="Mobigate" className="h-9 w-auto" />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/75 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="group hidden items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[hsl(var(--lp-ink))] shadow-lg transition-transform hover:scale-105 active:scale-95 sm:inline-flex"
          >
            Enter App
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white lp-glass md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl lp-glass p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-white/85 hover:bg-white/10"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/dashboard"
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-3 text-base font-semibold text-[hsl(var(--lp-ink))]"
              >
                Enter App <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
