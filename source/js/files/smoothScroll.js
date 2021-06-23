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
