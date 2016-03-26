
if (global.database == null) {
	global.database = {
		rooms: {
			"hello": {
				private: true,
				password: "welcome",
				capacity: 6,
				peers: [
					{
						ip: "192.168.12.12",
						connected: true,
					}
				]
			}
		}
	}
}

module.exports = global.database