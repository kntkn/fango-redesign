/**
 * FANGO - 空き家再生プラットフォーム
 * JavaScript - Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initCarousel();
  initScrollReveal();
  initCounters();
  initContactForm();
  initSmoothScroll();
});

/**
 * Navigation scroll effect
 */
function initNavigation() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const handleScroll = () => {
    if (window.pageYOffset > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-link-login, .mobile-link-cta');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Properties carousel
 */
function initCarousel() {
  const carousel = document.getElementById('propertiesCarousel');
  const track = carousel?.querySelector('.carousel-track');
  const cards = carousel?.querySelectorAll('.property-card');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  const dots = dotsContainer?.querySelectorAll('.dot');

  if (!carousel || !track || !cards.length) return;

  let currentIndex = 0;
  let cardWidth = 0;
  let cardsVisible = 1;

  const calculateDimensions = () => {
    const containerWidth = carousel.offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 24;

    // Determine cards visible based on viewport
    if (window.innerWidth >= 1024) {
      cardsVisible = 3;
    } else if (window.innerWidth >= 768) {
      cardsVisible = 2;
    } else {
      cardsVisible = 1;
    }

    cardWidth = (containerWidth - gap * (cardsVisible - 1)) / cardsVisible;

    // Update card widths
    cards.forEach(card => {
      card.style.flex = `0 0 ${cardWidth}px`;
    });
  };

  const updateCarousel = () => {
    const gap = parseInt(getComputedStyle(track).gap) || 24;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dots?.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  const goToSlide = (index) => {
    const maxIndex = Math.max(0, cards.length - cardsVisible);
    currentIndex = Math.min(Math.max(0, index), maxIndex);
    updateCarousel();
  };

  const goNext = () => {
    goToSlide(currentIndex + 1);
  };

  const goPrev = () => {
    goToSlide(currentIndex - 1);
  };

  // Event listeners
  prevBtn?.addEventListener('click', goPrev);
  nextBtn?.addEventListener('click', goNext);

  dots?.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      calculateDimensions();
      goToSlide(0);
    }, 200);
  });

  // Initial setup
  calculateDimensions();
  updateCarousel();
}

/**
 * Scroll reveal animation
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-header, .property-card, .why-card, .stat-item, .flow-item, .testimonial-card, .case-card, .ai-content'
  );

  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
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

/**
 * Animated counters
 */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');

  if (!counters.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    const easeOutQuad = (t) => t * (2 - t);

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const current = Math.floor(easedProgress * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
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

/**
 * Contact form handling
 */
function initContactForm() {
  const form = document.getElementById('contactForm');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;

    // Loading state
    submitBtn.textContent = '送信中...';
    submitBtn.disabled = true;

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Success state
    submitBtn.textContent = '送信完了';
    submitBtn.style.background = '#4a6741';

    // Reset form
    setTimeout(() => {
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 2000);
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const nav = document.getElementById('nav');
  const navHeight = nav ? nav.offsetHeight : 0;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}
