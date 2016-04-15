var app_port = process.env.APP_PORT || '3000'

console.log("Lobby shows name PORT:", app_port)

module.exports = {
  // http://nightwatchjs.org/guide#writing-tests
  'Lobby Displays' : function (browser) {
    browser
      .url('https://localhost:' + app_port)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'Cream Stream')
      .end()
  }
}