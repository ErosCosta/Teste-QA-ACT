/// <reference types="cypress" />
describe('Validação de links do menu principal', () => {
  const base = Cypress.env('BASE_URL') || 'https://blogdoagi.com.br/';

  it('Deve validar todos os links do menu principal retornarem status < 400', () => {
    cy.visitWithAstraStub(base);

    cy.get('header, nav', { timeout: 10000 }).then($header => {
      const anchors = Array.from($header[0].querySelectorAll('a')).map(a => a.getAttribute('href')).filter(Boolean);
      const unique = [...new Set(anchors)];
      cy.log('links encontrados', unique);

      unique.forEach((href) => {
        const url = href.startsWith('http') ? href : (href.startsWith('/') ? (base.replace(/\/$/, '') + href) : base + href);
        cy.request({ url, failOnStatusCode: false }).then((resp) => {
          cy.log(url, resp.status);
          expect(resp.status, `status for ${url}`).to.be.lt(400);
        });
      });
    });
  });
});
