

// ═══════════════════════════════════════════════════════════════════
// IEEE CS MBITS — Interactive Lifecycle & Refresh Animation Engine
// ═══════════════════════════════════════════════════════════════════

// ── Refresh / Page Load Progress Bar & Entrance Trigger ──
(function initRefreshBar() {
  const bar = document.createElement('div');
  bar.className = 'page-loader-bar';
  document.documentElement.appendChild(bar);

  let progress = 15;
  bar.style.width = progress + '%';

  const timer = setInterval(() => {
    if (progress < 85) {
      progress += Math.random() * 20;
      bar.style.width = Math.min(progress, 88) + '%';
    }
  }, 100);

  window.addEventListener('load', () => {
    clearInterval(timer);
    bar.style.width = '100%';
    setTimeout(() => {
      bar.style.opacity = '0';
      setTimeout(() => bar.remove(), 500);
    }, 300);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  // Trigger on-refresh animation classes
  document.body.classList.add('page-loaded');

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Navbar Scroll Transition
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Scroll & Refresh Reveal with Staggering
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  // Animated Numeric Counters on Load / Refresh
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          const duration = 1800;
          const startTime = performance.now();

          const updateCounter = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOutProgress * target);
            counter.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // Interactive Card Micro-Glow & 3D Tilt Effect
  const glassCards = document.querySelectorAll('.glass-card, .feature-card, .event-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < Math.min(count, 80); i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;


        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.6})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    // Pause particles when not visible
    const heroObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        cancelAnimationFrame(animationId);
      } else {
        drawParticles();
      }
    });
    heroObserver.observe(canvas.parentElement);
  }
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar').offsetHeight;
        const top = target.offsetTop - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
        // Update URL hash without jumping
        history.pushState(null, '', href);
      }
    });
  });

  // ── Active Nav Link — Scroll Spy for homepage ──
  const isHomepage = window.location.pathname.endsWith('index.html') ||
                     window.location.pathname.endsWith('/') ||
                     window.location.pathname === '' ||
                     document.querySelector('.stack-feature-hero') !== null;
  const navLinksAll = document.querySelectorAll('.nav-links a');

  if (isHomepage) {
    const sections = document.querySelectorAll('section[id]');
    const navOffset = 140;

    function updateActiveLink() {
      let currentId = 'hero';
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

      sections.forEach(section => {
        const top = section.offsetTop - navOffset;
        if (scrollPos >= top) {
          currentId = section.getAttribute('id');
        }
      });

      navLinksAll.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + currentId || (currentId === 'hero' && (href === 'index.html' || href === '#hero' || href === 'index.html#hero'))) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  } else {
    // On sub-pages, highlight current page link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinksAll.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // ── Mission Directory Event Filter Pills ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterText = btn.textContent.trim().toLowerCase();
      const eventCards = document.querySelectorAll('.events-grid .event-card');
      
      eventCards.forEach(card => {
        if (filterText === 'all') {
          card.style.display = 'flex';
        } else if (filterText === 'hackathons' && card.textContent.toLowerCase().includes('hackathon')) {
          card.style.display = 'flex';
        } else if (filterText === 'bootcamps' && (card.textContent.toLowerCase().includes('bootcamp') || card.textContent.toLowerCase().includes('workshop'))) {
          card.style.display = 'flex';
        } else if (filterText === 'speaker series' && (card.textContent.toLowerCase().includes('speaker') || card.textContent.toLowerCase().includes('talk') || card.textContent.toLowerCase().includes('duel') || card.textContent.toLowerCase().includes('codefest'))) {
          card.style.display = 'flex';
        } else {
          card.style.display = filterText === 'all' ? 'flex' : 'none';
        }
      });
    });
  });

});
