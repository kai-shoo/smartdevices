(function () {
  const MASK = `+7(___)___-__-__`;

  const inputs = [`name`, `phone`, `question`]
    .map((inputName) => [...document.querySelectorAll(`[name='${inputName}']`)])
    .flat();

  const getInputsValue = () => {
    inputs.forEach((inputEl) => {
      if (inputEl) {
        inputEl.value = localStorage.getItem(`${inputEl.name}`);
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
