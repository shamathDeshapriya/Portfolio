/* =========================================================
   Shamath Deshapriya — Portfolio scripts
   ========================================================= */
(function () {
  "use strict";

  // Edit this address to change where the contact form sends mail.
  const CONTACT_EMAIL = "info.shamath@gmail.com";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Mobile navigation ---------- */
  const toggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const closeNav = () => {
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("a", navLinks).forEach((a) => a.addEventListener("click", closeNav));

  /* ---------- Header, progress bar, back-to-top ---------- */
  const header = $("#header");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", y > 20);
    toTop.classList.toggle("show", y > 600);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Active nav link ---------- */
  const sections = $$("main section[id]");
  const links = $$(".nav-links a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          if (e.target.classList.contains("skill-card")) animateSkill(e.target);
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((el) => revealObs.observe(el));

  /* ---------- Skill bars + counters ---------- */
  function animateSkill(card) {
    const level = parseInt(card.dataset.level, 10) || 0;
    const fill = $(".bar-fill", card);
    const pct = $(".pct", card);
    fill.style.width = level + "%";
    const start = performance.now();
    const duration = 1400;
    (function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      pct.textContent = Math.round(level * (1 - Math.pow(1 - t, 3))) + "%";
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* ---------- Subtle card tilt (desktop only) ---------- */
  if (window.matchMedia("(hover: hover) and (min-width: 900px)").matches) {
    $$(".skill-card, .project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim() || "Portfolio enquiry";
    const message = form.message.value.trim();

    $$(".field", form).forEach((f) => f.classList.remove("invalid"));
    let valid = true;
    [["name", !name], ["email", !emailOk(email)], ["message", !message]].forEach(([id, bad]) => {
      if (bad) {
        $("#" + id).parentElement.classList.add("invalid");
        valid = false;
      }
    });

    status.classList.toggle("error", !valid);
    if (!valid) {
      status.textContent = "Please fill in your name, a valid email and a message.";
      return;
    }

    const body = `${message}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Opening your email app to send the message…";
    form.reset();
  });
})();
