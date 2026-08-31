'use client';

import { RefObject, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function usePortfolioAnimations(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (reduced) {
      document.documentElement.dataset.motion = 'reduced';
      gsap.set(el.querySelectorAll('[data-reveal], .hero-word'), { opacity: 1, clearProps: 'transform' });
      return;
    }

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.from('.hero-word', { yPercent: 115, opacity: 0, rotate: 2, duration: 1.15, stagger: .09, ease: 'power4.out', delay: .1 });
      gsap.from('.hero-kicker, .hero-bottom', { y: 24, opacity: 0, duration: .8, stagger: .12, ease: 'power3.out', delay: .65 });
      gsap.to('.role-track', { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });

      el.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node, index) => {
        const direction = index % 3 === 0 ? -32 : index % 3 === 1 ? 32 : 0;
        gsap.from(node, { x: direction, y: direction ? 18 : 38, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 86%', once: true } });
      });

      gsap.from('.skill-pill', { scale: .65, opacity: 0, stagger: .06, duration: .65, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.skill-cloud', start: 'top 78%', once: true } });
      gsap.from('.experience-item:nth-child(odd)', { x: -55, opacity: 0, stagger: .16, scrollTrigger: { trigger: '.experience-list', start: 'top 76%', once: true } });
      gsap.from('.experience-item:nth-child(even)', { x: 55, opacity: 0, stagger: .16, scrollTrigger: { trigger: '.experience-list', start: 'top 76%', once: true } });

      document.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
        const end = Number(node.dataset.count);
        const state = { value: 0 };
        gsap.to(state, { value: end, duration: 1.5, ease: 'power2.out', onUpdate: () => { node.textContent = String(Math.round(state.value)).padStart(2, '0'); }, scrollTrigger: { trigger: node, start: 'top 88%', once: true } });
      });

      if (window.innerWidth > 860) {
        const track = el.querySelector<HTMLElement>('.project-track');
        if (track) gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth + 80), ease: 'none', scrollTrigger: { trigger: '.projects-pin', start: 'top top', end: () => `+=${track.scrollWidth}`, scrub: 1, pin: true, invalidateOnRefresh: true } });
      }

      const header = el.querySelector('.site-header');
      ScrollTrigger.create({ start: 40, onUpdate: (self) => header?.classList.toggle('is-scrolled', self.scroll() > 40) });
      el.querySelectorAll<HTMLElement>('section[id]').forEach((section) => ScrollTrigger.create({ trigger: section, start: 'top center', end: 'bottom center', onToggle: ({ isActive }) => { if (isActive) { document.querySelectorAll('.desktop-nav a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${section.id}`)); } } }));
    }, el);

    const magneticCleanups: Array<() => void> = [];
    if (!touch) {
      el.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((button) => {
        const x = gsap.quickTo(button, 'x', { duration: .35, ease: 'power3.out' });
        const y = gsap.quickTo(button, 'y', { duration: .35, ease: 'power3.out' });
        const move = (event: MouseEvent) => { const box = button.getBoundingClientRect(); x((event.clientX - box.left - box.width / 2) * .18); y((event.clientY - box.top - box.height / 2) * .18); };
        const leave = () => { x(0); y(0); };
        button.addEventListener('mousemove', move); button.addEventListener('mouseleave', leave);
        magneticCleanups.push(() => { button.removeEventListener('mousemove', move); button.removeEventListener('mouseleave', leave); });
      });

      const cursor = el.querySelector<HTMLElement>('.cursor');
      if (cursor) {
        const cursorX = gsap.quickTo(cursor, 'x', { duration: .18, ease: 'power3' });
        const cursorY = gsap.quickTo(cursor, 'y', { duration: .18, ease: 'power3' });
        const moveCursor = (event: MouseEvent) => { cursorX(event.clientX); cursorY(event.clientY); };
        const hover = (event: MouseEvent) => cursor.classList.toggle('is-hovering', Boolean((event.target as Element).closest('a, button, input, textarea')));
        window.addEventListener('mousemove', moveCursor); document.addEventListener('mouseover', hover);
        magneticCleanups.push(() => { window.removeEventListener('mousemove', moveCursor); document.removeEventListener('mouseover', hover); });
      }
    }

    return () => { magneticCleanups.forEach((cleanup) => cleanup()); ctx.revert(); lenis.destroy(); gsap.ticker.remove(update); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); };
  }, [root]);
}
