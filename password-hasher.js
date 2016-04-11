// Module dependencies.

var crypto = require('crypto')

// Bytesize.

var len = 128

// Iterations. ~300ms

var iterations = 12000

/**
* Hashes a password with optional `salt`, otherwise
* generate a salt for `pass` and invoke `fn(err, salt, hash)`.
*
* @param {String} password to hash
* @param {String} optional salt
* @param {Function} callback
* @api public
*/
exports.hash = function (pwd, salt, callback) {
  if (3 === arguments.length) {
    crypto.pbkdf2(
      pwd,
      salt,
      iterations,
      len,
      function (err, hash) {
        callback(err, hash.toString('base64'))
      }
    )
  }
  else {
    callback = salt
    crypto.randomBytes(len, function (err, salt) {
      if (err) return callback(err)
      salt = salt.toString('base64')
      crypto.pbkdf2(
        pwd,
        salt,
        iterations,
        len,
        function (err, hash) {
          if (err) return callback(err)
          callback(null, salt, hash.toString('base64'))
        }
      )
    }
    )
  }
}