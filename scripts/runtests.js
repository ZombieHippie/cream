/** RUNTESTS.js
  * This file starts a database instance, spins up the app, and runs nightwatch.
  */

var proc = require('child_process')
var path = require('path')
var node_cmd = process.env.NODE_EXEC || 'node'
var travis = !!process.env.TRAVIS


/** Use intermediate process spawner to debug */
var oldSpawn = proc.spawn;
proc.spawn = function debugSpawn() {
    console.log('RUNTESTS.js', 'spawn called:')
    console.log('RUNTESTS.js', arguments)
    var result = oldSpawn.apply(this, arguments);
    return result;
};

var mongodb_port = '17010'
var app_port = '17011'

var mongod_child = require('./mongod-dev-child.js').start(mongodb_port, 'test-db')

mongod_child.on('close', function(code) {
  process.exit(code)
})

/** Space out the following tasks so they don't overlap in Travis */

var app_child = null
var app_cmd = node_cmd
var app_js = path.join(__dirname, '../bin/www')
var app_args = [ app_js ]


var space = travis ? 5000 : 1000
setTimeout(function () {
  app_child = StartApp()
  if (!travis) {
    var StartNightWatch = require('./start-nightwatch').StartNightWatch
    setTimeout(StartNightWatch, space, node_cmd, app_port, app_child, mongod_child)
  }
}, space)

function StartApp () {
  var app_child = proc.spawn(app_cmd, app_args, {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      'env': 'development',
      'MONGODB_HOST': 'localhost:' + mongodb_port,
      'DEBUG': 'cream:*,nightwatch:*',
      'PORT': app_port,
    }
  })

  app_child.on('close', function(code) {
    process.exit(code)
  })

  process.env.APP_PORT = app_port
  return app_child
}

