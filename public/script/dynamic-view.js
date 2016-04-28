
var maxCALLERS = 5;
var numVideoOBJS = maxCALLERS+1;

//Dynamic video functions ------------------------------------------
function revert(){
 document.getElementById("vids").classList.remove("getsmall");
 document.getElementById("revertView").style.visibility='hidden';
}

function changeView(){
  document.getElementById("vids").classList.add("getsmall");
  document.getElementById("revertView").style.visibility='visible';
}
//End video functions------------------------------------------------

function getKicked(){
  easyrtc.hangupAll();
}
easyrtc.dontAddCloseButtons(true);

function getIdOfBox(boxNum) {
    return "video" + boxNum;
}

var boxUsed = [true, false, false, false, false, false];
var connectCount = 0;

function muteAudio(muteButton) {
  // See EasyRTC "enableMicrophone(enable)" and "enableVideo(enabled)"
    var id = muteButton.id;
    //if( activeBox > 0) { // no kill button for self video
    id = parseInt(id);
    var videoObject = document.getElementById( getIdOfBox(id));
    var isMuted = videoObject.muted?true:false;
    isMuted = !isMuted;
    videoObject.muted = isMuted;
    muteButton.src = isMuted?"../images/muted.svg":"../images/audio.svg";
    //}
}
function muteVideo(muteButton) { //currently also mutes sound. find a way around this maybe just hide the video tag?
    var id = muteButton.id;
    id = parseInt(id);
    var videoObject = document.getElementById( getIdOfBox(id));
    if (videoObject.style.visibility=='hidden'){
      //videoObject.play();  //pause and play mute audio as well
      videoObject.style.visibility='visible';
      var paused = false;
      muteButton.setAttribute("style","-webkit-filter:invert(0%)")
    } else{
      //videoObject.pause();
      videoObject.style.visibility='hidden';
      var paused = true;
      muteButton.setAttribute("style","-webkit-filter:invert(100%)")
    }
    muteButton.src = paused?"../images/videomute.svg":"../images/video.svg";
}
function hangUp2(){
  window.location = "/lobby"; //testing
  //window.location = "https://creamstream.azurewebsites.net";
}
//hangUp is not needed at the moment.
function hangUp(element) {
  var id = element.id
  id = parseInt(id)
  if( id > 0) {
        var easyrtcid = easyrtc.getIthCaller(id-1)
        setTimeout( function() {
            easyrtc.hangup(easyrtcid)
        }, 400)
    }
}

function callEverybodyElse(roomName, otherPeople) {
    if(easyrtc.getConnectionCount() == maxCALLERS){
      easyrtc.showError("Room is full.", "Redirecting back to the home page.");
      window.location = "/lobby"

    } else {

    easyrtc.setRoomOccupantListener(null); // so we're only called once.

      var list = [];
      var connectCount = 0;
      for(var easyrtcid in otherPeople ) {
          list.push(easyrtcid);
      }
      //
      // Connect in reverse order. Latter arriving people are more likely to have
      // empty slots.
      //
      function establishConnection(position) {
          function callSuccess() {
              connectCount++;
              if( connectCount < maxCALLERS && position > 0) {
                  establishConnection(position-1);
              }
          }
          function callFailure(errorCode, errorText) {
              easyrtc.showError(errorCode, errorText);
              if( connectCount < maxCALLERS && position > 0) {
                  establishConnection(position-1);
              }
          }
          easyrtc.call(list[position], callSuccess, callFailure);

      }
      if( list.length > 0) {
          establishConnection(list.length-1);
      }
    }
}


function loginSuccess() {
    console.log("Connecting...");
}

// https://github.com/priologic/easyrtc/blob/f57190db98d2a25dc63067878448feda1b0d847a/api/easy_app.js#L276
function appInit(id) {
    console.log("Connecting to room'" + id + "'")
    if(easyrtc.getConnectionCount()==0){
      //host user should be muted and doesn't need the option to unmute
      document.getElementById("video0").muted = "muted";
      document.getElementById("0muteaudio").style.display = "none";
      updateCapacity();
    }

    easyrtc.setRoomOccupantListener(callEverybodyElse);
    window.onload = easyrtc.easyApp("creamstream." + String(id), getIdOfBox(0), [1,2,3,4,5].map(getIdOfBox), loginSuccess);
    easyrtc.setDisconnectListener( function() {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });
    easyrtc.setOnCall( function(easyrtcid, slot) {
        console.log("getConnection count="  + easyrtc.getConnectionCount() );
        boxUsed[slot+1] = true;
        updateCapacity();
    });


    //updates capacity and selects divs
    //bypasses errors created when say user 2 leave the room of 4 people.
    //Needs to show videos of users 1, 3, 4 still
    function updateCapacity () {
        var newIndex = 0
        boxUsed.forEach((active, index) => {
          if (active) {
            document.getElementById("focus-"+index).dataset.roomIndex = newIndex+1;
            //document.getElementById("focus-"+index).style.display = "block"
            newIndex++;
          }
        })
        document.querySelector("#vids.videos").dataset.capacity = newIndex;
    }

    easyrtc.setOnHangup(function(easyrtcid, slot) {
        boxUsed[slot+1] = false;
        connectCount--;
        updateCapacity()

        setTimeout(function() {
            //document.getElementById(getIdOfBox(slot+1)).style.visibility = "hidden";
            //removeView(easyrtc.getConnectionCount());

            if( easyrtc.getConnectionCount() == 0 ) { // no more connections
                //No more connections to the host. Host could still be in room
                //Close the room here.

            }
        },20);
    });
}
