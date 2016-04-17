const host = 'https://localhost:' + (process.env.APP_PORT || '3000')

// Test to ensure all redirects are handled appropriately

const els = {
  // About
  aboutPageLink: "a[href='#about']",
  aboutPage: "#about",
  aboutPageExit: "#about .popup-exit",
  // Create Room
  createRoomLink: "a[href='#create-room']",
  createRoomExit: "#create-room .popup-exit",
  createRoomForm: "#create-room form",
  // Create Room Fields
  createRoomName: "#create-room [name=Name]",
  createRoomCapacity: "#create-room [name=Capacity]",
  createRoomPrivateTrue: "#create-room [name=Private][value=true]",
  createRoomPrivateFalse: "#create-room [name=Private][value=false]",
  createRoomPassword: "#create-room [name=Password]",
  createRoomSubmit: "#create-room form button[type=submit]",
  createRoomCancel: "#create-room form .btn[href='#']",
} // require('../app-selectors/lobby-selectors')

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
    .assert.waitUrlEquals(host + '//alpha')
    .end()
  }
}