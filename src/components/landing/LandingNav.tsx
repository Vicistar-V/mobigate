import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import mobifaceLogo from "@/assets/mobiface-logo.png";

const NAV_LINKS = [
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "How it works", href: "#how" },
  { label: "Loved by all", href: "#loved" },
  { label: "Apps", href: "#apps" },
];

export const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [appMenu, setAppMenu] = useState(false);

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
          scrolled ? "lp-surface backdrop-blur-xl" : "border border-transparent"
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
              className="text-sm font-semibold text-[hsl(var(--lp-muted))] transition-colors hover:text-[hsl(var(--lp-violet))]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <button
              onClick={() => setAppMenu((v) => !v)}
              className="lp-btn-primary group inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold"
            >
              Enter App
              <ChevronDown className={`h-4 w-4 transition-transform ${appMenu ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {appMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-48 rounded-2xl lp-surface-lg p-2"
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setAppMenu(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[hsl(var(--lp-fg))] transition-colors hover:bg-[hsl(var(--lp-bg-tint))]"
                  >
                    Mobi Face <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#"
                    onClick={() => setAppMenu(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[hsl(var(--lp-fg))] transition-colors hover:bg-[hsl(var(--lp-bg-tint))]"
                  >
                    Mobi-Store <ArrowRight className="h-4 w-4" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lp-pill inline-flex h-10 w-10 items-center justify-center rounded-xl text-[hsl(var(--lp-fg))] md:hidden"
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
            className="mx-auto mt-2 max-w-6xl rounded-2xl lp-surface-lg p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-semibold text-[hsl(var(--lp-fg))] transition-colors hover:bg-[hsl(var(--lp-bg-tint))]"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/dashboard"
                className="lp-btn-primary mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-base font-bold"
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
