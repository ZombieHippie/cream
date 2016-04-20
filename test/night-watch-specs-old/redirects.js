const host = 'https://localhost:' + (process.env.APP_PORT || '3000')

// Test to ensure all redirects are handled appropriately

module.exports = {
  // http://nightwatchjs.org/guide#writing-tests
  '/ redirects to /lobby': function(browser) {
    browser
    .url(host + '/')
    .waitForElementVisible('body', 1000)
    .assert.urlEquals(host + '/lobby')
  },
  '/room redirects to /lobby': function(browser) {
    browser
    .url(host + '/room')
    .waitForElementVisible('body', 1000)
    .assert.urlEquals(host + '/lobby')
    .end()
  }
}