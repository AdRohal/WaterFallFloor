/* ======================================================
   AquaFalls Park — Main App Logic
   Navigation, scroll effects, reveal animations
   ====================================================== */

(function () {
  // ---- Initialize Lucide icons ----
  if (window.lucide) {
    lucide.createIcons();
  }

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---- Mobile menu toggle ----
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksContainer = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (navLinksContainer.classList.contains('open')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
    });

    // Close menu when a link is clicked
    navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
      });
    });
  }

  // ---- Scroll reveal animations ----
  const revealElements = document.querySelectorAll(
    '.experience-card, .gallery-item, .ticket-card, .testimonial-card, .contact-wrapper, .digital-ticket, .section-header'
  );

  revealElements.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ---- Smooth scroll for CTA buttons ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Book Now nav button → scroll to tickets ----
  const navCtaBtn = document.querySelector('.nav-cta');
  if (navCtaBtn) {
    navCtaBtn.addEventListener('click', () => {
      const ticketsSection = document.getElementById('tickets');
      if (ticketsSection) {
        ticketsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ---- Ticket select button feedback ----
  document.querySelectorAll('.ticket-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.ticket-card');
      const tierName = card.querySelector('.ticket-tier span').textContent;
      btn.textContent = '✓ Selected!';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        btn.innerHTML = '<i data-lucide="shopping-cart" class="btn-icon"></i> Select Pass';
        btn.style.pointerEvents = '';
        lucide.createIcons();
      }, 2000);
    });
  });

  // ---- Parallax tilt on hero image ----
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    document.addEventListener('mousemove', (e) => {
      const rect = heroImage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      heroImage.style.transform = `perspective(800px) rotateY(${deltaX * 4}deg) rotateX(${-deltaY * 4}deg)`;
    });
  }

  // ---- Contact form submit feedback ----
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      btn.innerHTML = '<i data-lucide="check" class="btn-icon"></i> Inquiry Sent!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
      lucide.createIcons();

      setTimeout(() => {
        btn.innerHTML = '<i data-lucide="send" class="btn-icon"></i> Send Inquiry';
        btn.style.background = '';
        contactForm.reset();
        lucide.createIcons();
      }, 3000);
    });
  }

  // ---- Stagger reveal for grid items ----
  const staggerContainers = document.querySelectorAll(
    '.experience-grid, .tickets-grid, .testimonials-grid, .gallery-grid'
  );

  staggerContainers.forEach((container) => {
    const items = container.children;
    Array.from(items).forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  // ---- Gallery fullscreen lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();
