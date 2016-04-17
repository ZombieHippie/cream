const host = 'https://localhost:' + (process.env.APP_PORT || '3000')
// Test to ensure all redirects are handled appropriately

// element selectors
const els = require('../page-objects/lobby-page').elements

module.exports = {
  beforeEach: function(browser) {
    browser
    .url(host + '/lobby')
  },
  // http://nightwatchjs.org/guide#writing-tests
  'About page': function(browser) {
    browser
    // Ensure that the about page link has the text About Us
    .assert.containsText(els.aboutPageLink, "About Us")
    // Click the About us button
    .click(els.aboutPageLink)
    // wait for the URL to reflect this change
    .assert.urlEquals(host + '/about')
    .end()
  }
}