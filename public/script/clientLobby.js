
function showCreateRoom() {
  var createRoom = $('#create-room')
  createRoom.addClass('show')
  createRoom.find("input[value='true']").on("click", function () {
    // use this as reference, no functionality added here.
  })
}

// make a reference 
var userPassEl = document.querySelector('#create-room [name=Password]')
function setPasswordDisabled (disabled) {
  userPassEl.disabled = disabled;
}

