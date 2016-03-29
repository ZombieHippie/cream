
var selfsigned = require('selfsigned')
var dns = require('dns')
var dns_lookup = dns.lookup
var os = require('os')

module.exports = function (callback) {
  dns_lookup(os.hostname(), function(err, add, fam) {
    if (err) callback(err)
    else if (add) {
      var attrs = [{ name: 'commonName', value: add }]
      try {
        var pems = selfsigned.generate(attrs, { days: 365 })
        callback(null, pems)
      } catch (error) {
        callback(error)
      }
    } else {
      callback("Could not generate SSL because we couldn't get your ip address.")
    }
  })
}
