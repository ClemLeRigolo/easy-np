const { defineConfig } = require("cypress");
const cypressFirebasePlugin = require("cypress-firebase").plugin;
const admin = require("firebase-admin");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      cypressFirebasePlugin(on, config, admin, {
        databaseURL: "http://localhost:9000/?ns=easy-np"
      });
      require('@cypress/code-coverage/task')(on, config);
      // implement node event listeners here
      return config;
    },
  },
});
