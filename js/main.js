"use strict";
/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
(function () {
  const phoneInputs = document.querySelectorAll(`input[type="tel"]`);
  const form = document.querySelector(`.form__wrapper`);

  if (phoneInputs && form) {
    phoneInputs.forEach((phoneInput) => {
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
    });
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
  window.addEventListener(`hashchange`, (e) => e.preventDefault());

  document.querySelectorAll(`a[href^='#']`).forEach((link) => {
    link.addEventListener(`click`, (e) => {
      e.preventDefault();

      const id = e.target.hash;
      const target = document.querySelector(`${id}`);

      if (target) {
        target.scrollIntoView({behavior: `smooth`, inline: `end`});
      }
    });
  });
})();
;
(function () {
  const inputs = [`name`, `phone`, `question`]
      .map((inputName) => [...document.querySelectorAll(`[name='${inputName}']`)])
      .flat();

  const getInputsValue = () => {
    inputs.forEach((inputEl) => {
      if (inputEl) {
        inputEl.value = localStorage.getItem(`${inputEl.name}`);
        console.log(inputEl.value);
      }
    });
  };

  window.addEventListener(`DOMContentLoaded`, getInputsValue);

  inputs.forEach((input) => {
    if (!input) {
      return;
    }

    input.addEventListener(`input`, () => {
      localStorage.setItem(`${input.name}`, input.value);
    });
  });

  inputs.forEach((input) => {
    if (!input) {
      return;
    }

    input.addEventListener(`blur`, getInputsValue);
  });
})();
;
(function () {
  const page = document.querySelector(`.page`);
  const modalButtons = document.querySelectorAll(`a[href='#modal']`);
  const modalClose = document.querySelector(`.modal__close`);
  const modal = document.querySelector(`#modal`);
  const overlay = modal.querySelector(`.modal__overlay`);

  if (page && modalButtons && modalClose && modal && overlay) {
    const openModal = function () {
      modal.classList.add(`modal--active`);
      page.classList.add(`page--block`);

      document.addEventListener(`keydown`, closeModal);
      modalClose.addEventListener(`click`, closeModal);

      trapFocus(modal);
    };

    const closeModal = function (e) {
      if (e.key && e.key !== `Escape`) {
        return;
      }

      page.classList.remove(`page--block`);
      modal.classList.remove(`modal--active`);
      document.removeEventListener(`keydown`, closeModal);
      modalClose.removeEventListener(`click`, closeModal);
    };

    overlay.addEventListener(`click`, (e) => {
      if (e.target.classList.contains(`modal__overlay`)) {
        closeModal(e);
      }
    });

    modalButtons.forEach((button) =>
      button.addEventListener(`click`, (e) => {
        e.preventDefault();

        openModal();
      })
    );
  }

  function trapFocus(element) {
    const focusableEls = element.querySelectorAll(`input, textarea, button`);
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    const KEYCODE_TAB = 9;

    firstFocusableEl.focus();

    document.addEventListener(`keydown`, function (e) {
      const isTabPressed = e.key === `Tab` || e.keyCode === KEYCODE_TAB;

      if (!isTabPressed) {
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          e.preventDefault();
        }
      }
    });
  }
})();
;
