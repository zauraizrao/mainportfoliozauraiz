# Zauraiz Rao — Portfolio

A production portfolio for Zauraiz Rao, built as a standard Next.js application with React, GSAP, ScrollTrigger, Lenis, TypeScript, and plain CSS. Content is centralized in `src/data/content.ts`.

## Local setup

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal.

## Production build

```bash
npm run build
```

Next.js writes the optimized production application to `.next`.

## Deploy to Netlify

Connect the repository in Netlify. Netlify detects the standard Next.js application and uses its maintained Next.js runtime; the included `netlify.toml` supplies the build command, output directory, and security headers. The contact form is configured for Netlify Forms, so enable form detection in the Netlify project settings.

## Deploy to Vercel

Import the repository in Vercel. The included `vercel.json` identifies the standard Next.js framework, and Vercel handles the build and runtime automatically. The contact form includes a direct email fallback because Netlify Forms is not available on Vercel.

## Content edits

Update text, links, projects, skills, experience, education, and certificate details in `src/data/content.ts`. Shared visual tokens live at the top of `app/globals.css`.

## Animation system

The interaction layer lives in `src/hooks/usePortfolioAnimations.ts` and is scoped to the portfolio root with `gsap.context()` so animations and event listeners are cleaned up when the page unmounts.

- GSAP controls the intro loader, hero sequence, section reveals, counters, magnetic controls, active navigation indicator, form feedback, and footer entrance.
- ScrollTrigger drives the condensed navigation, page progress, pinned experience chapters, desktop horizontal project gallery, and section-based animation timing.
- Lenis provides smooth wheel scrolling and runs from GSAP's ticker so scrolling and ScrollTrigger stay synchronized.
- ScrollToPlugin handles internal navigation with the fixed-header offset.
- Desktop-only pinning is isolated with `gsap.matchMedia()`; viewports at 900px and below use readable vertical experience and project cards.
- `prefers-reduced-motion` disables the loader, smooth scrolling, looping motion, pinning, and reveal effects while keeping all content visible and native anchor navigation available.
- The intro is shown once per browser tab session via `sessionStorage`; repeat views receive a short fade instead of the full counter sequence.

When adding a section, use transform/opacity-based motion, place setup inside the scoped hook, add every manual listener to its cleanup list, and call `ScrollTrigger.refresh()` after layout-affecting assets or content change.
