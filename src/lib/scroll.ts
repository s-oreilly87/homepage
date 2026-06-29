/**
 * Smoothly scroll the section with the given id to the very top of the viewport.
 *
 * Each panel reserves the nav height internally (see the `panel` utility in
 * globals.css), so the section's own top is the correct target — no nav-height
 * offset is applied here. No-ops if the element isn't found.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: "smooth" });
}
