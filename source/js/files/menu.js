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
