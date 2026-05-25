import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Global scroll-reveal hook.
 * Observes common UI card/item selectors and adds `.scroll-visible` when
 * they enter the viewport. Call this once inside any layout that wraps
 * route content — it re-runs on every route change.
 */

const SELECTORS = [
  ".service-card",
  ".testimonial-card",
  ".feature-item",
  ".process-step",
  ".contact-info-card",
  ".admin-stat",
  "[data-reveal]",
].join(", ");

export function useScrollAnimation() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Short delay lets React paint the new route before querying the DOM
    const timer = setTimeout(() => {
      const els = Array.from(document.querySelectorAll(SELECTORS));
      if (!els.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("scroll-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.07, rootMargin: "0px 0px -28px 0px" }
      );

      els.forEach((el) => {
        // Reset so re-navigation replays the entrance
        el.classList.remove("scroll-visible");
        // Stagger siblings — cap at 7 so delays don't get too long
        const siblings = Array.from(el.parentElement?.children ?? []);
        const pos = siblings.indexOf(el) % 8;
        el.style.setProperty("--scroll-i", pos);
        observer.observe(el);
      });

      return () => observer.disconnect();
    }, 60);

    return () => clearTimeout(timer);
  }, [pathname]);
}
