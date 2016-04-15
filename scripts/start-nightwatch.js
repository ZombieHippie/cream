var path = require('path')
var proc = require('child_process')

exports.StartNightWatch =
function StartNightWatch(node_cmd, app_port, app_child, mongod_child) {
  var nw_cmd = node_cmd
  var nw_js = path.join(__dirname, '../node_modules/nightwatch/bin', 'runner.js')
  var nw_args = [nw_js, '--config=nightwatch.js']
  var nw_child = proc.spawn(nw_cmd, nw_args, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../'),
    env: {
      'APP_PORT': app_port,
      'DEBUG': 'nightwatch:*'
    }
  })

  setTimeout(function () {
    nw_child.kill()
  }, 10000)

  nw_child.on('close', function(code) {
    app_child.kill()
    mongod_child.kill()
    process.exit(code)
  })

  return nw_child
}