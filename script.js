
(function () {
  const STORAGE_KEY = 'portfolio-theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.innerHTML = theme === 'dark' ? sunIcon() : moonIcon();
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function moonIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  }

  function sunIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
  }

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* storage unavailable, theme just won't persist */
    }
  }

  const saved = getStoredTheme();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getStoredTheme() || initial);

    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        setStoredTheme(next);
      });
    }
  });
})();
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const el = document.querySelector('[data-typing]');
    if (!el) return;

    const fullText = el.getAttribute('data-typing');
    const prompt = '<span class="prompt">$</span> ';
    el.innerHTML = prompt + '<span class="type-text"></span><span class="type-cursor">&nbsp;</span>';
    const target = el.querySelector('.type-text');

    let i = 0;
    const speed = 32;

    function tick() {
      if (i <= fullText.length) {
        target.textContent = fullText.slice(0, i);
        i++;
        setTimeout(tick, speed);
      }
    }

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      target.textContent = fullText;
    } else {
      tick();
    }
  });
})();

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const stats = document.querySelectorAll('.stat .num[data-count]');
    if (!stats.length) return;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCount(el) {
      const raw = el.getAttribute('data-count');
      const suffix = el.getAttribute('data-suffix') || '';
      const isDecimal = raw.includes('.');
      const end = parseFloat(raw);

      if (reduceMotion) {
        el.textContent = raw + suffix;
        return;
      }

      const duration = 900;
      const startTime = performance.now();

      function frame(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = end * eased;
        el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          el.textContent = raw + suffix;
        }
      }
      requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    stats.forEach(function (el) { observer.observe(el); });
  });
})();

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav.site a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === path) link.classList.add('active');
    });
  });
})();

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('main section');
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add('reveal'); });

    if (reduceMotion) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  });
})();

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const copyButtons = document.querySelectorAll('[data-copy]');
    if (!copyButtons.length) return;

    let toastEl = document.querySelector('.toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }

    let hideTimer = null;
    function showToast(message) {
      toastEl.textContent = message;
      toastEl.classList.add('is-shown');
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        toastEl.classList.remove('is-shown');
      }, 1800);
    }

    copyButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const value = btn.getAttribute('data-copy');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(function () {
            showToast('Copied to clipboard');
          }).catch(function () {
            showToast('Could not copy — try selecting it manually');
          });
        } else {
          showToast('Copy not supported in this browser');
        }
      });
    });
  });
})();
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const el = document.querySelector('[data-ticker]');
    if (!el) return;

    const lines = [
      'currently solving DSA problems',
      'open to internship roles',
      'last deploy: DeepSeek Clone',
      'building something new'
    ];

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML = '<span class="dot"></span><span class="ticker-text"></span>';
    const textEl = el.querySelector('.ticker-text');
    let index = 0;
    textEl.textContent = lines[0];

    if (reduceMotion) return;

    setInterval(function () {
      index = (index + 1) % lines.length;
      textEl.style.opacity = 0;
      setTimeout(function () {
        textEl.textContent = lines[index];
        textEl.style.transition = 'opacity 0.4s ease';
        textEl.style.opacity = 1;
      }, 250);
    }, 3200);
  });
})();