var selfEasyrtcid = "";
var haveSelfVideo = false;
var otherEasyrtcid = null;

console.log("Initializing.");
easyrtc.setRoomOccupantListener(convertListToButtons);
easyrtc.connect("easyrtc.multistream", loginSuccess, loginFailure);
easyrtc.setAutoInitUserMedia(false);
easyrtc.getVideoSourceList(
  function(videoSrcList) {
    for (var i = 0; i < videoSrcList.length; i++) {
      var videoEle = videoSrcList[i];
      var videoLabel = videoSrcList[i].label;
      easyrtc.setVideoSource(videoEle.id);
      easyrtc.initMediaSource(
        function(stream) {
          addMediaStreamToDiv("localVideos", stream, videoLabel, true);
          if( otherEasyrtcid) {
              easyrtc.addStreamToCall(otherEasyrtcid, videoLabel,
                 function(easyrtcid, streamName){
                  easyrtc.showError("Informational", "other party " +
                  easyrtcid + " acknowledges receiving " + streamName);
              });
          }
      },
      function(errCode, errText) {
          easyrtc.showError(errCode, errText);
      }, videoLabel);
    }
});


function disable(domId) {
    console.log("about to try disabling "  +domId);
    document.getElementById(domId).disabled = "disabled";
}


function enable(domId) {
    console.log("about to try enabling "  +domId);
    document.getElementById(domId).disabled = "";
}



function addMediaStreamToDiv(divId, stream, streamName, isLocal)
{
    var container = document.createElement("div");
    container.style.marginBottom = "10px";
    var formattedName = streamName.replace("(", "<br>").replace(")", "");
    var labelBlock = document.createElement("div");
    labelBlock.style.width = "220px";
    labelBlock.style.cssFloat = "left";
    labelBlock.innerHTML = "<pre>" + formattedName + "</pre><br>";
    container.appendChild(labelBlock);
    var video = document.createElement("video");
    video.width = 320;
    video.height = 240;
    video.muted = isLocal;
    video.style.verticalAlign= "middle";
    container.appendChild(video);
    document.getElementById(divId).appendChild(container);
    video.autoplay = true;
    easyrtc.setVideoObjectSrc(video, stream);
    return labelBlock;
}


//_____________________________________________________________________________


function hangup() {
    easyrtc.hangupAll();
    disable('hangupButton');
}

function clearConnectList() {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
}

function convertListToButtons(roomName, occupants, isPrimary) {
    clearConnectList();
    var otherClientDiv = document.getElementById('otherClients');
    for (var easyrtcid in occupants) {
        var button = document.createElement('button');
        button.onclick = function(easyrtcid) {
            return function() {
                performCall(easyrtcid);
            };
        }(easyrtcid);

        var label = document.createTextNode("Call " + easyrtc.idToName(easyrtcid));
        button.appendChild(label);
        otherClientDiv.appendChild(button);
    }
}


function performCall(targetEasyrtcId) {
    var acceptedCB = function(accepted, easyrtcid) {
        if (!accepted) {
            easyrtc.showError("CALL-REJECTED", "Sorry, your call to " + easyrtc.idToName(easyrtcid) + " was rejected");
            enable('otherClients');
        }
        else {
            otherEasyrtcid = targetEasyrtcId;
        }
    };

    var successCB = function() {
        enable('hangupButton');
    };
    var failureCB = function() {
        enable('otherClients');
    };
    var keys = easyrtc.getLocalMediaIds();

    easyrtc.call(targetEasyrtcId, successCB, failureCB, acceptedCB, keys);
    enable('hangupButton');
}


function loginSuccess(easyrtcid) {
    disable("connectButton");
    //  enable("disconnectButton");
    enable('otherClients');
    selfEasyrtcid = easyrtcid;
    document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
}


function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}


function disconnect() {
    document.getElementById("iam").innerHTML = "logged out";
    easyrtc.disconnect();
    enable("connectButton");
//    disable("disconnectButton");
    clearConnectList();
    easyrtc.setVideoObjectSrc(document.getElementById('selfVideo'), "");
}

easyrtc.setStreamAcceptor(function(easyrtcid, stream, streamName) {
    var labelBlock = addMediaStreamToDiv("remoteVideos", stream, streamName, false);
    labelBlock.parentNode.id = "remoteBlock" + easyrtcid + streamName;
    console.log("accepted incoming stream with name " + stream.streamName);
    console.log("checking incoming " + easyrtc.getNameOfRemoteStream(easyrtcid, stream));
});



easyrtc.setOnStreamClosed(function(easyrtcid, stream, streamName) {
    var item = document.getElementById("remoteBlock" + easyrtcid + streamName);
    item.parentNode.removeChild(item);
});


var callerPending = null;

easyrtc.setCallCancelled(function(easyrtcid) {
    if (easyrtcid === callerPending) {
        document.getElementById('acceptCallBox').style.display = "none";
        callerPending = false;
    }
});

easyrtc.setAcceptChecker(function(easyrtcid, callback) {
    otherEasyrtcid = easyrtcid;
    if (easyrtc.getConnectionCount() > 0) {
        easyrtc.hangupAll();
    }
    callback(true, easyrtc.getLocalMediaIds());
});
