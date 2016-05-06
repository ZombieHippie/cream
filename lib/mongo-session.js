// Stores our sessions into mongodb
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

module.exports = function (mongo_uri) {
  var store = new MongoDBStore({
    uri: mongo_uri,
    collection: 'sessions'
  });

  // Catch errors
  store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
  });
  return require('express-session')({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store
  })
}
