/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
(function () {
  const phoneInputs = document.querySelectorAll(`input[type="tel"]`);
  const form = document.querySelector(`.form__wrapper`);

  if (phoneInputs && form) {
    form.addEventListener(`submit`, (e) => {
      const formData = new FormData(form);

      fetch(`https://echo.htmlacademy.ru/`, {
        method: `post`,
        body: formData,
      });
    });

    phoneInputs.forEach((phoneInput) => {
      const phoneMask = IMask(phoneInput, {
        mask: `+{7}(000)000-00-00`,
        lazy: true,
      });

      phoneInput.addEventListener(
          `blur`,
          () => {
            phoneMask.updateOptions({
              lazy: true,
            });
          },
          true
      );
    });
  }
})();
