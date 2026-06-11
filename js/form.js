(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var formSuccess = document.getElementById("form-success");
  var formError = document.getElementById("form-error");
  var submitBtn = form.querySelector('button[type="submit"]');

  function getLang() {
    return localStorage.getItem("artemdev-lang") || "uk";
  }

  function getStrings() {
    var locales = window.PORTFOLIO_I18N || {};
    var lang = getLang();
    return (locales[lang] && locales[lang].contact) || (locales.uk && locales.uk.contact) || {};
  }

  function showError(field, key) {
    var input = form.querySelector('[name="' + field + '"]');
    var errorEl = form.querySelector('[data-error="' + field + '"]');
    var strings = getStrings();
    var message = (strings.errors && strings.errors[key]) || key;

    if (input) input.setAttribute("aria-invalid", "true");
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll(".field__error").forEach(function (el) {
      el.textContent = "";
    });
    form.querySelectorAll(".field__input").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
    if (formError) {
      formError.hidden = true;
      formError.textContent = "";
    }
  }

  function isValidContact(value) {
    var trimmed = value.trim();
    if (!trimmed) return false;
    if (trimmed.indexOf("@") === 0) return trimmed.length > 2;
    return trimmed.replace(/\D/g, "").length >= 9;
  }

  function setSubmitting(active) {
    if (!submitBtn) return;
    submitBtn.disabled = active;
    var strings = getStrings();
    if (active) {
      submitBtn.dataset.defaultText = submitBtn.textContent;
      submitBtn.textContent = strings.formSubmitting || "…";
    } else if (submitBtn.dataset.defaultText) {
      submitBtn.textContent = submitBtn.dataset.defaultText;
    }
  }

  function showFormError(key) {
    if (!formError) return;
    var strings = getStrings();
    formError.textContent = strings[key] || strings.formError || "";
    formError.hidden = false;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors();

    var name = form.name.value.trim();
    var contact = form.contact.value.trim();
    var business = form.business.value.trim();
    var message = form.message.value.trim();
    var hasError = false;

    if (!name) {
      showError("name", "required");
      hasError = true;
    }

    if (!contact) {
      showError("contact", "required");
      hasError = true;
    } else if (!isValidContact(contact)) {
      showError("contact", "contact");
      hasError = true;
    }

    if (hasError) {
      if (formSuccess) formSuccess.hidden = true;
      return;
    }

    var endpoint =
      (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.telegramFormUrl) || "";

    if (!endpoint) {
      showFormError("formErrorConfig");
      return;
    }

    setSubmitting(true);

    try {
      var res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          contact: contact,
          business: business,
          message: message,
          lang: getLang(),
          website: form.website.value
        })
      });

      if (!res.ok) {
        throw new Error("request_failed");
      }

      form.reset();
      form.hidden = true;
      if (formSuccess) formSuccess.hidden = false;
    } catch (err) {
      console.error("Form submit failed:", err);
      showFormError("formError");
    } finally {
      setSubmitting(false);
    }
  });
})();
