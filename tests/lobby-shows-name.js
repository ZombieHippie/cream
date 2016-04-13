module.exports = {
  // http://nightwatchjs.org/guide#writing-tests
  'Lobby Displays' : function (browser) {
    browser
      .url('https://localhost:3000')
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'Cream Stream')
      .end()
  }
}