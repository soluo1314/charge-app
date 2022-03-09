const jwt = require('jsonwebtoken')
const appSecret = '39f2f9189d76cfa3c1c18b2d110dae60'
const appId = 'wx292a3dacc51d546c'

function getToken(openid) {
	return jwt.sign({
		openid: openid
	}, appSecret, {
		expiresIn: 60 * 60 * 24
	})
}

function verifyToken(token) {
	return jwt.verify(token, appSecret)
}
module.exports = {
	appId,
	appSecret,
	getToken,
	verifyToken
}
