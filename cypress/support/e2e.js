// cypress/support/e2e.js
Cypress.on('uncaught:exception', (err) => {
  if (err && err.message && err.message.includes('astra is not defined')) {
    return false;
  }
  return false;
});

Cypress.Commands.add('visitWithAstraStub', (url, options = {}) => {
  const finalOptions = Object.assign({}, options, {
    onBeforeLoad(win) {
      if (!win.astra) {
        win.astra = { init: () => {}, open: () => {}, close: () => {} };
      }
      if (options && typeof options.onBeforeLoad === 'function') {
        options.onBeforeLoad(win);
      }
    }
  });
  return cy.visit(url, finalOptions);
});
