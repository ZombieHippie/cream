const host = 'https://localhost:' + (process.env.APP_PORT || '3000')

const extend = require('util-extend')
// Test to ensure all redirects are handled appropriately

const els = require('../app-selectors/lobby-selectors')
const loginEls = {
  loginRoomSubmit: "button[type=submit]",
  loginRoomPassword: "input[type=password]",
}

module.exports = {
  beforeEach: function(browser) {
    browser
    .url(host + '/lobby')
    .waitForElementVisible('body', 1000)
  },

  // http://nightwatchjs.org/guide#writing-tests
  'Create Room cancel': function(browser) {
    browser
    .assert.hidden(els.createRoomForm)
    // Tests against the popup functionality are in lobby-links.js
    .click(els.createRoomLink)
    .assert.waitVisible(els.createRoomForm)
    .click(els.createRoomCancel)
    // wait for animation as element fades away
    .assert.waitHidden(els.createRoomForm)
  },
  'Create Room - Alpha Public': function(browser) {
    browser
    .click(els.createRoomLink)
    // Name "Alpha"
    .setValue(els.createRoomName, "Alpha")
    // Capacity 2
    .setValue(els.createRoomCapacity, "2")
    // Public
    .click(els.createRoomPrivateFalse)
    .click(els.createRoomSubmit)
    .assert.waitUrlEquals(host + '/r/alpha')
  },
  'Create Room - Beta Private': function(browser) {
    browser
      .click(els.createRoomLink)
      // Name "Beta"
      .setValue(els.createRoomName, "Beta")
      // Capacity 2
      .setValue(els.createRoomCapacity, "3")
      // Private
      .click(els.createRoomPrivateTrue)
      // Password 'beta-password'
      .setValue(els.createRoomPassword, "beta-password")
      .click(els.createRoomSubmit)
      .assert.waitUrlEquals(host + '/room/login/beta')
  },
  'Failed Login to Room - Beta Private': function(browser) {
    var betaRoomSel = 'a[href*="beta"]'
    browser
      .assert.containsText(betaRoomSel, 'Beta')
      .click(betaRoomSel)
      .assert.waitUrlEquals(host + '/room/login/beta')
	    .setValue(loginEls.loginRoomPassword, "incorrect password")
      .click(loginEls.loginRoomSubmit)
	    .waitForElementVisible('body', 1000)
      .assert.urlContains(host + '/room/login/beta')
      .assert.containsText('.login-message', 'Password is incorrect')
  },
  'Successful Login to Room - Beta Private': function(browser) {
    var betaRoomSel = 'a[href*="beta"]'
    browser
      .click(betaRoomSel)
      .assert.waitUrlEquals(host + '/room/login/beta')
	    .setValue(loginEls.loginRoomPassword, "beta-password")
      .click(loginEls.loginRoomSubmit)
	    .assert.waitUrlEquals(host + '/r/beta')
      .end()
  }
}