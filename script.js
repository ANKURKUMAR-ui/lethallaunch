/* ============================================
   LETHALLAUNCH.COM — Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initRatingBars();
  initCounters();
  initFAQ();
  initParticles();
});

/* ---------- Navbar Scroll Effect ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const affiliateBar = document.getElementById('affiliate-bar');
  if (!navbar) return;

  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.style.top = '0';
      if (affiliateBar) affiliateBar.style.transform = 'translateY(-100%)';
    } else {
      navbar.classList.remove('scrolled');
      navbar.style.top = '33px';
      if (affiliateBar) affiliateBar.style.transform = 'translateY(0)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (!btn || !navLinks) return;

  btn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    btn.classList.toggle('active');
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ---------- Smooth Scrolling ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const offset = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    });
  });
}

/* ---------- Scroll-Triggered Animations ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .slide-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ---------- Rating Bar Animation ---------- */
function initRatingBars() {
  const bars = document.querySelectorAll('.rating-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-width');
        entry.target.style.width = targetWidth;
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  bars.forEach(bar => observer.observe(bar));
}

/* ---------- Animated Counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const isDecimal = el.getAttribute('data-decimal') === 'true';
  const duration = 2200;
  const startTime = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const currentValue = target * easedProgress;

    if (isDecimal) {
      el.textContent = currentValue.toFixed(2) + suffix;
    } else if (target >= 1000000) {
      el.textContent = formatLargeNumber(Math.floor(currentValue)) + suffix;
    } else {
      el.textContent = Math.floor(currentValue) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Ensure final value is exact
      if (isDecimal) {
        el.textContent = target.toFixed(2) + suffix;
      } else if (target >= 1000000) {
        el.textContent = formatLargeNumber(target) + suffix;
      } else {
        el.textContent = target + suffix;
      }
    }
  }

  requestAnimationFrame(update);
}

function formatLargeNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

/* ---------- FAQ Accordion ---------- */
function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const inner = answer.querySelector('.faq-answer-inner');
      const isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        if (activeItem !== item) {
          activeItem.classList.remove('active');
          const activeAnswer = activeItem.querySelector('.faq-answer');
          activeAnswer.style.maxHeight = '0';
          activeItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = inner.scrollHeight + 24 + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---------- Particle / Star Field Effect ---------- */
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas._w = w;
    canvas._h = h;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor(canvas._w * 0.08), 120);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas._w,
        y: Math.random() * canvas._h,
        radius: Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: getRandomColor()
      });
    }
  }

  function getRandomColor() {
    const colors = [
      '139, 92, 246',   // purple
      '255, 107, 53',   // orange
      '0, 212, 255',    // cyan
      '251, 191, 36',   // gold
      '244, 114, 182',  // pink
      '200, 200, 220'   // white-ish
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function draw() {
    ctx.clearRect(0, 0, canvas._w, canvas._h);

    const time = Date.now() * 0.001;

    particles.forEach((p, i) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < -10) p.x = canvas._w + 10;
      if (p.x > canvas._w + 10) p.x = -10;
      if (p.y < -10) p.y = canvas._h + 10;
      if (p.y > canvas._h + 10) p.y = -10;

      // Twinkle
      const twinkle = Math.sin(time * p.twinkleSpeed * 60 + p.twinkleOffset) * 0.5 + 0.5;
      const alpha = p.alpha * (0.4 + twinkle * 0.6);

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
      ctx.fill();

      // Draw glow for larger particles
      if (p.radius > 1.2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha * 0.15})`;
        ctx.fill();
      }

      // Connect nearby particles with lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const lineAlpha = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(draw);
  }

  // Mouse interaction
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // Gently push nearby particles
    particles.forEach(p => {
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.015;
        p.vx -= dx * force;
        p.vy -= dy * force;

        // Limit velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) {
          p.vx = (p.vx / speed) * 1.5;
          p.vy = (p.vy / speed) * 1.5;
        }
      }
    });
  });

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      createParticles();
    }, 200);
  });

  // Reduce animation when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      draw();
    }
  });

  // Init
  resize();
  createParticles();
  draw();
}
