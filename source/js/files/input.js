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
