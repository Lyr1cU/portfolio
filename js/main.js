(function () {
  var STORAGE_KEY = "artemdev-lang";
  var locales = window.PORTFOLIO_I18N;
  var currentLang = "uk";

  function get(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  function detectLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && locales[saved]) return saved;

    var browser = (navigator.language || "uk").toLowerCase();
    if (browser.indexOf("ru") === 0) return "ru";
    if (browser.indexOf("en") === 0) return "en";
    if (browser.indexOf("uk") === 0) return "uk";
    return "uk";
  }

  function renderList(ul, items) {
    if (!ul || !items) return;
    ul.innerHTML = items
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");
  }

  function renderExtras(grid, items) {
    if (!grid || !items) return;
    grid.innerHTML = items
      .map(function (item) {
        return (
          '<div class="extra"><strong>' +
          item.title +
          "</strong><span>" +
          item.price +
          "</span></div>"
        );
      })
      .join("");
  }

  function setLang(lang) {
    if (!locales[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    var t = locales[lang];
    document.documentElement.lang = lang === "uk" ? "uk" : lang === "ru" ? "ru" : "en";

    if (t.meta) {
      document.title = t.meta.title;
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", t.meta.description);
    }

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = get(t, el.getAttribute("data-i18n"));
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var value = get(t, el.getAttribute("data-i18n-placeholder"));
      if (value != null) el.setAttribute("placeholder", value);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var value = get(t, el.getAttribute("data-i18n-aria"));
      if (value != null) el.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-list]").forEach(function (ul) {
      renderList(ul, get(t, ul.getAttribute("data-i18n-list")));
    });

    renderExtras(document.getElementById("extras-grid"), t.pricing.extras);

    var priceValue = document.getElementById("base-price-value");
    var priceCurrency = document.getElementById("base-price-currency");
    if (priceValue && t.pricing) {
      priceValue.textContent = t.pricing.basePrice;
    }
    if (priceCurrency && t.pricing) {
      priceCurrency.textContent = t.pricing.baseCurrency;
    }

    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"));
    });
  });

  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  setLang(detectLang());
})();
