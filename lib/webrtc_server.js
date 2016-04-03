var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module

// TODO: Use the room_id to create a room

module.exports =
function (webServer, httpApp) {
  // Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
  var socketServer = io.listen(webServer);
  
  // Overriding the default easyrtcAuth listener, only so we can directly access its callback
  easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
      easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
          if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
              callback(err, connectionObj);
              return;
          }

          connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

          console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

          callback(err, connectionObj);
      });
  });

  // To test, lets print the credential to the console for every room join!
  easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
      console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
      easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
  });


  // Start EasyRTC server
  var webrtc_server =  easyrtc.listen(httpApp, socketServer, null, function(err, rtcRef) {
      console.log("Initiated");

      rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
          console.log("roomCreate fired! Trying to create: " + roomName);

          appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
      })
  })

  return webrtc_server
}