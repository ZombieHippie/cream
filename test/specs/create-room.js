const host = 'https://localhost:' + (process.env.APP_PORT || '3000')

const els = require('../app-selectors/lobby-selectors')
const loginEls = {
  loginRoomSubmit: "button[type=submit]",
  loginRoomPassword: "input[type=password]",
}

describe('creating a room', function() {
  before(function () {
    browser
    .url('/lobby')
  })

  it('cancels create room when the Cancel button is clicked', function() {
    browser
    .assert.hidden(els.createRoomForm)
    // Tests against the popup functionality are in lobby-links.js
    .click(els.createRoomLink)
    .assert.waitVisible(els.createRoomForm)
    .click(els.createRoomCancel)
    // wait for animation as element fades away
    .assert.waitHidden(els.createRoomForm)
  })

  it.skip('should create a public room named Alpha', function() {
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
  })

  it.skip('should create a private room named Beta', function() {
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
  })

  it.skip('should fail login to Beta with incorrect password', function() {
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
  })

  it.skip('should successfully login to Beta with correct password', function() {
    var betaRoomSel = 'a[href*="beta"]'
    browser
      .click(betaRoomSel)
      .assert.waitUrlEquals(host + '/room/login/beta')
	    .setValue(loginEls.loginRoomPassword, "beta-password")
      .click(loginEls.loginRoomSubmit)
	    .assert.waitUrlEquals(host + '/r/beta')
      .end()
  })
})
