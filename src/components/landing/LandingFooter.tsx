import { Link } from "react-router-dom";
import mobifaceLogo from "@/assets/mobiface-logo.png";

const groups = [
  { title: "Platform", links: ["Ecosystem", "Communities", "Merchants", "Vouchers"] },
  { title: "Company", links: ["About Us", "Careers", "Press", "Contact"] },
  { title: "Resources", links: ["Help Center", "Quick Links", "Security", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Compliance"] },
];

export const LandingFooter = () => {
  return (
    <footer className="border-t border-[hsl(var(--lp-border))] lp-tint-bg px-5 pb-10 pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <img src={mobifaceLogo} alt="Mobigate" className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[hsl(var(--lp-muted))]">
              Mobigate — your world of endless possibilities. Wallets, commerce,
              communities and rewards, beautifully connected.
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-[hsl(var(--lp-fg))]">
                {g.title}
              </h4>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-[hsl(var(--lp-muted))] transition-colors hover:text-[hsl(var(--lp-violet))]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[hsl(var(--lp-border))] pt-6 sm:flex-row">
          <p className="text-sm text-[hsl(var(--lp-faint))]">
            © {new Date().getFullYear()} Mobigate. All rights reserved.
          </p>
          <Link
            to="/dashboard"
            className="text-sm font-semibold text-[hsl(var(--lp-violet))] transition-colors hover:opacity-80"
          >
            Enter App →
          </Link>
        </div>
      </div>
    </footer>
  );
};
