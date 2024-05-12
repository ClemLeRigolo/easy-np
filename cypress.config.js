const { defineConfig } = require("cypress");
const cypressFirebasePlugin = require("cypress-firebase").plugin;
const admin = require("firebase-admin");
const clipboardy = require('clipboardy');

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      cypressFirebasePlugin(on, config, admin, {
        databaseURL: "http://localhost:9000/?ns=easy-np"
      });
      require('@cypress/code-coverage/task')(on, config);

      // Add the getClipboard task
      on('task', {
        getClipboard() {
          return clipboardy.readSync();
        },
      });

      // implement node event listeners here
      return config;
    },
    viewportWidth: 1200,
    viewportHeight: 600,
  },
});