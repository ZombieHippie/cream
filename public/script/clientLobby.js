
function showCreateRoom() {
  var createRoom = $('#popup-create-room')
  createRoom.addClass('show')
  createRoom.find("input[value='true']").on("click", function () {

  })
}

function togglePublic (rdo) {
  document.getElementById("user_pass").disabled = true;
}

function togglePrivate (rdo) {
  document.getElementById("user_pass").disabled = false;
}
