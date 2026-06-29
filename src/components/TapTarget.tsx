/**
 * Invisible overlay that enlarges a control's touch target to at least the
 * recommended ~44px without affecting its visual size. Rendered only for coarse
 * pointers (`pointer-fine:hidden`), since a mouse doesn't need the padding.
 *
 * The parent must be `relative` and is expected to own its own focus/hover
 * styles — this element is purely a hit-area and is hidden from assistive tech.
 */
export function TapTarget({ className = "size-12" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-1/2 left-1/2 -translate-1/2 pointer-fine:hidden ${className}`}
    />
  );
}
