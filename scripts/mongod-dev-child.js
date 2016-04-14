// This file helps us create a mongo server locally
var path = require('path')
var proc = require('child_process')
var node_cmd = process.env.NODE_EXEC || 'node'

exports.start = function StartMongod(mongodb_port, db_dir) {
  var mongod_cmd = node_cmd
  var mongod_js = path.join(__dirname, '../node_modules/mongodb-prebuilt/binjs', 'mongod.js')
  var mongod_args = [mongod_js, '--dbpath=../db-data/' + db_dir, '--logpath=../db-data/' + db_dir + '-log/log', '--port=' + mongodb_port]

  return proc.spawn(mongod_cmd, mongod_args, {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      'DEBUG': 'mongodb-prebuilt:*',
      'PATH': process.env.PATH,
    }
  })
}