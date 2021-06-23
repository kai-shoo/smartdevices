/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
(function () {
  const mediaQueryMobile = window.matchMedia(`(max-width: 767px)`);
  let contactsAccordion = null;

  const handleMobileWidth = (mql) => {
    if (mql.matches && !contactsAccordion) {
      contactsAccordion = new Accordion(`.accordion-container`);
    }

    if (!mql.matches && contactsAccordion) {
      contactsAccordion.destroy();
      contactsAccordion = null;
    }
  };

  window.addEventListener(`DOMContentLoaded `, handleMobileWidth(mediaQueryMobile));
  mediaQueryMobile.addEventListener(`change`, handleMobileWidth);
})();
