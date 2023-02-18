import { baseUrl } from "../cypress.json";

export default {
  baseUrl: baseUrl,
  viewportWidth: 1280,
  viewportHeight: 720,
  integrationFolder: "cypress/integration",
  testFiles: "**/*.spec.ts",
};
