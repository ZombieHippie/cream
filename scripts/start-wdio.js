var path = require('path')
var proc = require('child_process')

exports.StartWebdriverIO =
function StartWebdriverIO(node_cmd, app_port, app_child, mongod_child) {
  var wd_cmd = node_cmd
  var wd_js = path.join(__dirname, '../node_modules/webdriverio/bin', 'wdio')
  var wd_args = [wd_js, 'wdio.conf.js']
  var wd_child = proc.spawn(wd_cmd, wd_args, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../'),
    env: {
      'APP_PORT': app_port
    }
  })

  setTimeout(function () {
    wd_child.kill()
  }, 10000)

  wd_child.on('close', function(code) {
    app_child.kill()
    mongod_child.kill()
    process.exit(code)
  })

  return wd_child
}