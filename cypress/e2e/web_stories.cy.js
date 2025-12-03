/// <reference types="cypress" />

describe('Web Stories - via menu principal e verificar botão fechar', () => {
  it('Navega pelo menu principal -> Stories -> espera 10s -> abre um story e verifica botão de fechar', () => {
    const home = 'https://blog.agibank.com.br/';
    const storiesPath = '/web-stories/';
    const closeSelectors = [
      'button[aria-label="Fechar"]',
      'button[aria-label="Close"]',
      'button[aria-label="close"]',
      '.i-amphtml-story-close-button',
      '.amp-story-player-close-button',
      '.web-stories__close',
      '.web-stories-close'
    ];

    cy.visit(home);

    cy.get('#menu-item-5582 > a', { timeout: 15000 }).should('be.visible').then($a => {
      try { $a.get(0).click(); } catch (e) { cy.wrap($a).click({ force: true }); }
    });

    cy.location('pathname', { timeout: 10000 }).then(path => {
      if (!path.includes(storiesPath)) {
        cy.visit(`${home}${storiesPath}`);
      }
    });

    cy.wait(10000);

    cy.get('article a[href*="/web-stories/"]', { timeout: 15000 }).should('have.length.greaterThan', 0).first().then($link => {
      const href = $link.prop('href');
      cy.log('Abrindo story após wait 10s:', href);
      try { $link.get(0).click(); } catch (e) { cy.wrap($link).click({ force: true }); }
    });

    cy.wait(8000);

    cy.location('pathname', { timeout: 15000 }).should('include', '/web-stories/');

    cy.document().then(doc => {
      const found = closeSelectors.find(sel => {
        try { return !!doc.querySelector(sel); } catch (e) { return false; }
      });
      if (found) {
        cy.log('Botão de fechar encontrado via selector:', found);
        return cy.get(found, { timeout: 5000 }).should('be.visible');
      }
      const iframes = Array.from(doc.querySelectorAll('iframe'));
      for (const f of iframes) {
        try {
          const idoc = f.contentDocument || (f.contentWindow && f.contentWindow.document);
          if (!idoc) continue;
          for (const sel of closeSelectors) {
            const node = idoc.querySelector(sel);
            if (node) {
              const rect = node.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                cy.log('Botão de fechar encontrado dentro de iframe via selector:', sel);
                return;
              }
            }
          }
        } catch (e) { }
      }
      throw new Error('Nenhum botão de fechar encontrado após abrir o story. Selectors testados: ' + closeSelectors.join(', '));
    });
  });
});
