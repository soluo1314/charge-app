'use strict';
const {
	verifyToken
} = require('wx-common')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {
		uniIdToken
	} = event
	let res = {
		code: 200
	}
	if (!uniIdToken || !verifyToken(uniIdToken)) {
		res['code'] = -1
		res['msg'] = '校验失败'
		return res
	}
	const db = uniCloud.database();
	const types = await db
		.collection("business-types").get()
		console.log(types);
	if (types.affectedDocs) {
		res['result'] = types.data
	}
	//返回数据给客户端
	return res
};
