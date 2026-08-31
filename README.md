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
