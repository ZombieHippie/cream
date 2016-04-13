
var path = require('path')
var proc = require('child_process')

exports.start = function StartMongod(mongodb_port) {
  var mongod_cmd = 'node'
  var mongod_js = path.join(__dirname, 'node_modules/mongodb-prebuilt/binjs', 'mongod.js')
  var mongod_args = [ mongod_js, '--dbpath=./test-db', '--logpath=./test-db-log/log', '--port=' + mongodb_port]

  return proc.spawn(mongod_cmd, mongod_args, {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      'DEBUG': 'mongodb-prebuilt:*',
      'PATH': process.env.PATH,
    }
  })
}