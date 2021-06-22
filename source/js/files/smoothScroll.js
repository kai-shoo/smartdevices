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
