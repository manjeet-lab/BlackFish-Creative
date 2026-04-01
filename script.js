/* ================================================
   BlackFish Creative — Main JavaScript
   GSAP Animations + UI Interactions
   ================================================ */

/* ---------- Navbar Scroll ---------- */
const navbar = document.querySelector('.navbar');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ---------- Hamburger / Mobile Menu ---------- */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
  document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---------- Active Nav Link ---------- */
(function setActiveLink() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === filename || (filename === '' && href === 'index.html') ||
        (filename === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ================================================
   THEME TOGGLE — Vanilla JS
   Uses localStorage to persist preference
   ================================================ */

/* --- Update moon / sun icon visibility --- */
function updateThemeIcon(isLight) {
  document.querySelectorAll('.icon-moon').forEach(el => {
    el.style.display = isLight ? 'none' : 'block';
  });
  document.querySelectorAll('.icon-sun').forEach(el => {
    el.style.display = isLight ? 'block' : 'none';
  });
}

/* --- Apply saved theme on page load (runs immediately) --- */
(function initTheme() {
  const saved = localStorage.getItem('bfc-theme');
  if (saved === 'light') {
    document.body.classList.add('light-mode');
    updateThemeIcon(true);
  }
})();

/* --- Toggle theme on button click --- */
document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('bfc-theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
  });
});

/* ---------- Custom Cursor (desktop only) ---------- */
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorRing);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
}

/* ---------- Back to Top ---------- */
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Toast Notification ---------- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---------- Filter Buttons (Shop) ---------- */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ---------- Size Selection (Product) ---------- */
document.querySelectorAll('.size-btn:not(.unavailable)').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

/* ---------- Gallery Thumbs (Product) ---------- */
document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
  thumb.addEventListener('click', () => {
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    const main = document.querySelector('.gallery-main img');
    const src = thumb.querySelector('img')?.src;
    if (main && src) {
      gsap?.to(main, { opacity: 0, duration: 0.2, onComplete: () => {
        main.src = src;
        gsap.to(main, { opacity: 1, duration: 0.2 });
      }});
    }
  });
});

/* ---------- Add to Cart Button ---------- */
document.querySelector('.add-to-cart')?.addEventListener('click', function() {
  const selected = document.querySelector('.size-btn.selected');
  if (!selected) {
    showToast('Please select a size');
    return;
  }
  const name = document.querySelector('.product-info-name')?.textContent || 'Item';
  showToast(`${name} added to cart`);
});

/* ---------- Contact Form ---------- */
const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', function(e) {
  e.preventDefault();
  const success = document.querySelector('.form-success');
  if (success) {
    contactForm.style.display = 'none';
    success.style.display = 'block';
    gsap?.fromTo(success, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
  }
});

/* ---------- Countdown Timer ---------- */
(function initCountdown() {
  const hoursEl   = document.getElementById('timer-hours');
  const minsEl    = document.getElementById('timer-mins');
  const secsEl    = document.getElementById('timer-secs');

  if (!hoursEl && !minsEl && !secsEl) return;

  // Set drop end: 72 hours from page load
  const dropEnd = Date.now() + 72 * 60 * 60 * 1000;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = Math.max(0, dropEnd - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (hoursEl) hoursEl.textContent = pad(h);
    if (minsEl)  minsEl.textContent  = pad(m);
    if (secsEl)  secsEl.textContent  = pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ================================================
   GSAP ANIMATIONS
   ================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* Guard: GSAP may not load if offline */
  if (typeof gsap === 'undefined') return;

  /* ---------- Register ScrollTrigger ---------- */
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- Hero Animations (index.html) ---------- */
  const heroLines = document.querySelectorAll('.hero-title .line span');
  if (heroLines.length) {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.hero-eyebrow', { y: 24, opacity: 0, duration: 0.8 })
      .from(heroLines, {
        y: '110%',
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out'
      }, '-=0.4')
      .from('.hero-tagline', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-actions > *', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12
      }, '-=0.5')
      .from('.hero-scroll', { opacity: 0, y: 10, duration: 0.6 }, '-=0.3');
  }

  /* ---------- Page Hero (inner pages) ---------- */
  const pageHeroTitle = document.querySelector('.page-hero-title');
  if (pageHeroTitle) {
    gsap.from(pageHeroTitle, { y: 40, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.2 });
    gsap.from('.page-hero .section-label', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
    gsap.from('.page-hero-sub', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 });
  }

  /* ---------- Scroll-triggered Reveals ---------- */
  if (typeof ScrollTrigger !== 'undefined') {

    /* Generic reveal elements */
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    /* Product cards stagger */
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length) {
      gsap.from(productCards, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.products-grid, .shop-grid',
          start: 'top 85%',
          once: true
        }
      });
    }

    /* Section titles */
    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true
        }
      });
    });

    /* Drop section parallax */
    const dropBg = document.querySelector('.drop-bg-text');
    if (dropBg) {
      gsap.to(dropBg, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: '.drop-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    /* About home image parallax */
    const aboutImg = document.querySelector('.about-home-img img');
    if (aboutImg) {
      gsap.to(aboutImg, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-home',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    /* Footer fade in */
    gsap.from('.footer', {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 95%',
        once: true
      }
    });

    /* Value cards stagger */
    const valueCards = document.querySelectorAll('.value-card');
    if (valueCards.length) {
      gsap.from(valueCards, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.values-grid',
          start: 'top 85%',
          once: true
        }
      });
    }

    /* Timer reveal */
    const timer = document.querySelector('.drop-timer');
    if (timer) {
      gsap.from('.timer-block', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: timer,
          start: 'top 85%',
          once: true
        }
      });
    }

    /* About manifesto */
    const manifesto = document.querySelector('.about-manifesto blockquote');
    if (manifesto) {
      gsap.from(manifesto, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: manifesto,
          start: 'top 88%',
          once: true
        }
      });
    }

    /* Product page image */
    const galleryMain = document.querySelector('.gallery-main');
    if (galleryMain) {
      gsap.from(galleryMain, { x: -40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
      gsap.from('.product-info > *', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.3
      });
    }

    /* Contact info items */
    gsap.utils.toArray('.contact-detail-item').forEach((el, i) => {
      gsap.from(el, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.2 + i * 0.1,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true
        }
      });
    });

    /* Form fields */
    gsap.utils.toArray('.form-group').forEach((el, i) => {
      gsap.from(el, {
        x: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.3 + i * 0.07,
        scrollTrigger: {
          trigger: '.contact-form',
          start: 'top 85%',
          once: true
        }
      });
    });
  }

  /* ---------- CTA Glow Pulse (hero button) ---------- */
  const btnPrimary = document.querySelector('.hero-actions .btn-primary');
  if (btnPrimary) {
    gsap.to(btnPrimary, {
      boxShadow: '0 0 30px rgba(255,255,255,0.25)',
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }

});
