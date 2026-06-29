# seanoreilly.dev

My personal site — a short intro, my stack, a few projects I'm proud of, and how to reach me. It's deliberately small: one page, a handful of sections, no fluff.

I also treated it as a place to sweat the interaction details I don't always get to in client work, so most of what's interesting here is in the feel rather than the feature list.

## The bits I cared about

**One screen, one section.** Every section is a full-viewport panel that snaps into place. On touch that's just native CSS scroll-snap, which is already great. On a mouse or trackpad I take over the wheel entirely with a small gesture controller (`SnapController`) — a mouse wheel and a trackpad are indistinguishable per-event in modern browsers, so rather than guess the device I own every wheel event: one flick or one notch advances exactly one section, the page can never overshoot its bounds, and a card that has more content scrolls internally before the next section snaps in. Keyboard navigation (arrows, Page Up/Down, Home/End) and `prefers-reduced-motion` are wired in too.

**A background with some depth.** There's an animated shader (orange neuro-noise) that's revealed on load by an expanding radial mask, a faint drifting dot-field on a canvas, a film-grain overlay, and a darkening scrim on top. The shader blur is done with a plain element `filter` instead of `backdrop-filter` — a backdrop filter composites against the display's HDR pipeline and bands visibly on a near-black background, where an element filter stays clean.

**Restrained palette, readable contrast.** Near-black, a few greys, and one warm accent. The greys aren't arbitrary — the secondary and tertiary text colours are tuned to clear WCAG AA on the dark page so nothing turns to mud at small sizes.

**Projects as a carousel.** A horizontal card track with a scrollable filmstrip selector that auto-centres the active project and fades only the edges that are actually clipped. Each card has its own image carousel with a full-screen, keyboard-navigable lightbox.

**Accessibility as a default, not a pass at the end.** Visible focus rings, ARIA roles and labels on the interactive bits, touch targets quietly enlarged on coarse pointers, and motion that backs off when the OS asks it to.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS, with the background shader from `@paper-design/shaders-react` and brand glyphs from `simple-icons`. Deployed in a standalone Docker image.

## Running it

It's a standard Next.js app — `npm install` then `npm run dev`.
