/* ═══════════════════════════════════════════════════════════
   REPLASMAR — Scripts interactivos
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. NAVBAR — scroll effect + hamburger ────────────────
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    toggleScrollTop();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  // ─── 2. HERO PARTICLES ───────────────────────────────────
  const particlesContainer = document.getElementById('particles');

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 6 + 2;
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    particlesContainer.appendChild(particle);
  }

  for (let i = 0; i < 30; i++) createParticle();


  // ─── 3. ANIMATED COUNTERS ────────────────────────────────
  function animateCounter(el, target, duration = 2000) {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('es');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Use IntersectionObserver to trigger counters when visible
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.target, 10);
        animateCounter(entry.target, target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.counter, .stat-num[data-target]').forEach(el => {
    counterObserver.observe(el);
  });


  // ─── 4. FADE-IN ON SCROLL ────────────────────────────────
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
        let delay = 0;
        siblings.forEach((sib, i) => {
          if (sib === entry.target) delay = i * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));


  // ─── 5. TESTIMONIALS CAROUSEL ────────────────────────────
  const track  = document.getElementById('testimonialsTrack');
  const dots   = document.querySelectorAll('.dot');
  const prev   = document.getElementById('prevBtn');
  const next   = document.getElementById('nextBtn');
  let current  = 0;
  const total  = document.querySelectorAll('.testimonial-card').length;
  let autoPlay;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function startAutoplay() {
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAutoplay() {
    clearInterval(autoPlay);
  }

  prev.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
  next.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); });
  });

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      stopAutoplay();
      goTo(current + (diff > 0 ? 1 : -1));
      startAutoplay();
    }
  });

  startAutoplay();


  // ─── 6. PRODUCT FILTERS ──────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .3s ease, transform .3s ease';
            card.style.opacity   = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.transition = 'opacity .2s ease';
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });


  // ─── 7. CONTACT FORM ─────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn   = document.getElementById('submitBtn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    let valid = true;
    contactForm.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ef5350';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Simulate sending
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    setTimeout(() => {
      submitBtn.style.display = 'none';
      formSuccess.classList.add('show');
      contactForm.reset();
    }, 1800);
  });


  // ─── 8. NEWSLETTER FORM ───────────────────────────────���──
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const btn   = newsletterForm.querySelector('button');
    if (!input.value.trim()) return;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = 'var(--green-light)';
    input.value = '';
    input.placeholder = '¡Suscrito! Gracias.';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
      btn.style.background = '';
      input.placeholder = 'tu@email.com';
    }, 3000);
  });


  // ─── 9. SCROLL TO TOP ────────────────────────────────────
  const scrollTopBtn = document.getElementById('scrollTop');

  function toggleScrollTop() {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ─── 10. ACTIVE NAV LINKS on scroll ──────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinksAll.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));


  // ─── 11. LIVE IMPACT COUNTER (simulated) ─────────────────
  // Slowly increment the plastic counter to simulate live data
  const liveCounters = document.querySelectorAll('.counter[data-target="48500"]');
  let liveVal = 48500;

  setInterval(() => {
    liveVal += Math.floor(Math.random() * 3);
    liveCounters.forEach(el => {
      if (el.dataset.counted === 'true') {
        el.textContent = liveVal.toLocaleString('es');
      }
    });
  }, 4500);


  // ─── 12. SMOOTH SCROLL for anchor links ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
