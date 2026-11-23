// ===== MAIN JS =====
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      nav.classList.toggle('open');
    });
    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        nav.classList.remove('open');
      });
    });
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // Counter animation
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const origHtml = btn ? btn.innerHTML : '';
      if (btn) {
        btn.innerHTML = 'Sending... ⏳';
        btn.disabled = true;
      }

      const serviceSelect = document.getElementById('service');
      const serviceName = serviceSelect && serviceSelect.selectedIndex >= 0 
        ? serviceSelect.options[serviceSelect.selectedIndex].text 
        : 'General Enquiry';

      const entry = {
        id: 'msg_' + Date.now(),
        date: new Date().toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        firstName: document.getElementById('firstName')?.value.trim() || '',
        lastName: document.getElementById('lastName')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        company: document.getElementById('company')?.value.trim() || 'Individual',
        service: serviceName,
        message: document.getElementById('message')?.value.trim() || ''
      };

      // 1. Save locally for Admin Portal
      try {
        const stored = JSON.parse(localStorage.getItem('sprout_wfs_messages') || '[]');
        stored.unshift(entry);
        localStorage.setItem('sprout_wfs_messages', JSON.stringify(stored));
      } catch (err) {
        console.warn('Storage save error:', err);
      }

      // 2. If access_key is set, forward to Web3Forms
      const accessKey = document.getElementById('formAccessKey')?.value?.trim();
      if (accessKey) {
        try {
          const formData = new FormData(contactForm);
          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });
        } catch (err) {
          console.warn('Email gateway send error:', err);
        }
      }

      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      contactForm.reset();
      if (btn) {
        btn.innerHTML = origHtml;
        btn.disabled = false;
      }
    });
  }
});

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target + suffix;
  }
  requestAnimationFrame(update);
}

function showToast(message, type = '') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast' + (type ? ' ' + type : '');
  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  });
}
