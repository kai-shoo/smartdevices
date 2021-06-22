"use strict";
/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
(function () {
  const phoneInput = document.querySelector(`input[type="tel"]`);
  const form = document.querySelector(`.form__wrapper`);

  if (phoneInput && form) {
    const phoneMask = IMask(phoneInput, {
      mask: `+{7}(000)000-00-00`,
      lazy: true,
    });

    form.addEventListener(`submit`, (e) => {
      const formData = new FormData(form);

      fetch(`https://echo.htmlacademy.ru/`, {
        method: `post`,
        body: formData,
      });
    });

    phoneInput.addEventListener(`focus`, () => {
      phoneMask.updateOptions({
        lazy: false,
      });
    });
    phoneInput.addEventListener(
      `blur`,
      () => {
        phoneMask.updateOptions({
          lazy: true,
        });
        if (!phoneMask.masked.rawInputValue) {
          phoneMask.value = ``;
        }
      },
      true
    );
  }
})();
;
(function () {
  const mediaQueryMobile = window.matchMedia(`(max-width: 767px)`);
  let contactsAccordion = null;

  const handleMobileWidth = (mql) => {
    if (mql.matches && !contactsAccordion) {
      contactsAccordion = new Accordion(`.accordion-container`);
      console.log(contactsAccordion);
    }

    if (!mql.matches && contactsAccordion) {
      contactsAccordion.destroy();
      contactsAccordion = null;
      console.log(contactsAccordion);
    }
  };

  window.addEventListener(`DOMContentLoaded `, handleMobileWidth(mediaQueryMobile));
  mediaQueryMobile.addEventListener(`change`, handleMobileWidth);
})();
;
(function () {
  window.addEventListener("hashchange", (e) => e.preventDefault());

  document.addEventListener(`click`, (e) => {
    e.preventDefault();
    const anchorLink = e.target.closest(`a[href^='#']`);

    if (anchorLink) {
      const id = anchorLink.hash;
      const target = document.querySelector(`${id}`);
      target.scrollIntoView({ behavior: "smooth", inline: "end" });
    }
  });
})();
;
