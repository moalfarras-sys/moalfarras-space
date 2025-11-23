
/* Page fade-in */
(function initPageFadeIn() {
  const apply = () => document.body.classList.add("page-loaded");
  if (document.readyState === "complete" || document.readyState === "interactive") {
    apply();
  } else {
    window.addEventListener("load", apply);
  }
})();


/* ===========================
   Mohammad Alfarras — main.js
   =========================== */

const htmlEl = document.documentElement;
const themeToggleBtn = document.getElementById("theme-toggle");
const navUnderline = document.querySelector(".nav-underline");

/* THEME */
const savedTheme = localStorage.getItem("theme");
if (!savedTheme || savedTheme === "dark") {
  htmlEl.classList.add("dark");
} else {
  htmlEl.classList.remove("dark");
}
function updateThemeLabel() {
  if (!themeToggleBtn) return;
  const isDark = htmlEl.classList.contains("dark");
  themeToggleBtn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
}
updateThemeLabel();
themeToggleBtn?.addEventListener("click", () => {
  htmlEl.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    htmlEl.classList.contains("dark") ? "dark" : "light"
  );
  updateThemeLabel();
});

/* NAV ACTIVE UNDERLINE */
(function highlightActiveNav() {
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!navLinks.length) return;
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf("/") + 1) || "index.html";

  let activeLink = null;
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === file) {
      link.classList.add("active");
      activeLink = link;
    }
  });

  if (navUnderline && activeLink) {
    const rect = activeLink.getBoundingClientRect();
    const parentRect = activeLink.parentElement.getBoundingClientRect();
    navUnderline.style.width = rect.width + "px";
    navUnderline.style.transform = `translateX(${rect.left - parentRect.left}px)`;
    navUnderline.style.opacity = "1";
  }
})();

/* REVEAL ANIMATION */
(function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* SKILL BARS ANIMATION */
(function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  if (!bars.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
})();


/* CV TIMELINE ANIMATION */
(function initCvTimeline() {
  const items = document.querySelectorAll(".cv-timeline-item");
  if (!items.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((item) => observer.observe(item));
})();


/* CV Accordion toggle */
(function initCvAccordion() {
  const items = document.querySelectorAll(".cv-accordion-item");
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector(".cv-accordion-header");
    const body = item.querySelector(".cv-accordion-body");
    if (!btn || !body) return;

    // Set initial max-height for open items
    if (item.classList.contains("is-open")) {
      body.style.maxHeight = body.scrollHeight + "px";
    }

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      items.forEach((other) => {
        const otherBody = other.querySelector(".cv-accordion-body");
        if (!otherBody) return;
        other.classList.remove("is-open");
        otherBody.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("is-open");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });
})();


/* Hero & CV parallax on scroll */
(function initParallax() {
  const heroCard = document.querySelector(".hero-photo-card");
  const cvPhoto = document.querySelector(".cv-photo-frame");
  if (!heroCard && !cvPhoto) return;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    const offset = y * 0.06;
    if (heroCard) {
      heroCard.style.transform = `translateY(${offset}px)`;
    }
    if (cvPhoto) {
      cvPhoto.style.transform = `translateY(${offset * 0.6}px)`;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* Page transition on internal links */
(function initPageTransitions() {
  const body = document.body;
  if (!body) return;

  function handleClick(e) {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;
    if (a.dataset.noTransition === "true") return;
    e.preventDefault();
    body.classList.add("page-transition-out");
    setTimeout(() => {
      window.location.href = href;
    }, 180);
  }

  document.addEventListener("click", handleClick);
})();

/* Auto language hint: redirect EN users to /en/ on first visit to Arabic home */
(function initLangRedirect() {
  try {
    const isArabicRoot =
      document.documentElement.lang === "ar" &&
      (location.pathname === "/" || location.pathname.endsWith("/index.html"));
    if (!isArabicRoot) return;

    const hasRedirected = localStorage.getItem("langRedirectDone");
    if (hasRedirected) return;

    const navLang = (navigator.language || navigator.userLanguage || "").toLowerCase();
    if (navLang.startsWith("en")) {
      localStorage.setItem("langRedirectDone", "1");
      window.location.href = "en/index.html";
    }
  } catch (e) {
    // ignore
  }
})();

/* Simple per-browser visit counter (local only) */
(function initVisitCounter() {
  try {
    const count = parseInt(localStorage.getItem("mf_visit_count") || "0", 10) + 1;
    localStorage.setItem("mf_visit_count", String(count));
    document.querySelectorAll("[data-visit-counter]").forEach((el) => {
      el.textContent = count;
    });
  } catch (e) {
    // ignore
  }
})();

/* Service worker registration */
(function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch(() => {});
  });
})();

/* Simple local rating widget (reviews page only) */
(function initRatingWidget() {
  const widget = document.querySelector("[data-rating-widget]");
  if (!widget) return;
  const buttons = widget.querySelectorAll("[data-star]");
  const label = widget.querySelector("[data-rating-label]");
  if (!buttons.length || !label) return;

  const saved = parseInt(localStorage.getItem("mf_rating") || "0", 10);
  function render(value) {
    buttons.forEach((btn) => {
      const v = parseInt(btn.dataset.star || "0", 10);
      btn.classList.toggle("is-active", v <= value);
    });
    if (!value) {
      label.textContent = "اختر عدد النجوم";
    } else {
      label.textContent = `شكراً! تقييمك: ${value} / 5 (محفوظ على هذا الجهاز فقط)`;
    }
  }

  if (saved) render(saved);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = parseInt(btn.dataset.star || "0", 10);
      localStorage.setItem("mf_rating", String(value));
      render(value);

      const form = document.getElementById("rating-email-form");
      if (form) {
        const input = form.querySelector('input[name="rating"]');
        if (input) input.value = String(value);
        form.submit();
      }
    });
  });
})();


/* Language switcher: keep same page/section when toggling */
(function initLangSwitcher() {
  const switches = document.querySelectorAll(".nav-lang-switch");
  if (!switches.length) return;

  function resolveTarget() {
    const lang = document.documentElement.lang || "ar";
    const path = window.location.pathname || "";
    const hash = window.location.hash || "";
    // Extract last file segment (e.g. index.html, blog.html)
    let file = path.split("/").filter(Boolean).pop() || "index.html";

    // If we are in /en/ and path ends with /en/, treat as index.html
    if (lang === "en" && (file === "en" || file === "en/")) {
      file = "index.html";
    }

    if (lang === "ar") {
      const map = {
        "index.html": "en/index.html",
        "blog.html": "en/blog.html",
        "cv.html": "en/cv.html",
        "youtube.html": "en/youtube.html",
        "contact.html": "en/contact.html",
        "reviews.html": "en/contact.html"
      };
      return (map[file] || "en/index.html") + hash;
    } else {
      const map = {
        "index.html": "../index.html",
        "blog.html": "../blog.html",
        "cv.html": "../cv.html",
        "youtube.html": "../youtube.html",
        "contact.html": "../contact.html",
        "reviews.html": "../contact.html"
      };
      return (map[file] || "../index.html") + hash;
    }
  }

  switches.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = resolveTarget();
      if (target) {
        window.location.href = target;
      }
    });
  });
})();


/* Scroll reveal for glass cards and sections */
(function initScrollReveal() {
  if (!("IntersectionObserver" in window)) return;
  const targets = Array.from(
    document.querySelectorAll(".glass, .card-link, .video-card, .price-card, .faq-item")
  );
  if (!targets.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  targets.forEach((el) => {
    el.classList.add("scroll-reveal");
    observer.observe(el);
  });
})();



/* Stats counter */
(function initStatsCounters() {
  const stats = document.querySelectorAll(".stat-number[data-target]");
  if (!stats.length || !("IntersectionObserver" in window)) return;

  const easeOutQuad = (t) => t * (2 - t);

  const animate = (el) => {
    const target = parseInt(el.dataset.target || "0", 10);
    if (!target) return;
    const suffix = el.dataset.suffix || "";
    const duration = 3000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = easeOutQuad(progress);
      const value = Math.floor(target * eased);
      el.textContent = suffix ? `${value}${suffix}` : String(value);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  stats.forEach((el) => observer.observe(el));
})();


/* Global YouTube badge */
(function initGlobalYoutubeBadge() {
  const body = document.body;
  if (!body) return;
  const badge = document.createElement("a");
  badge.href = "https://youtube.com/@moalfarras";
  badge.target = "_blank";
  badge.rel = "noreferrer";
  badge.className = "global-yt-badge";
  badge.textContent = "قناة محمد الفراس على يوتيوب";
  body.appendChild(badge);
})();


/* Parallax scroll variable for YouTube stars */
(function initParallaxStars() {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const update = () => {
    const y = window.scrollY || window.pageYOffset || 0;
    root.style.setProperty("--stars-offset", String(y));
    root.style.setProperty("--yt-stars-offset", String(y));
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
})();



/* Smooth scroll for in-page anchors */
(function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      const target = document.querySelector(href);
      if (!target) return;
      const isSamePage =
        link.pathname === window.location.pathname &&
        link.hostname === window.location.hostname;
      if (!isSamePage) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();



/* Subtle 3D tilt on cards for desktop */
(function initCardTilt() {
  if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;

  const cards = document.querySelectorAll(
    ".card, .video-card, .section-card, .price-card, .cv-timeline-card"
  );
  if (!cards.length) return;

  const maxTilt = 8;

  cards.forEach((card) => {
    let rect = null;

    const handleMove = (event) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const percentX = (x / rect.width) * 2 - 1;
      const percentY = (y / rect.height) * 2 - 1;
      const rotateX = (-percentY * maxTilt).toFixed(2);
      const rotateY = (percentX * maxTilt).toFixed(2);
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    };

    const reset = () => {
      rect = null;
      card.style.transform = "";
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", reset);
  });
})();



/* Highlight active YouTube video card when clicked */
(function initYouTubeCards() {
  const container = document.querySelector(".youtube-grid");
  if (!container) return;
  const cards = container.querySelectorAll(".video-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      cards.forEach((c) => c.classList.remove("is-active"));
      card.classList.add("is-active");
    });
  });
})();


/* =====================================
   Interactive hover tooltips + icons
   ===================================== */
(function initHoverHints() {
  if (typeof window === "undefined") return;
  const targets = document.querySelectorAll("[data-hover-hint]");
  if (!targets.length) return;

  let hintEl = null;

  function ensureHint() {
    if (hintEl) return hintEl;
    hintEl = document.createElement("div");
    hintEl.className = "hover-hint";
    document.body.appendChild(hintEl);
    return hintEl;
  }

  function showHint(target, evt) {
    const text = target.getAttribute("data-hover-hint");
    if (!text) return;
    const el = ensureHint();
    el.textContent = text;
    el.dataset.visible = "true";

    const rect = target.getBoundingClientRect();
    const hintRect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - hintRect.width / 2;
    const y = rect.top - hintRect.height - 10;

    el.style.left = Math.max(8, Math.min(window.innerWidth - hintRect.width - 8, x)) + "px";
    el.style.top = Math.max(8, y) + "px";
  }

  function hideHint() {
    if (!hintEl) return;
    hintEl.dataset.visible = "false";
  }

  targets.forEach((el) => {
    el.addEventListener("mouseenter", (evt) => showHint(el, evt));
    el.addEventListener("focus", (evt) => showHint(el, evt));
    el.addEventListener("mousemove", (evt) => showHint(el, evt));
    el.addEventListener("mouseleave", hideHint);
    el.addEventListener("blur", hideHint);
  });
})();
