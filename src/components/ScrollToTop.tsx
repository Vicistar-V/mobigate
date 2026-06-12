import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Disable the browser's automatic scroll restoration once. Otherwise, on a
  // fresh load / reload the browser can restore a previous scroll offset before
  // React paints, leaving the sticky header scrolled out of view until the user
  // manually scrolls back up.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // Run after paint so it wins against any late layout shifts (e.g. mobile
    // address-bar collapse) that would otherwise leave the page scrolled down.
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [pathname]);

  return null;
};
