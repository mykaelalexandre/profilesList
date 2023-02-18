import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 5000,
  videosFolder: "cypress/videos",
  video: true,
  screenshotsFolder: "cypress/screenshots",
  chromeWebSecurity: false,

  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3000",
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
