const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // prefer environment variable, fallback to default
    baseUrl: process.env.BASE_URL || "https://blogdoagi.com.br/",
    setupNodeEvents(on, config) {
      // you can add plugins/events here
      return config;
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    // enable support file so custom commands (visitWithAstraStub) load
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
