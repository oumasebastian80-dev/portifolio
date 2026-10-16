import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Scene from './components/Scene.jsx';
import { Mark } from './components/Logo3D.jsx';
import { projects, siteConfig, skillGroups } from './data/siteConfig.js';

function ArrowIcon({ diagonal = true }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      {diagonal ? <path d="M7 17 17 7M8 7h9v9" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}

function ProjectPreview({ kind }) {
  if (kind === 'store') {
    return (
      <div className="preview preview-store" aria-hidden="true">
        <div className="mock-top"><span className="mock-brand">ST<span>.</span></span><span className="mock-menu">SHOP&nbsp;&nbsp; ABOUT&nbsp;&nbsp; ↗</span></div>
        <div className="mock-store-hero"><span>THE EVERYDAY EDIT</span><strong>Find your<br />next favourite.</strong><div className="mock-pill">Explore collection&nbsp; ↗</div></div>
        <div className="mock-products"><i /><i /><i /></div>
      </div>
    );
  }
  if (kind === 'learning') {
    return (
      <div className="preview preview-learning" aria-hidden="true">
        <div className="learning-sidebar"><b>comp<span>tech</span></b><i /><i /><i /><i /><i /></div>
        <div className="learning-main"><small>YOUR LEARNING SPACE</small><b>Keep building<br />your knowledge.</b><div className="learning-progress"><span /></div><div className="learning-courses"><i /><i /></div></div>
      </div>
    );
  }
  if (kind === 'bot') {
    return (
      <div className="preview preview-bot" aria-hidden="true">
        <div className="chat-head"><span className="bot-avatar">S</span><div><b>StudentBot</b><small>Learning assistant</small></div><span className="online-dot" /></div>
        <div className="chat-bubble incoming">Hey! Can you explain JavaScript functions?</div>
        <div className="chat-bubble outgoing">@studentbot explain functions with an example</div>
        <div className="chat-bubble incoming reply"><b>Let's break it down.</b><span>A function is a reusable block of code...</span><i /><i /></div>
      </div>
    );
  }
  return (
    <div className="preview preview-terminal" aria-hidden="true">
      <div className="terminal-bar"><i /><i /><i /><span>simulated-terminal</span></div>
      <div className="terminal-content"><p><em>sebastian@learn</em>:~$ git status</p><span>On branch main</span><span>Changes ready to be reviewed.</span><p><em>sebastian@learn</em>:~$ <b>_</b></p></div>
    </div>
  );
}

function Tilt({ children, className = '', max = 6 }) {
  const move = (e) => {
    if (!window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${x * max * 2}deg`);
    el.style.setProperty('--rx', `${-y * max * 2}deg`);
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };
  const reset = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };
  return <div className={`tilt ${className}`} onPointerMove={move} onPointerLeave={reset}>{children}</div>;
}

/** Shows the project's screenshots/videos when provided in siteConfig, otherwise the built-in mock preview. */
function Media({ project }) {
  const [index, setIndex] = useState(0);
  const items = project.media || [];
  if (!items.length) return <ProjectPreview kind={project.kind} />;
  const item = items[index];
  return (
    <div className="media">
      <div className="media-frame">
        {item.type === 'video'
          ? <video key={item.src} src={item.src} poster={item.poster} controls muted loop playsInline preload="metadata" />
          : <img key={item.src} src={item.src} alt={item.alt || `${project.name} screenshot ${index + 1}`} loading="lazy" />}
      </div>
      {items.length > 1 && (
        <div className="thumbs">
          {items.map((m, n) => <button key={m.src} type="button" aria-label={`Show ${m.type} ${n + 1}`} aria-pressed={n === index} className={n === index ? 'on' : ''} onClick={() => setIndex(n)}>{m.type === 'video' ? '▶' : n + 1}</button>)}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <Tilt className="card">
      <div className="card-media"><Media project={project} /></div>
      <div className="card-copy">
        <div className="meta"><span>{project.number} / {project.type}</span><span className="status"><i />{project.status}</span></div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <ul className="tags" aria-label="Technologies used">{project.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        <div className="links">
          {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo <ArrowIcon /></a>}
          {!project.demo && <span className="muted">Details on request</span>}
        </div>
      </div>
    </Tilt>
  );
}

function ProjectDeck({ projects }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const deckRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const scrollDistanceRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    let frame = 0;
    const updatePosition = () => {
      frame = 0;
      const section = sectionRef.current;
      const pin = pinRef.current;
      const deck = deckRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !pin || !deck || !viewport || !track) return;

      if (window.matchMedia('(max-width: 860px)').matches) {
        track.style.setProperty('--work-offset', '0px');
        deck.classList.toggle('has-overflow-left', viewport.scrollLeft > 1);
        deck.classList.toggle('has-overflow-right', viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1);
        const slides = [...track.children];
        const nearestIndex = slides.reduce((nearest, slide, index) => (
          Math.abs(slide.offsetLeft - viewport.scrollLeft) < Math.abs(slides[nearest].offsetLeft - viewport.scrollLeft)
            ? index
            : nearest
        ), 0);
        setActiveIndex((currentIndex) => currentIndex === nearestIndex ? currentIndex : nearestIndex);
        return;
      }

      const stickyTop = Number.parseFloat(window.getComputedStyle(pin).top) || 0;
      const scrollDistance = scrollDistanceRef.current;
      const sectionStart = window.scrollY + section.getBoundingClientRect().top - stickyTop;
      const progress = Math.min(1, Math.max(
        0,
        scrollDistance ? (window.scrollY - sectionStart) / scrollDistance : 0,
      ));
      track.style.setProperty('--work-offset', `${-progress * scrollDistance}px`);

      const nextIndex = Math.round(progress * Math.max(0, projects.length - 1));
      setActiveIndex((currentIndex) => currentIndex === nextIndex ? currentIndex : nextIndex);
    };
    const schedulePositionUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updatePosition);
    };

    const measureTrack = () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      const deck = deckRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !pin || !deck || !viewport || !track) return;

      if (window.matchMedia('(max-width: 860px)').matches) {
        scrollDistanceRef.current = 0;
        section.style.height = '';
        schedulePositionUpdate();
        return;
      }

      deck.classList.remove('has-overflow-left', 'has-overflow-right');
      scrollDistanceRef.current = Math.max(0, track.scrollWidth - viewport.clientWidth);
      section.style.height = `${pin.offsetHeight + scrollDistanceRef.current}px`;
      schedulePositionUpdate();
    };

    measureTrack();
    const resizeObserver = new ResizeObserver(measureTrack);
    if (deckRef.current) resizeObserver.observe(deckRef.current);
    if (pinRef.current) resizeObserver.observe(pinRef.current);
    window.addEventListener('scroll', schedulePositionUpdate, { passive: true });
    window.addEventListener('resize', measureTrack, { passive: true });
    viewportRef.current?.addEventListener('scroll', schedulePositionUpdate, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedulePositionUpdate);
      window.removeEventListener('resize', measureTrack);
      viewportRef.current?.removeEventListener('scroll', schedulePositionUpdate);
    };
  }, [projects.length]);

  return (
    <section
      className="work-section"
      id="work"
      data-s="1"
      ref={sectionRef}
    >
      <div className="work-pin wrap" ref={pinRef}>
        <div className="work-deck" ref={deckRef} aria-label="Selected projects">
          <div className="work-track-viewport" ref={viewportRef}>
            <div className="work-track" ref={trackRef}>
              {projects.map((project, index) => {
                const active = index === activeIndex;
                return (
                  <div
                    className="project-slide"
                    key={project.name}
                    aria-hidden={!active}
                    inert={!active}
                  >
                    <ProjectCard project={project} />
                  </div>
                );
              })}
            </div>
          </div>
          <p className="work-counter" aria-live="polite">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span>
            <span aria-hidden="true"> / </span>
            {String(projects.length).padStart(2, '0')}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Headline whose words rise out of a mask when it scrolls into view. */
function Words({ text, em = '', as: Tag = 'h2' }) {
  const words = [...text.split(' ').map((w) => [w, false]), ...em.split(' ').filter(Boolean).map((w) => [w, true])];
  return (
    <Tag className="words" aria-label={`${text} ${em}`.trim()}>
      {words.map(([w, accent], i) => [<span className={`w${accent ? ' em' : ''}`} key={`${w}-${i}`} aria-hidden="true"><span style={{ '--i': i }}>{w}</span></span>, ' '])}
    </Tag>
  );
}

/** Scroll behaviour: reveal classes, active section (drives the 3D scene) and page progress. */
function useSite() {
  useEffect(() => {
    const root = document.documentElement;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveal = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
    }), { threshold: 0.15 });
    const skills = document.querySelector('.skills');
    const revealSkills = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-shown');
        revealSkills.disconnect();
      }
    }), { threshold: 0.2 });
    if (skills) revealSkills.observe(skills);
    document.querySelectorAll('.reveal, .words').forEach((el) => (calm ? el.classList.add('in') : reveal.observe(el)));
    const sections = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) root.dataset.section = e.target.dataset.s;
    }), { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('[data-s]').forEach((el) => sections.observe(el));
    const progress = () => root.style.setProperty('--p', (window.scrollY / Math.max(1, root.scrollHeight - window.innerHeight)).toFixed(4));
    progress();
    window.addEventListener('scroll', progress, { passive: true });
    return () => {
      reveal.disconnect();
      revealSkills.disconnect();
      sections.disconnect();
      window.removeEventListener('scroll', progress);
    };
  }, []);
}

function App() {
  useSite();
  return (
    <div className="app-shell">
      <Scene />
      <div className="scene-wash" aria-hidden="true" />
      <div className="progress" aria-hidden="true" />
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label={`${siteConfig.brand}, home`}><Mark /><span>{siteConfig.brand}</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="#work">Work</a><a href="#skills">Skills</a><a href="#contact">Contact</a>
          <a className="nav-cta" href="#contact">Let&apos;s talk <ArrowIcon /></a>
        </nav>
      </header>

      <main id="main">
        <section className="hero wrap" id="top" data-s="0">
          <div className="hero-copy">
            <h1 className="reveal" style={{ '--n': 1 }}>Have an idea? <span>Let&apos;s turn it into reality.</span></h1>
            <p className="lead reveal" style={{ '--n': 2 }}>I&apos;m {siteConfig.name}, a full-stack developer helping businesses turn ideas into powerful digital products. From e-commerce websites and learning platforms to custom web applications and automation systems, I build solutions designed around real needs.</p>
            <p className="lead hero-promise reveal" style={{ '--n': 3 }}><strong>From design to deployment, let&apos;s build something that moves your business forward.</strong></p>
            <div className="actions reveal" style={{ '--n': 4 }}>
              <a className="btn" href="#work">View my work <ArrowIcon /></a>
              <a className="btn btn-pri" href="#contact">Start a Project <ArrowIcon /></a>
            </div>
          </div>
        </section>

        <ProjectDeck projects={projects} />

        <section className="sec wrap" id="skills" data-s="2">
          <svg className="skill-filters" aria-hidden="true">
            <filter id="skill-bump" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence result="texture" numOctaves="3" baseFrequency=".7" type="fractalNoise" />
              <feSpecularLighting in="texture" result="shine" lightingColor="#fffffc" specularExponent="25" specularConstant=".55" surfaceScale=".5">
                <fePointLight x="100" y="100" z="180" />
              </feSpecularLighting>
              <feComposite in="shine" in2="SourceGraphic" operator="in" result="surface" />
              <feBlend in="SourceGraphic" in2="surface" mode="screen" />
            </filter>
          </svg>
          <p className="eyebrow reveal">What I bring</p>
          <Words text="What I Bring to" em="Your Project" />
          <p className="lead skills-intro reveal">From the first interaction to the systems running behind the scenes, I bring the skills needed to turn ideas into functional, reliable digital products.</p>
          <div className="skills-scroller">
            <div className="skills">
              {skillGroups.map((g) => (
                <div className="reveal" key={g.title}>
                  <Tilt className="skill">
                    <span className="skill-ticket" aria-hidden="true" />
                    <h3>{g.title}</h3>
                    <p className="skill-tagline"><strong>{g.tagline}</strong></p>
                    <p>{g.intro}</p>
                    <ul>{g.skills.map((s) => <li key={s}>{s}</li>)}</ul>
                  </Tilt>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact" id="contact" data-s="3">
          <div className="wrap contact-grid">
            <div>
              <p className="eyebrow reveal">Contact</p>
              <Words text="Have a project in mind?" em="Let's talk." />
              <p className="lead reveal">Tell me what you want to build. I&apos;ll reply with how I&apos;d approach it.</p>
              <div className="actions reveal">
                <a className="btn btn-pri" href={`mailto:${siteConfig.email}`}>{siteConfig.email} <ArrowIcon /></a>
                <a className="btn" href={`tel:${siteConfig.phone}`}>{siteConfig.phone} <ArrowIcon /></a>
                <a className="btn" href={`https://wa.me/${siteConfig.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp <ArrowIcon /></a>
                {siteConfig.linkedin && <a className="btn" href={siteConfig.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowIcon /></a>}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#top" aria-label="Back to top"><Mark /><span>{siteConfig.brand}</span></a>
        <span>© {new Date().getFullYear()} {siteConfig.name}</span>
      </footer>
    </div>
  );
}

export default App;
