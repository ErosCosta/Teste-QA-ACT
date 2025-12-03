/// <reference types="cypress" />

describe('Pesquisa - termos sem resultados relevantes', () => {
  const base = Cypress.env('BASE_URL') || 'https://blogdoagi.com.br/';
  const terms = ['asdfghjklqwerty', 'zzzzzzzz', 'termoinvalido123'];
  const openSearchSelector = 'a.slide-search.astra-search-icon, a[aria-label="Search button"]';
  const inputSelector = 'input.search-field#search-field[name="s"], input[type="search"].search-field';

  beforeEach(() => {
    cy.visitWithAstraStub(base);
    cy.get(openSearchSelector, { timeout: 15000 })
      .should('exist')
      .then($el => {
        $el[0].click();
      });
    cy.wait(300);
  });
  const fetchSearchInput = () => {
    return cy.get(inputSelector, { timeout: 10000 }).first();
  };
  const setAndSubmitSearchTerm = (term) => {
    return fetchSearchInput().then($input => {
      const el = $input.get(0);

      try {
        if (typeof $input.val === 'function') {
          $input.val('');
        } else {
          el.value = '';
        }
      } catch (e) {
      }
      try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}

      try {
        if (typeof $input.val === 'function') {
          $input.val(term);
        } else {
          el.value = term;
        }
      } catch (e) {}
      try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
      try { el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); } catch (e) {}
      try { el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true })); } catch (e) {}
      try {
        if (el.form) {
          el.form.submit();
        }
      } catch (e) {}

      return cy.wrap($input);
    });
  };

  const assertNoResults = () => {
    cy.contains(/Resultados encontrados para[:]?/i, { timeout: 8000 }).should('exist');
   
    cy.get('main', { timeout: 15000 }).should($main => {
      const mainText = $main.text().toLowerCase();

       const hasNoResultsText = /lamentamos.*nada foi encontrado|nenhum resultado|nenhum post encontrado|nenhum resultado encontrado|no results|nothing found/i.test(mainText);

      if (hasNoResultsText) {
          return;
      }

      
      const possibleSelectors = [
        'article',
        '.post',
        '.entry',
        '.post-item',
        '.search-result',
        '.search-results .post',
        '.listing-item',
        '.loop-item',
        '.card',
        '.post-list'
      ];
      let found = 0;
      possibleSelectors.forEach(sel => {
        const nodes = $main.find(sel).filter(function () { return Cypress.$(this).is(':visible'); });
        if (nodes.length) found += nodes.length;
      });

      if (found === 0) {
          return;
      }

      throw new Error('Foram detectados possíveis itens de resultado dentro de <main>. Count aproximado: ' + found);
    });
  };

  terms.forEach(term => {
    it(`Não deve retornar resultados relevantes para termo: ${term}`, () => {
      setAndSubmitSearchTerm(term);

      cy.url({ timeout: 15000 }).should('include', '?s=');

      assertNoResults();
    });
  });
});
