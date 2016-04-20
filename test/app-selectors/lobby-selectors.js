// Lobby Page Selectors
// http://www.w3schools.com/cssref/css_selectors.asp
module.exports =
{
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
}