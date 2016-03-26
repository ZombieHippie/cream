var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module

module.exports =
function (webServer, httpApp) {
  // Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
  var socketServer = io.listen(webServer);
  var easyrtcListener;

  // Configure EasyRTC to load demos from /easyrtcdemos/
  easyrtc.setOption("demosPublicFolder", "/easyrtcdemos");

  // Start EasyRTC server with options to change the log level and add dates to the log.
  var easyrtcServer = easyrtc.listen(
          httpApp,
          socketServer,
          {logLevel:"debug", logDateEnable:true},
          function(err, rtc) {

              // After the server has started, we can still change the default room name
              rtc.setOption("roomDefaultName", "SectorZero");

              // Creates a new application called MyApp with a default room named "SectorOne".
              rtc.createApp(
                  "easyrtc.instantMessaging",
                  {"roomDefaultName":"SectorOne"},
                  myEasyrtcApp
              );
          }
  );

  // Setting option for specific application
  var myEasyrtcApp = function(err, appObj) {
      // All newly created rooms get a field called roomColor.
      // Note this does not affect the room "SectorOne" as it was created already.
      appObj.setOption("roomDefaultFieldObj",
           {"roomColor":{fieldValue:"orange", fieldOption:{isShared:true}}}
      );
  };

}