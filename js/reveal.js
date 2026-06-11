(function () {
  var STAGGER = 70;
  var HERO_STAGGER = 110;
  var observer = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function markReveal(el, delay) {
    el.classList.add("reveal");
    if (delay) {
      el.style.setProperty("--reveal-delay", delay + "ms");
    }
  }

  function revealNow(el) {
    el.classList.add("is-visible");
  }

  function getChildren(parent, childSelector) {
    if (childSelector === ":scope > *") {
      return Array.prototype.slice.call(parent.children);
    }
    return Array.prototype.slice.call(parent.querySelectorAll(childSelector));
  }

  function addStaggered(parentSelector, childSelector, stagger) {
    var elements = [];

    document.querySelectorAll(parentSelector).forEach(function (parent) {
      getChildren(parent, childSelector).forEach(function (el, index) {
        markReveal(el, index * stagger);
        elements.push(el);
      });
    });

    return elements;
  }

  function observeElements(elements) {
    elements.forEach(function (el) {
      if (el) observer.observe(el);
    });
  }

  function initHero() {
    document.querySelectorAll(".hero__content > *").forEach(function (el, index) {
      var delay = index * HERO_STAGGER;
      markReveal(el, delay);
      window.setTimeout(function () {
        revealNow(el);
      }, 80 + delay);
    });

    document.querySelectorAll(".hero__card > *").forEach(function (el, index) {
      var delay = index * HERO_STAGGER;
      markReveal(el, delay);
      window.setTimeout(function () {
        revealNow(el);
      }, 180 + delay);
    });
  }

  function initScrollReveal() {
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    var targets = [];

    document.querySelectorAll(".section__head").forEach(function (el) {
      markReveal(el);
      targets.push(el);
    });

    document.querySelectorAll(".extras > h3, .extras > .extras__lead").forEach(function (el) {
      markReveal(el);
      targets.push(el);
    });

    document.querySelectorAll(".terms > h2").forEach(function (el) {
      markReveal(el);
      targets.push(el);
    });

    document.querySelectorAll(".contact__text > h2, .contact__text > p").forEach(function (el) {
      markReveal(el);
      targets.push(el);
    });

    document.querySelectorAll(".contact__form-wrap").forEach(function (el) {
      markReveal(el);
      targets.push(el);
    });

    targets = targets.concat(
      addStaggered(".works", ".work-card", 90),
      addStaggered(".steps", "li", 80),
      addStaggered(".cms-grid", ":scope > div", 100),
      addStaggered(".check-list", "li", 45),
      addStaggered(".packages", ".package", 100),
      addStaggered("#extras-grid", ".extra", 60),
      addStaggered(".terms ul", "li", 55),
      addStaggered(".contact__links", ".contact__link", 70),
      addStaggered(".footer__inner", ":scope > *", 80)
    );

    observeElements(targets);
  }

  function init() {
    if (prefersReducedMotion()) return;
    initHero();
    initScrollReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
