# Zauraiz Rao — Portfolio

A production portfolio for Zauraiz Rao, built with React, Vinext/Vite, GSAP, ScrollTrigger, Lenis, TypeScript, and plain CSS. Content is centralized in `src/data/content.ts`.

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

The deployable client output is generated in `dist/client`.

## Deploy to Netlify

Connect the repository in Netlify. The included `netlify.toml` supplies the build command, output directory, SPA redirect, and security headers. The contact form is configured for Netlify Forms; enable form detection in the Netlify project settings.

## Deploy to Vercel

Import the repository in Vercel. The included `vercel.json` supplies the build command, output directory, and fallback rewrite. The contact form includes a direct email fallback because Netlify Forms is not available on Vercel.

## Content edits

Update text, links, projects, skills, experience, education, and certificate details in `src/data/content.ts`. Shared visual tokens live at the top of `app/globals.css`.
