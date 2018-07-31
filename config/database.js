if (process.env.NODE_ENV === 'production') {
	module.exports = {
		mongoURI: 'mongodb://ppp:ppp1234@ds159651.mlab.com:59651/vidjotppp'
	}
} else {
	module.exports = {
		mongoURI: 'mongodb://localhost:27017/vidjot-dev'
	}
}