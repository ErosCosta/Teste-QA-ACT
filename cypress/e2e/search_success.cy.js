/// <reference types="cypress" />

describe('Pesquisa - termos com sucesso', () => {
  const base = Cypress.env('BASE_URL') || 'https://blog.agibank.com.br/';
  const terms = ['Teste', 'finanças', 'cartão'];

  const openSearchSelector =
    'a.slide-search.astra-search-icon, a[aria-label="Search button"]';

  const inputSelector =
    'input.search-field#search-field[name="s"], input[type="search"].search-field';

  beforeEach(() => {
    cy.visitWithAstraStub(base);

    cy.get(openSearchSelector, { timeout: 15000 })
      .should('exist')
      .then(($el) => {
        $el[0].click(); 
      });

    cy.wait(300); 
  });

  const fetchSearchInput = () =>
    cy.get(inputSelector, { timeout: 10000 }).first();

  const setAndSubmitSearchTerm = (term) =>
    fetchSearchInput().then(($input) => {
      const el = $input.get(0);

      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true }));

      el.value = term;
      el.dispatchEvent(new Event('input', { bubbles: true }));

      el.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
      el.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Enter', bubbles: true })
      );

      if (el.form) el.form.submit();

      return cy.wrap($input);
    });

   const assertHasResults = (term) => {
    cy.get('main', { timeout: 15000 }).should(($main) => {
      const text = $main.text().toLowerCase();

      if (text.includes(term.toLowerCase())) return;

      const selectors = [
        'article',
        '.post',
        '.entry',
        '.post-item',
        '.search-result',
        '.search-results .post',
        '.listing-item',
        '.loop-item',
        '.card',
        '.post-list',
      ];

      let found = 0;
      selectors.forEach((sel) => {
        const nodes = $main
          .find(sel)
          .filter(function () {
            return Cypress.$(this).is(':visible');
          });

        if (nodes.length) found += nodes.length;
      });

      if (found > 0) return; 
      throw new Error(
        `Nenhum resultado encontrado dentro de <main> para o termo: ${term}`
      );
    });
  };

  terms.forEach((term) => {
    it(`Deve retornar resultados para termo: ${term}`, () => {
      setAndSubmitSearchTerm(term);

      cy.url({ timeout: 15000 }).should('include', '?s=');

      assertHasResults(term);
    });
  });
});
