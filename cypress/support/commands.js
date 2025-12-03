// cypress/support/e2e.js
import './commands'; // mantém seus comandos customizados (ex: visitWithAstraStub)

// registra os comandos do @testing-library/cypress
import '@testing-library/cypress/add-commands';
