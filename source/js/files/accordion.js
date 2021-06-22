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
