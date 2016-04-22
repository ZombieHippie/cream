

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

function addView(count){
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
  return connectCount;
}
//End video functions------------------------------------------------

easyrtc.dontAddCloseButtons(true);

function getIdOfBox(boxNum) {
    return "box" + boxNum;
}

var boxUsed = [true, false, false, false, false, false];
var connectCount = 0;

function updateMuteImage(toggle) {
    var muteButton = document.getElementById('muteButton');
    if( activeBox > 0) { // no kill button for self video
        muteButton.style.display = "block";
        var videoObject = document.getElementById( getIdOfBox(activeBox));
        var isMuted = videoObject.muted?true:false;
        if( toggle) {
            isMuted = !isMuted;
            videoObject.muted = isMuted;
        }
        muteButton.src = isMuted?"../images/button_unmute.png":"../images/button_mute.png";
    }
    else {
        muteButton.style.display = "none";
    }
}

function killActiveBox() {
    if( activeBox > 0) {
        var easyrtcid = easyrtc.getIthCaller(activeBox-1);
        //collapseToThumb();
        setTimeout( function() {
            easyrtc.hangup(easyrtcid);
        }, 400);
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
    console.log("connecting");  // expand the mirror image initially.
}

// https://github.com/priologic/easyrtc/blob/f57190db98d2a25dc63067878448feda1b0d847a/api/easy_app.js#L276
function appInit(id) {
    console.log("Connecting to '" + id + "'")


    easyrtc.setRoomOccupantListener(callEverybodyElse);
    window.onload = easyrtc.easyApp("creamstream." + String(id), "box0", ["box1", "box2", "box3", "box4", "box5"], loginSuccess);
    //easyrtc.setPeerListener(messageListener);
    easyrtc.setDisconnectListener( function() {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });
    easyrtc.setOnCall( function(easyrtcid, slot) {
        console.log("getConnection count="  + easyrtc.getConnectionCount() );
        boxUsed[slot+1] = true;
        addView(easyrtc.getConnectionCount());
        //document.getElementById(getIdOfBox(slot+1)).style.visibility = "visible";
        //handleWindowResize();
    });


    easyrtc.setOnHangup(function(easyrtcid, slot) {
        boxUsed[slot+1] = false;
        connectCount--;
        //remove a view somewhere here
        setTimeout(function() {
            document.getElementById(getIdOfBox(slot+1)).style.visibility = "hidden";
            removeView(easyrtc.getConnectionCount());

            if( easyrtc.getConnectionCount() == 0 ) { // no more connections
                //Close the room here


                //document.getElementById('textEntryButton').style.display = 'none';
                //document.getElementById('textentryBox').style.display = 'none';
            }
            //handleWindowResize();
        },20);
    });
}
