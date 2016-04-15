
// mongoose is an Object Document Mapper for mongodb
var mongoose = require("mongoose")
var logger = require('morgan');

var mhost = process.env.MONGODB_HOST || 'localhost'
var mport = process.env.MONGODB_PORT || '27017'
var mdb = process.env.MONGODB_DB || 'creamstream-local'
var mconn = 'mongodb://' + mhost + ':' + mport + '/' + mdb

var connected_db = null

function connect (callback) {
  if (connected_db != null) {
    // already connected, so callback the connected
    setTimeout(callback, 0, connected_db)

  } else {
    function ConnectMongoDB () {
      var db = mongoose.connection
      // Setting up and connecting to MongoDB
      console.log('mongodb connecting to ' + mconn)
      mongoose.connect(mconn, console.log.bind(console, "MONGODB CONNECTION"))
      db.on('all', console.log.bind(console, 'MONGODB_VERBOSE'))
      db.on('error', console.error.bind(console, 'MONGODB_ERROR'))
      db.once('open', function MongooseConnectionCallback () {
        connected_db = db
        console.log('MongoDB connected!')
        if (callback) callback(db)
      })
    }

    ConnectMongoDB()
  }
}

var passwordHash = require('./password-hasher').hash

// Setting up Database classes
var roomSchema = mongoose.Schema({
  slug: {
    index: 1,
    type: String
  },
  name: String,
  private: Boolean,
  hash: String,
  salt: String,
  capacity: Number,
  creationDate: Date,
})

// callback(error: Error, document: Room)
function setPassword (password, callback) {
  passwordHash(password, (error, salt, hash) => {
    if (error) return callback(error)
    this.set('salt', salt)
    this.set('hash', hash)
    callback(null, this)
  })
}

// callback(error: Error, matches: boolean)
function verifyPassword (password, callback) {
  var salt = this.get('salt')
  var hash = this.get('hash')
  passwordHash(password, salt, (error, genhash) => {
    if (error) return callback(error)
    var passValid = hash === genhash
    callback(null, passValid)
  })
}

roomSchema.methods.setPassword = setPassword
roomSchema.methods.verifyPassword = verifyPassword

exports.Room = mongoose.model('Room', roomSchema)
exports.connect = connect
exports.rooms = {}