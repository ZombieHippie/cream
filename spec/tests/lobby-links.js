const host = 'https://localhost:' + (process.env.APP_PORT || '3000')
// Test to ensure all redirects are handled appropriately

// element css selectors
const els = require('../app-selectors/lobby-selectors')

module.exports = {
  beforeEach: function(browser) {
    browser
    .url(host + '/lobby')
    .waitForElementVisible('body')
  },
  // http://nightwatchjs.org/guide#writing-tests
  'About page shows when its button is clicked': function(browser) {
    browser
    .assert.hidden(els.aboutPage)
    // Ensure that the about page link has the text About Us
    .assert.containsText(els.aboutPageLink, "About Us")
    // Click the About us button
    .click(els.aboutPageLink)
    .assert.waitVisible(els.aboutPage)
    .assert.containsText(els.aboutPage, "Cole Lawrence")
    .assert.containsText(els.aboutPage, "Matt Pierzynski")
    .assert.containsText(els.aboutPage, "Kory Rekowski")
    .assert.containsText(els.aboutPage, "Cameron Yuan")
    .assert.containsText(els.aboutPage, "David Robinson")
    .click(els.aboutPageExit)
    // wait for animation as element fades away
    .assert.waitHidden(els.aboutPage)
  },
  'Create Room page shows when its button is clicked': function(browser) {
    browser
    .assert.hidden(els.createRoomForm)
    .assert.containsText(els.createRoomLink, "Create Room")
    .click(els.createRoomLink)
    // Tests against the create room are in create-room.js
    .assert.waitVisible(els.createRoomForm)
    .click(els.createRoomExit)
    // wait for animation as element fades away
    .assert.waitHidden(els.createRoomForm)
    .end()
  }
}