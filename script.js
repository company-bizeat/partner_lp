(() => {
  'use strict';

  /* Sticky header shadow on scroll */
  const header = document.getElementById('siteHeader');
  const toTop = document.getElementById('toTop');

  if (header && toTop) {
    const onScroll = () => {
      const scrolled = window.scrollY > 8;
      header.classList.toggle('is-scrolled', scrolled);
      toTop.classList.toggle('is-visible', window.scrollY > 720);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Hero visual pointer tilt (desktop, fine-pointer only) */
  const heroVisual = document.getElementById('heroVisual');
  const canTilt = window.matchMedia('(pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroVisual && canTilt) {
    const strength = 7;
    heroVisual.addEventListener('pointermove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.setProperty('--tilt-y', `${px * strength}deg`);
      heroVisual.style.setProperty('--tilt-x', `${-py * strength}deg`);
    });
    heroVisual.addEventListener('pointerleave', () => {
      heroVisual.style.setProperty('--tilt-x', '0deg');
      heroVisual.style.setProperty('--tilt-y', '0deg');
    });
  }

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  let closeMobileNav = () => {};

  if (navToggle && mobileNav) {
    closeMobileNav = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
    };

    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      mobileNav.classList.toggle('is-open', !open);
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-row').forEach((row) => {
    const question = row.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = row.classList.contains('is-open');
      row.classList.toggle('is-open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach((el) => {
    const delay = el.getAttribute('data-reveal-delay');
    if (delay) el.style.setProperty('--delay', delay);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* Smooth-scroll offset for sticky header on in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileNav();
    });
  });
})();
