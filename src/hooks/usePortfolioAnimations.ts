'use client';

import { RefObject, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

type AnimationOptions = {
  menuOpen: boolean;
  formState: 'idle' | 'sending' | 'sent' | 'error';
  onLoaderComplete: () => void;
};

export function usePortfolioAnimations(root: RefObject<HTMLElement | null>, options: AnimationOptions) {
  const { onLoaderComplete } = options;

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const cleanups: Array<() => void> = [];
    let lenis: Lenis | undefined;

    const context = gsap.context(() => {
      if (reduced) {
        document.documentElement.dataset.motion = 'reduced';
        gsap.set(element.querySelectorAll('[data-reveal], [data-build], .build-line, .hero-word, .bio-line, [data-chip], .skill-pill, [data-credential-card], .contact-field, .contact-links > *, [data-footer-item], [data-project-card] .project-content > *'), { clearProps: 'all', autoAlpha: 1 });
        gsap.set('.preloader', { autoAlpha: 0 });
        window.setTimeout(onLoaderComplete, 0);
        return;
      }

      lenis = new Lenis({ duration: 1.08, smoothWheel: true, wheelMultiplier: .92 });
      const updateScrollTriggers = () => ScrollTrigger.update();
      const updateLenis = (time: number) => lenis?.raf(time * 1000);
      lenis.on('scroll', updateScrollTriggers);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => { lenis?.off('scroll', updateScrollTriggers); gsap.ticker.remove(updateLenis); lenis?.destroy(); });

      const heroTimeline = gsap.timeline({ paused: true });
      heroTimeline
        .from('.site-header .wordmark, .desktop-nav a, .nav-cta, .menu-button', { y: -18, autoAlpha: 0, duration: .72, stagger: .065, ease: 'power3.out' })
        .from('.hero-word', { yPercent: 115, autoAlpha: 0, rotate: 2, duration: 1.12, stagger: .095, ease: 'power4.out' }, '-=.42')
        .from('.hero-kicker', { y: 24, autoAlpha: 0, duration: .7, ease: 'power3.out' }, '-=.84')
        .from('.portrait-frame', { scale: .82, rotate: -4, autoAlpha: 0, duration: .9, ease: 'back.out(1.4)' }, '-=.7')
        .from('.hero-intro, .hero-meta', { y: 24, autoAlpha: 0, duration: .7, stagger: .12, ease: 'power3.out' }, '-=.58')
        .from('.socials a', { y: 15, scale: .65, autoAlpha: 0, duration: .5, stagger: .08, ease: 'back.out(1.8)' }, '-=.42')
        .from('.scroll-cue', { y: 12, autoAlpha: 0, duration: .5, ease: 'power2.out' }, '-=.25');

      const loader = element.querySelector<HTMLElement>('.preloader');
      const percentage = element.querySelector<HTMLElement>('.loader-percentage');
      const hasSeenLoader = sessionStorage.getItem('zr-intro-seen') === 'true';
      if (loader && percentage) {
        const progress = { value: 0 };
        const loaderTimeline = gsap.timeline({ onComplete: onLoaderComplete });
        if (hasSeenLoader) {
          loaderTimeline.to(loader, { autoAlpha: 0, duration: .22, ease: 'power2.out' });
          heroTimeline.play(0);
        } else {
          loaderTimeline
            .from('.preloader-mark > *, .preloader-name span', { yPercent: 120, autoAlpha: 0, duration: .35, stagger: .02, ease: 'power4.out' })
            .to(progress, { value: 100, duration: .95, ease: 'power2.inOut', onUpdate: () => { percentage.textContent = `${Math.round(progress.value)}%`; } }, '-=.18')
            .to('.loader-line', { scaleX: 1, duration: .95, ease: 'power2.inOut' }, '<')
            .to('.preloader > :not(.loader-line)', { y: -25, autoAlpha: 0, duration: .25, stagger: .015, ease: 'power2.in' })
            .to(loader, { yPercent: -100, duration: .45, ease: 'power4.inOut', onStart: () => { sessionStorage.setItem('zr-intro-seen', 'true'); heroTimeline.play(0); } }, '-=.08');
        }
      } else {
        heroTimeline.play(0);
        onLoaderComplete();
      }

      gsap.to('.scroll-cue svg', { y: 7, repeat: -1, yoyo: true, duration: .72, ease: 'sine.inOut' });
      gsap.to('.portrait-frame img', { y: -7, rotate: .7, repeat: -1, yoyo: true, duration: 2.9, ease: 'sine.inOut' });
      gsap.to('.portrait-frame', { yPercent: 22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
      gsap.to('.portrait-offset', { yPercent: -16, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });

      const marqueeTweens: gsap.core.Tween[] = [];
      const createMarquee = (containerSelector: string, trackSelector: string, duration: number) => {
        const container = element.querySelector<HTMLElement>(containerSelector);
        const track = element.querySelector<HTMLElement>(trackSelector);
        if (!container || !track) return;
        const tween = gsap.to(track, { xPercent: -50, duration, ease: 'none', repeat: -1 });
        const pause = () => tween.pause();
        const resume = () => tween.resume();
        container.addEventListener('mouseenter', pause);
        container.addEventListener('mouseleave', resume);
        cleanups.push(() => { container.removeEventListener('mouseenter', pause); container.removeEventListener('mouseleave', resume); });
        marqueeTweens.push(tween);
      };
      createMarquee('.role-strip', '.role-track', 22);
      createMarquee('.skills-marquee', '.skills-marquee-track', 34);

      gsap.set('.scroll-progress span', { transformOrigin: 'left center', scaleX: 0 });
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: ({ progress }) => gsap.set('.scroll-progress span', { scaleX: progress }) });

      element.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node, index) => {
        const x = index % 3 === 0 ? -28 : index % 3 === 1 ? 28 : 0;
        gsap.from(node, { x, y: x ? 14 : 34, autoAlpha: 0, duration: .86, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 87%', toggleActions: 'play none none none' } });
      });
      element.querySelectorAll<HTMLElement>('[data-build]').forEach((heading) => {
        gsap.from(heading.querySelectorAll('.build-line'), { yPercent: 110, rotate: 1.5, autoAlpha: 0, duration: 1, stagger: .14, ease: 'power4.out', scrollTrigger: { trigger: heading, start: 'top 82%', toggleActions: 'play none none none' } });
      });
      gsap.from('.bio-line', { y: 30, autoAlpha: 0, duration: .8, stagger: .16, ease: 'power3.out', scrollTrigger: { trigger: '.about-details', start: 'top 82%', toggleActions: 'play none none none' } });
      gsap.from('[data-chip]', { y: 28, scale: .94, autoAlpha: 0, duration: .62, stagger: .11, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.about-facts', start: 'top 84%', toggleActions: 'play none none none' } });
      gsap.from('.skill-group h3, .skill-pill', { y: 18, scale: .72, autoAlpha: 0, duration: .62, stagger: .045, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.skill-cloud', start: 'top 80%', toggleActions: 'play none none none' } });
      gsap.from('.skills-marquee', { y: 25, autoAlpha: 0, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: '.skills-marquee', start: 'top 92%', toggleActions: 'play none none none' } });
      gsap.from('[data-credential-card]', { y: 45, scale: .94, autoAlpha: 0, duration: .9, stagger: .15, ease: 'power3.out', scrollTrigger: { trigger: '.credential-grid', start: 'top 82%', toggleActions: 'play none none none' } });
      gsap.from('.contact-field', { y: 28, autoAlpha: 0, duration: .7, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.contact form', start: 'top 84%', toggleActions: 'play none none none' } });
      gsap.from('.contact-links > *', { x: -22, autoAlpha: 0, duration: .6, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.contact-links', start: 'top 88%', toggleActions: 'play none none none' } });
      gsap.from('[data-footer-item]', { y: 18, autoAlpha: 0, duration: .62, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: 'footer', start: 'top 94%', toggleActions: 'play none none none' } });
      gsap.from('[data-closing-count]', { yPercent: 45, scale: .8, autoAlpha: 0, duration: 1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.closing-cta', start: 'top 82%', toggleActions: 'play none none none' } });
      gsap.from('.closing-cta > div > *', { y: 24, autoAlpha: 0, duration: .7, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.closing-cta', start: 'top 78%', toggleActions: 'play none none none' } });

      element.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
        const end = Number(node.dataset.count);
        const count = { value: 0 };
        gsap.to(count, { value: end, duration: 1.45, ease: 'power2.out', onUpdate: () => { node.textContent = String(Math.round(count.value)).padStart(2, '0'); }, scrollTrigger: { trigger: node, start: 'top 90%', once: true } });
      });

      const header = element.querySelector<HTMLElement>('.site-header');
      const navBackdrop = element.querySelector<HTMLElement>('.nav-backdrop');
      const headerContents = element.querySelectorAll<HTMLElement>('.site-header > :not(.nav-backdrop)');
      if (navBackdrop) gsap.set(navBackdrop, { autoAlpha: 0 });
      let condensed = false;
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => {
        const next = self.scroll() > 44;
        if (next === condensed) return;
        condensed = next;
        if (header) gsap.to(header, { y: next ? -7 : 0, duration: .35, ease: 'power3.out', overwrite: true });
        gsap.to(headerContents, { scale: next ? .94 : 1, duration: .35, ease: 'power3.out', overwrite: true });
        if (navBackdrop) gsap.to(navBackdrop, { autoAlpha: next ? 1 : 0, duration: .35, ease: 'power2.out', overwrite: true });
      } });

      const desktopNav = element.querySelector<HTMLElement>('.desktop-nav');
      const indicator = element.querySelector<HTMLElement>('.nav-indicator');
      const navLinks = Array.from(element.querySelectorAll<HTMLAnchorElement>('.desktop-nav a'));
      const moveIndicator = (link: HTMLAnchorElement) => {
        if (!desktopNav || !indicator) return;
        gsap.to(indicator, { x: link.offsetLeft, scaleX: link.offsetWidth, autoAlpha: 1, duration: .38, ease: 'power3.out', overwrite: true });
        navLinks.forEach((item) => item.classList.toggle('active', item === link));
      };
      element.querySelectorAll<HTMLElement>('section[id]').forEach((section) => {
        ScrollTrigger.create({ trigger: section, start: 'top 52%', end: 'bottom 48%', onToggle: ({ isActive }) => { if (isActive) { const link = navLinks.find((item) => item.hash === `#${section.id}`); if (link) moveIndicator(link); } } });
      });

      const internalLinks = Array.from(element.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
      internalLinks.forEach((link) => {
        const click = (event: MouseEvent) => {
          const target = document.querySelector<HTMLElement>(link.hash);
          if (!target) return;
          event.preventDefault();
          gsap.to(window, { duration: 1.12, scrollTo: { y: target, offsetY: 64 }, ease: 'power3.inOut' });
        };
        link.addEventListener('click', click);
        cleanups.push(() => link.removeEventListener('click', click));
      });

      element.querySelectorAll<HTMLElement>('.contact-field').forEach((field) => {
        const control = field.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
        const line = field.querySelector<HTMLElement>('i');
        if (!control || !line) return;
        gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
        const focus = () => gsap.to(line, { scaleX: 1, duration: .45, ease: 'power3.out' });
        const blur = () => gsap.to(line, { scaleX: 0, duration: .32, ease: 'power2.inOut' });
        control.addEventListener('focus', focus);
        control.addEventListener('blur', blur);
        cleanups.push(() => { control.removeEventListener('focus', focus); control.removeEventListener('blur', blur); });
      });
      element.querySelectorAll<HTMLElement>('.contact-links a').forEach((link) => {
        const icon = link.querySelector('svg, .contact-monogram');
        if (!icon) return;
        const enter = () => gsap.to(icon, { rotate: 8, scale: 1.14, duration: .28, ease: 'back.out(2)' });
        const leave = () => gsap.to(icon, { rotate: 0, scale: 1, duration: .28, ease: 'power2.out' });
        link.addEventListener('mouseenter', enter);
        link.addEventListener('mouseleave', leave);
        cleanups.push(() => { link.removeEventListener('mouseenter', enter); link.removeEventListener('mouseleave', leave); });
      });

      const media = gsap.matchMedia();
      media.add('(min-width: 901px)', () => {
        const panels = Array.from(element.querySelectorAll<HTMLElement>('[data-experience-panel]'));
        const tabs = Array.from(element.querySelectorAll<HTMLElement>('[data-experience-tab]'));
        const rail = element.querySelector<HTMLElement>('.experience-progress span');
        if (panels.length) {
          gsap.set(panels, { autoAlpha: 0, scale: .94, y: 28 });
          gsap.set(panels[0], { autoAlpha: 1, scale: 1, y: 0 });
          gsap.set(tabs, { opacity: .42, x: 0 });
          gsap.set(tabs[0], { opacity: 1, x: 8 });
          if (rail) gsap.set(rail, { scaleX: 0, transformOrigin: 'left center' });
          let activePanel = 0;
          const experienceTrigger = ScrollTrigger.create({ id: 'experience-pin', trigger: '.experience-stage', start: 'top 14%', end: () => `+=${window.innerHeight * 2.2}`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: ({ progress }) => {
            if (rail) gsap.set(rail, { scaleX: progress });
            const nextPanel = Math.min(panels.length - 1, Math.round(progress * (panels.length - 1)));
            if (nextPanel === activePanel) return;
            gsap.to(panels[activePanel], { autoAlpha: 0, scale: .94, y: -22, duration: .38, ease: 'power2.inOut', overwrite: true });
            gsap.to(tabs[activePanel], { opacity: .42, x: 0, duration: .32, ease: 'power2.out', overwrite: true });
            activePanel = nextPanel;
            gsap.fromTo(panels[activePanel], { autoAlpha: 0, scale: .95, y: 28 }, { autoAlpha: 1, scale: 1, y: 0, duration: .5, ease: 'power3.out', overwrite: true });
            gsap.to(tabs[activePanel], { opacity: 1, x: 8, duration: .38, ease: 'power3.out', overwrite: true });
            const bullets = Array.from(panels[activePanel].querySelectorAll('li'));
            if (bullets.length) gsap.fromTo(bullets, { x: 18, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .42, stagger: .07, ease: 'power3.out', overwrite: true });
          } });
          tabs.forEach((tab, index) => {
            const click = () => gsap.to(window, { duration: .9, scrollTo: experienceTrigger.start + ((experienceTrigger.end - experienceTrigger.start) * index / (tabs.length - 1)), ease: 'power3.inOut' });
            tab.addEventListener('click', click);
            cleanups.push(() => tab.removeEventListener('click', click));
          });
        }

        const projectTrack = element.querySelector<HTMLElement>('.project-track');
        const cards = Array.from(element.querySelectorAll<HTMLElement>('[data-project-card]'));
        const progressNumber = element.querySelector<HTMLElement>('.project-progress strong span');
        const progressFill = element.querySelector<HTMLElement>('.project-progress i span');
        if (projectTrack && cards.length) {
          if (progressFill) gsap.set(progressFill, { scaleX: 0, transformOrigin: 'left center' });
          const horizontalTween = gsap.to(projectTrack, { x: () => -(projectTrack.scrollWidth - window.innerWidth + 80), ease: 'none', scrollTrigger: { id: 'projects-pin', trigger: '.projects-pin', start: 'top 64px', end: () => `+=${projectTrack.scrollWidth}`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: ({ progress }) => {
            if (progressFill) gsap.set(progressFill, { scaleX: progress });
            if (progressNumber) progressNumber.textContent = String(Math.min(cards.length, Math.floor(progress * cards.length) + 1)).padStart(2, '0');
          } } });
          cards.forEach((card) => {
            gsap.from(card.querySelectorAll('.project-top, .project-content > *, a, .project-note'), { y: 30, scale: .97, autoAlpha: 0, duration: .7, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: card, containerAnimation: horizontalTween, start: 'left 82%', toggleActions: 'play none none none' } });
          });
        }
      });
      media.add('(max-width: 900px)', () => {
        gsap.set('[data-experience-panel]', { clearProps: 'all' });
        element.querySelectorAll<HTMLElement>('[data-experience-panel], [data-project-card]').forEach((card) => {
          gsap.from(card, { y: 42, scale: .96, autoAlpha: 0, duration: .78, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' } });
          gsap.from(card.querySelectorAll('h3, .experience-description > *, .project-content > *, a, .project-note'), { y: 20, autoAlpha: 0, duration: .55, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none none' } });
        });
      });
      cleanups.push(() => media.revert());

      if (!coarsePointer) {
        element.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((button) => {
          const x = gsap.quickTo(button, 'x', { duration: .35, ease: 'power3.out' });
          const y = gsap.quickTo(button, 'y', { duration: .35, ease: 'power3.out' });
          const move = (event: MouseEvent) => { const bounds = button.getBoundingClientRect(); x((event.clientX - bounds.left - bounds.width / 2) * .18); y((event.clientY - bounds.top - bounds.height / 2) * .18); };
          const leave = () => { x(0); y(0); };
          button.addEventListener('mousemove', move);
          button.addEventListener('mouseleave', leave);
          cleanups.push(() => { button.removeEventListener('mousemove', move); button.removeEventListener('mouseleave', leave); });
        });
        const cursor = element.querySelector<HTMLElement>('.cursor');
        if (cursor) {
          const cursorX = gsap.quickTo(cursor, 'x', { duration: .16, ease: 'power3' });
          const cursorY = gsap.quickTo(cursor, 'y', { duration: .16, ease: 'power3' });
          const moveCursor = (event: MouseEvent) => { cursorX(event.clientX); cursorY(event.clientY); };
          const hoverCursor = (event: MouseEvent) => gsap.to(cursor, { scale: (event.target as Element).closest('a, button, input, textarea, [data-cursor-grow], [data-project-card]') ? 1.7 : 1, duration: .22, ease: 'power2.out', overwrite: true });
          window.addEventListener('mousemove', moveCursor);
          document.addEventListener('mouseover', hoverCursor);
          cleanups.push(() => { window.removeEventListener('mousemove', moveCursor); document.removeEventListener('mouseover', hoverCursor); });
        }
      }

      let resizeTimer = 0;
      const refresh = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 180); };
      window.addEventListener('resize', refresh);
      window.addEventListener('orientationchange', refresh);
      window.addEventListener('load', refresh, { once: true });
      cleanups.push(() => { window.clearTimeout(resizeTimer); window.removeEventListener('resize', refresh); window.removeEventListener('orientationchange', refresh); window.removeEventListener('load', refresh); });
    }, element);

    return () => { cleanups.forEach((cleanup) => cleanup()); context.revert(); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); };
  }, [onLoaderComplete, root]);

  useLayoutEffect(() => {
    const element = root.current;
    const menu = element?.querySelector<HTMLElement>('.mobile-menu');
    if (!element || !menu) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const links = menu.querySelectorAll('nav a');
    gsap.killTweensOf([menu, ...links]);
    if (options.menuOpen) {
      document.documentElement.style.overflow = 'hidden';
      gsap.set(menu, { visibility: 'visible' });
      if (reduced) gsap.set(menu, { yPercent: 0, autoAlpha: 1 });
      else gsap.timeline().fromTo(menu, { yPercent: -100, autoAlpha: 1 }, { yPercent: 0, duration: .62, ease: 'power4.inOut' }).fromTo(links, { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .48, stagger: .065, ease: 'power3.out' }, '-=.18');
    } else {
      document.documentElement.style.overflow = '';
      if (reduced) gsap.set(menu, { yPercent: -100, autoAlpha: 0, visibility: 'hidden' });
      else gsap.to(menu, { yPercent: -100, autoAlpha: 0, duration: .48, ease: 'power3.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
    }
    return () => { document.documentElement.style.overflow = ''; };
  }, [options.menuOpen, root]);

  useLayoutEffect(() => {
    if (options.formState !== 'sent') return;
    const check = root.current?.querySelector<SVGElement>('.form-success-check');
    if (!check) return;
    const paths = check.querySelectorAll('path');
    gsap.set(paths, { strokeDasharray: 40, strokeDashoffset: 40 });
    gsap.timeline().fromTo(check, { scale: .4, rotate: -20, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: .42, ease: 'back.out(2)' }).to(paths, { strokeDashoffset: 0, duration: .55, ease: 'power2.out' }, '-=.22');
  }, [options.formState, root]);
}
