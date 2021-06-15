"use strict";
(function () {
  const header = document.querySelector(`.header`);
  const buttonToggle = document.querySelector(`.toggle`);
  const page = document.querySelector(`.page`);

  if (header && buttonToggle && page) {
    page.classList.remove(`page--nojs`);
    header.classList.remove(`header--active`);

    const toggleMenu = (event) => {
      if (
        (event.target.closest(`.toggle`) && event.type === `click`) ||
        event.key === `Escape`
      ) {
        header.classList.toggle(`header--active`);
        page.classList.toggle(`page--block`);
      }

      if (header.classList.contains(`header--active`)) {
        document.addEventListener(`keydown`, toggleMenu);
      } else {
        document.removeEventListener(`keydown`, toggleMenu);
      }
    };

    buttonToggle.addEventListener(`click`, toggleMenu);
    header.addEventListener(`click`, (event) => {
      if (!event.target.classList.contains(`nav__link`)) {
        return;
      }
      header.classList.remove(`header--active`);
      page.classList.remove(`page--block`);
    });
  }
})();
;
/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
(function () {
  const phoneInput = document.querySelector(`input[type="tel"]`);
  const form = document.querySelector(`.form__container`);

  if (phoneInput && form) {
    const phoneMask = IMask(phoneInput, {
      mask: `+{7}(000)000-00-00`,
    });

    form.addEventListener(`submit`, (e) => {
      const formData = new FormData(form);

      fetch(`https://echo.htmlacademy.ru/`, {
        method: `post`,
        body: formData,
      });
    });
  }
})();
;
