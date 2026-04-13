/* =============================================
   MAHESH C I – PORTFOLIO SCRIPT
   Features: Bubble Cursor, Particles, Scroll
   Reveal, Navbar, Skill Bars, Form Handler
   ============================================= */

'use strict';

/* ─────────────────────────────────────────────
   1. UTILITY: Wait for DOM
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  initCursor();
  initParticles();
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initBackToTop();
  initFooterYear();
  initActiveNavLinks();

});

/* ─────────────────────────────────────────────
   2. BUBBLE CURSOR
───────────────────────────────────────────── */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  // Check for touch device – hide custom cursor
  if ('ontouchstart' in window) {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  /* Follow mouse */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    spawnBubble(mouseX, mouseY);
  });

  /* Smooth ring follow */
  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /* Hover state on clickables */
  const hoverTargets = 'a, button, .btn, .skill-pill, .glass-card, .project-card, .social-link-btn';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  /* Bubble trail */
  let bubbleTimer = 0;
  function spawnBubble(x, y) {
    const now = Date.now();
    if (now - bubbleTimer < 80) return; // throttle
    bubbleTimer = now;

    const size   = Math.random() * 10 + 4;
    const bubble = document.createElement('div');
    bubble.classList.add('bubble-trail');
    bubble.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(0,201,224,${Math.random() * 0.5 + 0.2}), transparent);
      border: 1px solid rgba(0,201,224,0.3);
    `;
    document.body.appendChild(bubble);

    setTimeout(() => bubble.remove(), 1200);
  }
}

/* ─────────────────────────────────────────────
   3. PARTICLE CANVAS
───────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 70;
  const COLORS = ['rgba(0,201,224,', 'rgba(26,128,229,', 'rgba(100,216,244,'];

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.r    = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.02;
      this.alpha = 0.2 + 0.4 * Math.abs(Math.sin(this.pulse));
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  /* Connect nearby particles */
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,201,224,${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(loop);
  }
  loop();
}

/* ─────────────────────────────────────────────
   4. STICKY NAVBAR WITH SCROLL EFFECTS
───────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   5. ACTIVE NAV LINK HIGHLIGHTING
───────────────────────────────────────────── */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => observer.observe(s));
}

/* ─────────────────────────────────────────────
   6. MOBILE NAVIGATION
───────────────────────────────────────────── */
function initMobileNav() {
  const hamburger    = document.getElementById('hamburger');
  const mobileNav    = document.getElementById('mobile-nav');
  const closeBtn     = document.getElementById('mobile-nav-close');
  const mobileLinks  = document.querySelectorAll('.mob-link, #mob-resume');

  if (!hamburger || !mobileNav) return;

  function openNav() {
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  closeBtn?.addEventListener('click', closeNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  /* Close on backdrop click */
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeNav();
  });

  /* Close on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeNav();
  });
}

/* ─────────────────────────────────────────────
   7. SCROLL REVEAL ANIMATIONS
───────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (!revealEls.length) return;

  // Stagger children in grids
  document.querySelectorAll('.skills-grid, .projects-grid, .achievements-grid, .certs-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────
   8. ANIMATED SKILL BARS
───────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.soft-skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bars.forEach(bar => {
          const target = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = target + '%';
          }, 200);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const barsContainer = document.getElementById('soft-skills-bars');
  if (barsContainer) observer.observe(barsContainer);
}

/* ─────────────────────────────────────────────
   9. CONTACT FORM WITH VALIDATION
───────────────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submit  = document.getElementById('contact-submit');

  if (!form) return;

  /* Simple inline validation states */
  function setError(input, msg) {
    input.style.borderColor = '#f87171';
    input.style.boxShadow   = '0 0 0 3px rgba(248,113,113,0.15)';
    // Remove any existing error
    const prev = input.parentElement.querySelector('.field-err');
    if (prev) prev.remove();
    const err = document.createElement('span');
    err.className = 'field-err';
    err.style.cssText = 'font-size:0.75rem;color:#f87171;margin-top:4px;display:block;';
    err.textContent = msg;
    input.parentElement.appendChild(err);
  }

  function clearError(input) {
    input.style.borderColor = '';
    input.style.boxShadow   = '';
    const prev = input.parentElement.querySelector('.field-err');
    if (prev) prev.remove();
  }

  ['form-name', 'form-email', 'form-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(el));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('form-name');
    const email   = document.getElementById('form-email');
    const message = document.getElementById('form-message');

    let valid = true;

    if (!name.value.trim()) {
      setError(name, 'Please enter your name.');
      valid = false;
    }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      setError(message, 'Message must be at least 10 characters.');
      valid = false;
    }

    if (!valid) return;

    /* Simulate sending */
    submit.disabled = true;
    submit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';

    setTimeout(() => {
      submit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      submit.disabled  = false;
      form.reset();

      success.style.display = 'flex';
      setTimeout(() => {
        success.style.display = 'none';
      }, 5000);
    }, 1800);
  });
}

/* ─────────────────────────────────────────────
   10. BACK TO TOP BUTTON
───────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────────────
   11. FOOTER YEAR
───────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─────────────────────────────────────────────
   12. SMOOTH SCROLL FOR ALL ANCHOR LINKS
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────────
   13. TILT EFFECT ON GLASS CARDS (subtle)
───────────────────────────────────────────── */
document.querySelectorAll('.project-card, .achievement-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const centerX = rect.width  / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) *  4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─────────────────────────────────────────────
   14. TYPING EFFECT FOR HERO TAGLINE
───────────────────────────────────────────── */
(function initTypingEffect() {
  const taglineEl = document.querySelector('.hero-tagline');
  if (!taglineEl) return;

  const phrases = [
    '"Turning Ideas into Visual Stories."',
    '"Code. Create. Inspire."',
    '"Building the Future, One Line at a Time."',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pauseEnd  = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (!deleting && charIdx <= currentPhrase.length) {
      taglineEl.textContent = currentPhrase.substring(0, charIdx);
      charIdx++;
    }

    if (!deleting && charIdx > currentPhrase.length) {
      if (!pauseEnd) {
        pauseEnd = true;
        setTimeout(() => { deleting = true; pauseEnd = false; type(); }, 2200);
        return;
      }
    }

    if (deleting && charIdx >= 0) {
      taglineEl.textContent = currentPhrase.substring(0, charIdx);
      charIdx--;
    }

    if (deleting && charIdx < 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      charIdx   = 0;
      setTimeout(type, 400);
      return;
    }

    const speed = deleting ? 40 : 70;
    setTimeout(type, speed);
  }

  // Small delay before starting
  setTimeout(type, 1000);
})();


/* ─────────────────────────────────────────────
   15. COUNTER ANIMATION FOR HERO STATS
───────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const targets = [9.3, 1, 5]; // CGPA, Projects, Skills
  const suffixes = ['', '+', '+'];
  let animated = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;

      counters.forEach((el, i) => {
        const target  = targets[i];
        const suffix  = suffixes[i];
        const isFloat = !Number.isInteger(target);
        const duration = 1400;
        const steps    = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current += increment;
          if (step >= steps) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = isFloat
            ? current.toFixed(1) + suffix
            : Math.round(current) + suffix;
        }, duration / steps);
      });
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
})();

/* ─────────────────────────────────────────────
   16. RIPPLE EFFECT ON BUTTONS
───────────────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      width:6px;height:6px;
      background:rgba(255,255,255,0.4);
      border-radius:50%;
      left:${x}px;top:${y}px;
      transform:translate(-50%,-50%) scale(0);
      animation:rippleAnim 0.55s ease-out forwards;
      pointer-events:none;
    `;

    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes rippleAnim {
          to { transform: translate(-50%,-50%) scale(40); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ─────────────────────────────────────────────
   17. PROGRESS BAR ON SCROLL (top of page)
───────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = `
    position:fixed;
    top:0;left:0;
    height:3px;
    width:0%;
    background:linear-gradient(90deg,#0e4fba,#00c9e0,#64d8f4);
    z-index:9999;
    transition:width 0.1s linear;
    pointer-events:none;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   18. GLITCH TEXT EFFECT ON LOGO (hover)
───────────────────────────────────────────── */
(function initGlitchLogo() {
  const logo = document.getElementById('nav-logo');
  if (!logo) return;

  const chars = 'MAHESH CI@#$%!';
  let interval = null;
  let originalText = logo.textContent;

  logo.addEventListener('mouseenter', () => {
    let iterations = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      logo.textContent = originalText
        .split('')
        .map((char, idx) => {
          if (idx < iterations) return originalText[idx];
          if (char === ' ') return '\u00A0';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      iterations += 0.4;
      if (iterations >= originalText.length) {
        clearInterval(interval);
        logo.textContent = originalText;
      }
    }, 40);
  });
})();

/* ─────────────────────────────────────────────
   19. IMAGE LAZY LOAD PLACEHOLDER (future use)
───────────────────────────────────────────── */
// Ready for future project images
document.querySelectorAll('img[data-src]').forEach(img => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        img.src = img.dataset.src;
        obs.unobserve(img);
      }
    });
  });
  obs.observe(img);
});

/* ─────────────────────────────────────────────
   20. CONSOLE EASTER EGG
───────────────────────────────────────────── */
console.log(
  '%c 🌊 Mahesh C I – Portfolio ',
  'background:linear-gradient(135deg,#020818,#0e4fba);color:#00c9e0;font-size:18px;font-weight:bold;padding:10px 20px;border-radius:8px;'
);
console.log(
  '%c Built with ❤️ using HTML + CSS + Vanilla JS\n📧 maheshchandrashekar179@gmail.com\n🐙 github.com/maheshchandrashekar26',
  'color:#64d8f4;font-size:13px;line-height:1.8;'
);
