'use strict';
const {
	verifyToken
} = require('wx-common')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {
		date,
		page,
		page_size = 5,
		type_id = 'all',
		uniIdToken
	} = event
	let res = {
		code: 200
	}
	if (!verifyToken(uniIdToken)) {
		res['code'] = -1
		res['msg'] = '校验失败'
		return res
	}
	let query={
		date
	}
	const db = uniCloud.database();
	const Bills = await db
		.collection("bill").where(query).get()
		if(Bills.affectedDocs){
			res['result']=Bills.data
		}
	//返回数据给客户端
	return res
};
