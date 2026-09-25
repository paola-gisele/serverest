const path = require('path')
const { defineConfig } = require('cypress')
require('dotenv').config({
  path: path.resolve(__dirname, `.env.${process.env.TEST_ENV || 'production'}`),
})

const DEFAULT_BASE_URL = 'https://front.serverest.dev'
const DEFAULT_API_URL = 'https://serverest.dev'

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || DEFAULT_BASE_URL,
    env: {
      apiUrl: process.env.API_URL || DEFAULT_API_URL,
      grepTags: process.env.GREP_TAGS || '',
    },
    specPattern: 'cypress/e2e/**/*.cy.js',
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'ServeRest - Test Report',
      embeddedScreenshots: true,
      inlineAssets: true,
    },
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)

      on('before:browser:launch', (browser, launchArgs) => {
        // Chrome-specific args for CI/CD
        if (browser.name === 'chrome' || browser.name === 'chromium') {
          launchArgs.args.push('--no-sandbox')
          launchArgs.args.push('--disable-gpu')
        }
        return launchArgs
      })

      return config
    },
  },
})
