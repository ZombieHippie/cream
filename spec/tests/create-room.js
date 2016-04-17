const host = 'https://localhost:' + (process.env.APP_PORT || '3000')

// Test to ensure all redirects are handled appropriately

module.exports = {
  // http://nightwatchjs.org/guide#writing-tests
  'Create Room Dialog': function(browser) {
    browser
    .url(host + '/lobby')
    .waitForElementVisible('body', 1000)
    .assert.urlEquals(host + '/lobby')
    .end()
  }
}