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
})();
