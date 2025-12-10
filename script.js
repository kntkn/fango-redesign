// ==========================================================================
// Fango - Landing Page Scripts
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Navigation scroll effect
  initNavigation();

  // Mobile menu
  initMobileMenu();

  // Scroll reveal animations
  initScrollReveal();

  // Counter animation
  initCounters();

  // Form handling
  initContactForm();

  // Smooth scroll for anchor links
  initSmoothScroll();
});

// ==========================================================================
// Navigation
// ==========================================================================
function initNavigation() {
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

// ==========================================================================
// Mobile Menu
// ==========================================================================
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-link-cta');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ==========================================================================
// Scroll Reveal
// ==========================================================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-header, .about-content, .property-card, .why-card, ' +
    '.stat-item, .flow-item, .testimonial-card, .contact-wrapper'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered animation delay
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// ==========================================================================
// Counter Animation
// ==========================================================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-value[data-target]');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // ms
  const frameDuration = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;

  const easeOutQuad = t => t * (2 - t);

  const counter = setInterval(() => {
    frame++;
    const progress = easeOutQuad(frame / totalFrames);
    const current = Math.round(target * progress);

    element.textContent = current.toLocaleString();

    if (frame === totalFrames) {
      clearInterval(counter);
      element.textContent = target.toLocaleString();
    }
  }, frameDuration);
}

// ==========================================================================
// Contact Form
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('contactForm');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = '送信中...';
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simulate API call (replace with actual endpoint)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      submitBtn.textContent = '送信完了!';
      submitBtn.style.background = 'var(--color-moss)';

      // Reset form after delay
      setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 2000);

    } catch (error) {
      // Error
      submitBtn.textContent = 'エラーが発生しました';
      submitBtn.style.background = '#c75000';

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 2000);
    }
  });
}

// ==========================================================================
// Smooth Scroll
// ==========================================================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href === '#') return;

      e.preventDefault();

      const target = document.querySelector(href);

      if (target) {
        const navHeight = document.getElementById('nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================================================
// Parallax Effect (Optional - for hero section)
// ==========================================================================
function initParallax() {
  const heroImage = document.querySelector('.hero-image');

  if (!heroImage) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;

    if (scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${rate}px)`;
    }
  });
}

// Call if needed
// initParallax();

// ==========================================================================
// Cursor Effect (Optional - for desktop)
// ==========================================================================
function initCursorEffect() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .property-card');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// Only enable on desktop
// if (window.innerWidth > 1024) initCursorEffect();
