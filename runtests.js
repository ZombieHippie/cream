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
var app_js = path.join(__dirname, 'bin/www')
var app_args = [ app_js ]

var nw_child = null
var nw_cmd = node_cmd
var nw_js = path.join(__dirname, 'node_modules/nightwatch/bin', 'runner.js')
var nw_args = [nw_js, '--config=nightwatch.js']

/** If Travis run headless */
if (travis) {
  nw_args = ['-a', '--server-args="-screen 0 1600x1200x24"', nw_cmd].concat(nw_args)
  nw_cmd = "xvfb-run" 
}

var space = travis ? 5000 : 1000
setTimeout(function () {
  StartApp()
  setTimeout(StartNightWatch, space)
}, space)

function StartApp () {
  app_child = proc.spawn(app_cmd, app_args, {
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
}

function StartNightWatch () {
  nw_child = proc.spawn(nw_cmd, nw_args, {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      'APP_PORT': app_port,
    }
  })

  nw_child.on('close', function(code) {
    app_child.kill()
    mongod_child.kill()
    process.exit(code)
  })  
}
