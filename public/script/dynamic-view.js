

var activeBox = -1;  // nothing selected
var aspectRatio = 4/3;  // standard definition video aspect ratio
var maxCALLERS = 5;
var numVideoOBJS = maxCALLERS+1;

//Dynamic video functions ------------------------------------------
function revert(){
 document.getElementById("vids").classList.remove("getsmall");
 document.getElementById("revertView").style.display = "none";
}

function changeView(){
  document.getElementById("vids").classList.add("getsmall");
  document.getElementById("revertView").style.display = "block";
}
//addView and removeView may no longer be necessary. Kept for reference
/*function addView(count){
  console.log("adding a view for " + easyrtc.getConnectionCount())
  if (easyrtc.getConnectionCount()>0){
    document.getElementById("vids").classList.remove("one");
    //when someone joins a room with more than one person, it is bypassing one
  }
  switch(count-1) {
    case 0:
      document.getElementById("vids").classList.remove("one");
      break;
    case 1:
      document.getElementById("vids").classList.remove("two");
      break;
    case 2:
      document.getElementById("vids").classList.remove("three");
      break;
    case 3:
      document.getElementById("vids").classList.remove("four");
      break;
    case 4:
      document.getElementById("vids").classList.remove("five");
      break;
    case 5:
      document.getElementById("vids").classList.remove("six");
      break;
    default:
      break;
  }
  switch(count) {
    case 0:
      document.getElementById("vids").classList.add("one");
      document.getElementById("focus-0").style.display = "block";
      break;
    case 1:
      document.getElementById("vids").classList.add("two");
      document.getElementById("focus-1").style.display = "block";
      break;
    case 2:
      document.getElementById("vids").classList.add("three");
      document.getElementById("focus-2").style.display = "block";
      break;
    case 3:
      document.getElementById("vids").classList.add("four");
      document.getElementById("focus-3").style.display = "block";
      break;
    case 4:
      document.getElementById("vids").classList.add("five");
      document.getElementById("focus-4").style.display = "block";
      break;
    case 5:
      document.getElementById("vids").classList.add("six");
      document.getElementById("focus-5").style.display = "block";
      break;
  }
}

function removeView(count){
  switch(count+1) {
    case 0:
        document.getElementById("vids").classList.remove("one");
        document.getElementById("focus-0").style.display = "none";
        break;
    case 1:
        document.getElementById("vids").classList.remove("two");
        document.getElementById("focus-1").style.display = "none";
        break;
    case 2:
      document.getElementById("vids").classList.remove("three");
      document.getElementById("focus-2").style.display = "none";
      break;
    case 3:
      document.getElementById("vids").classList.remove("four");
      document.getElementById("focus-3").style.display = "none";
      break;
    case 4:
      document.getElementById("vids").classList.remove("five");
      document.getElementById("focus-4").style.display = "none";
      break;
    case 5:
      document.getElementById("vids").classList.remove("six");
      document.getElementById("focus-5").style.display = "none";
      break;
  }
  switch(count) {
     case 0:
        document.getElementById("vids").classList.add("one");
        break;
    case 1:
        document.getElementById("vids").classList.add("two");
        break;
    case 2:
      document.getElementById("vids").classList.add("three");
      break;
    case 3:
      document.getElementById("vids").classList.add("four");
      break;
    case 4:
      document.getElementById("vids").classList.add("five");
      break;
    case 5:
      document.getElementById("vids").classList.add("six");
      break;
  }
}*/
//End video functions------------------------------------------------

easyrtc.dontAddCloseButtons(true);

function getIdOfBox(boxNum) {
    return "video" + boxNum;
}

var boxUsed = [true, false, false, false, false, false];
var connectCount = 0;

function muteAudio(muteButton) {
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
    } else{
      //videoObject.pause();
      videoObject.style.visibility='hidden';
      var paused = true;
    }
    muteButton.src = paused?"../images/videomute.svg":"../images/video.svg";
}
function hangUp2(){
  window.location = "https://localhost:3000/lobby"; //testing
  //window.location = "https://creamstream.azurewebsites.net";
}
//hangUp is not needed at the moment.
function hangUp(element) {
  var id = element.id
  id = parseInt(id)
  console.log("id")
  if( id > 0) {
        console.log("hanging up")
        var easyrtcid = easyrtc.getIthCaller(id-1)
        //collapseToThumb()
        setTimeout( function() {
            easyrtc.hangup(easyrtcid)
        }, 400)
    }
}

function muteActiveBox() {
    updateMuteImage(true);
}

function callEverybodyElse(roomName, otherPeople) {

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


function loginSuccess() {
    console.log("Connecting...");  // expand the mirror image initially.
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
    //easyrtc.setPeerListener(messageListener);
    easyrtc.setDisconnectListener( function() {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });
    easyrtc.setOnCall( function(easyrtcid, slot) {
        console.log("getConnection count="  + easyrtc.getConnectionCount() );
        boxUsed[slot+1] = true;
        //document.getElementById(getIdOfBox(slot+1)).style.visibility = "visible";
        //handleWindowResize();
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

        //remove a view somewhere here
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
