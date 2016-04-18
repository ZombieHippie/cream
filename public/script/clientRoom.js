
console.log(easyrtc)

easyrtc.connect()

var room_id = $(".room-title").text()
var roomParameters = {
  //no room parameters at the moment?
}

console.log("Connecting to '" + room_id + "'")

easyrtc.joinRoom(
  room_id, //1
  roomParameters, //2
  function SuccessfulJoin () {
    console.log("successful", arguments)
  },
  function FailfulJoin() {
    console.log("fail", arguments)
  }
)

easyrtc.leaveRoom(
  room_id,
  function SuccessfulExit () {
    console.log("EXIT SUCCESS", arguments)
  },
  function FailfulExit () {
    console.log("EXIT FAILURE", arguments)
  }
)
