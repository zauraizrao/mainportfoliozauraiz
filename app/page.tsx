'use client';

import Image from 'next/image';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { portfolio } from '@/src/data/content';
import { usePortfolioAnimations } from '@/src/hooks/usePortfolioAnimations';

const navItems = ['about', 'experience', 'skills', 'projects', 'certificates', 'contact'];

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  usePortfolioAnimations(root);

  useEffect(() => {
    const seen = sessionStorage.getItem('zr-intro-seen');
    if (!seen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const showTimer = window.setTimeout(() => setLoading(true), 0);
      const hideTimer = window.setTimeout(() => { setLoading(false); sessionStorage.setItem('zr-intro-seen', 'true'); }, 1100);
      return () => { window.clearTimeout(showTimer); window.clearTimeout(hideTimer); };
    }
  }, []);

  async function submitForm(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setFormState('sending');
    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const body = new URLSearchParams();
      formData.forEach((value, key) => body.append(key, typeof value === 'string' ? value : value.name));
      const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      if (!response.ok) throw new Error('Form submission failed');
      form.reset(); setFormState('sent');
    } catch { setFormState('error'); }
  }

  return (
    <div ref={root}>
      {loading && <output className="preloader"><div><span>Z</span><span>A</span><span>U</span><span>R</span><span>A</span><span>I</span><span>Z</span></div><i /></output>}
      <div className="cursor" aria-hidden="true" />

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Zauraiz Rao, home"><span>ZR</span><small>Karachi / PK</small></a>
        <nav className="desktop-nav" aria-label="Primary navigation">{navItems.slice(0, 4).map((item) => <a key={item} href={`#${item}`}>{item}</a>)}</nav>
        <a className="nav-cta" href="#contact" data-magnetic>Let&apos;s talk <ArrowUpRight size={16} /></a>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
        <nav aria-label="Mobile navigation">{navItems.map((item, i) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{item}</a>)}</nav>
        <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
      </div>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-index" aria-hidden="true">00 / PORTFOLIO</div>
          <div className="hero-title-wrap">
            <p className="eyebrow hero-kicker">Full-Stack Web Developer <i /> Custom WordPress Developer</p>
            <h1 id="hero-heading">
              <span className="hero-line"><span className="hero-word">Zauraiz</span></span>
              <span className="hero-name-row hero-line"><span className="hero-word">Rao</span> <em>builds for</em></span>
              <span className="hero-line"><span className="hero-word">the real web.</span></span>
            </h1>
          </div>
          <div className="hero-bottom">
            <div className="portrait-frame"><div className="portrait-offset" aria-hidden="true" /><Image src="/images/zauraiz-rao.png" alt="Portrait of Zauraiz Rao" width={360} height={360} priority sizes="(max-width: 600px) 84px, 136px" /><span>{portfolio.availability}</span></div>
            <div className="hero-intro"><p>I build practical web products and business applications—and stay for the long-term support that keeps them useful.</p><div className="hero-actions"><a className="primary-button" href="#projects" data-magnetic>View selected work <ArrowDownRight size={18} /></a><a className="text-link" href={`mailto:${portfolio.email}`}>Contact me</a></div></div>
            <div className="hero-meta"><p>Working remotely from<br />Karachi, Pakistan</p><div className="socials" aria-label="Social links"><a href={portfolio.github} target="_blank" rel="noreferrer" aria-label="GitHub">GH</a><a href={portfolio.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">IN</a></div></div>
          </div>
        </section>

        <div className="role-strip" aria-label="Specialties"><div className="role-track">{[0, 1].map((copy) => <div className="role-set" key={copy}><span>React & Node.js</span><b>✦</b><span>Custom WordPress</span><b>✦</b><span>Shopify Development</span><b>✦</b><span>Long-term Support</span><b>✦</b></div>)}</div></div>

        <section id="about" className="about section-pad">
          <div className="section-label" data-reveal><span>01</span><p>About</p></div>
          <div className="about-copy"><p className="display-copy" data-reveal>Useful digital work,<br /><em>made with care.</em></p><div className="about-details" data-reveal><p>{portfolio.intro}</p><p>From custom WordPress and PHP builds to React applications and Shopify stores, the focus stays the same: clean interfaces, sound engineering, and dependable support after launch.</p></div></div>
          <div className="about-facts" data-reveal><div><small>Based in</small><strong>{portfolio.location}</strong></div><div><small>Languages</small><strong>English / Urdu</strong></div><div><small>Now</small><strong>Remote contract work</strong></div></div>
          <div className="stats" aria-label="Portfolio facts"><div><strong data-count="3">03</strong><span>Real roles</span></div><div><strong data-count="5">05</strong><span>Selected projects</span></div><div><strong data-count="12">12</strong><span>Listed technologies</span></div></div>
        </section>

        <section id="experience" className="experience section-pad ink-section">
          <div className="section-label light" data-reveal><span>02</span><p>Experience</p></div>
          <div className="section-heading" data-reveal><p>Selected history</p><h2>Hands-on work,<br /><em>across the stack.</em></h2></div>
          <div className="experience-list">{portfolio.experience.map((job, index) => <article className="experience-item" key={job.company}><div className="experience-number">0{index + 1}</div><div><p className="experience-date">{job.date} · {job.location}</p><h3>{job.role}</h3><h4>{job.company}</h4></div><div className="experience-description"><p>{job.summary}</p>{job.achievements.length > 0 && <ul>{job.achievements.map((item) => <li key={item}>{item}</li>)}</ul>}</div></article>)}</div>
        </section>

        <section id="skills" className="skills section-pad">
          <div className="section-label" data-reveal><span>03</span><p>Capabilities</p></div>
          <div className="skills-layout"><div className="section-heading" data-reveal><p>What I work with</p><h2>A practical<br /><em>toolkit.</em></h2></div><div className="skill-cloud">{Object.entries(portfolio.skills).map(([group, skills]) => <div className="skill-group" key={group}><h3>{group}</h3><div>{skills.map((skill) => <span className="skill-pill" key={skill}>{skill}</span>)}</div></div>)}</div></div>
        </section>

        <section id="projects" className="projects-pin">
          <div className="projects-intro"><div className="section-label light"><span>04</span><p>Selected work</p></div><h2>Five builds.<br /><em>Five real briefs.</em></h2><p>Scroll to explore</p></div>
          <div className="project-track">{portfolio.projects.map((project) => <article className={`project-card ${project.color}`} key={project.title}><div className="project-top"><span>{project.number}</span><span>{'date' in project ? project.date : 'Selected project'}</span></div><div><p>{project.category}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p></div>{'url' in project ? <a href={project.url} target="_blank" rel="noreferrer" data-magnetic>Visit live site <ArrowUpRight /></a> : <span className="project-note">{project.note}</span>}</article>)}</div>
        </section>

        <section id="certificates" className="credentials section-pad">
          <div className="section-label" data-reveal><span>05</span><p>Credentials</p></div>
          <div className="credential-grid"><article data-reveal><div className="credential-icon"><Check /></div><p>Certificate · {portfolio.certificate.date}</p><h2>{portfolio.certificate.title}</h2><h3>{portfolio.certificate.issuer}</h3><p>{portfolio.certificate.description}</p></article><article id="education" data-reveal><p>Education · {portfolio.education.date}</p><h2>{portfolio.education.degree}</h2><h3>{portfolio.education.school}</h3><p>{portfolio.education.location} · {portfolio.education.detail}</p></article></div>
          <div className="language-row" data-reveal>{portfolio.languages.map((language) => <div key={language.name}><strong>{language.name}</strong><span>{language.level}</span></div>)}</div>
        </section>

        <section id="contact" className="contact section-pad">
          <div className="section-label light" data-reveal><span>06</span><p>Contact</p></div>
          <div className="contact-grid"><div className="contact-intro" data-reveal><p>Have a useful idea?</p><h2>Let&apos;s make it<br /><em>work online.</em></h2><div className="contact-links"><a href={`mailto:${portfolio.email}`}><Mail />{portfolio.email}</a><a href={`tel:${portfolio.phone.replace(/\s/g, '')}`}><Phone />{portfolio.phone}</a><span><MapPin />{portfolio.location}</span></div></div><form name="contact" method="POST" data-netlify="true" onSubmit={submitForm} data-reveal><input type="hidden" name="form-name" value="contact" /><p className="hidden-field"><label>Do not fill this out: <input name="bot-field" /></label></p><label><span>Your name</span><input name="name" type="text" autoComplete="name" required placeholder="How should I address you?" /></label><label><span>Email address</span><input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label><label><span>What are you building?</span><textarea name="message" rows={4} required placeholder="A short note about your project, goals, and timeline." /></label><button type="submit" disabled={formState === 'sending'} data-magnetic>{formState === 'sending' ? 'Sending…' : 'Send project note'} <ArrowUpRight /></button><div className="form-status" aria-live="polite">{formState === 'sent' && 'Thanks — your note is on its way.'}{formState === 'error' && <>The form could not send here. Please <a href={`mailto:${portfolio.email}`}>email me directly</a>.</>}</div></form></div>
        </section>
      </main>

      <footer><a className="wordmark" href="#top"><span>ZR</span></a><p>© {new Date().getFullYear()} Zauraiz Rao</p><div><a href={portfolio.github} target="_blank" rel="noreferrer">GitHub</a><a href={portfolio.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href="#top">Back to top ↑</a></div></footer>
    </div>
  );
}
