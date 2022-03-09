/*
 * @Description:
 * @Author: lz
 * @Date: 2022-03-09 11:16:17
 * @LastEditTime: 2022-03-09 17:55:31
 * @LastEditors: lz
 */
"use strict";
const {
	appId,
	appSecret,
	getToken
} = require('wx-common')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log("event : ", event);
	//返回数据给客户端
	// const res = await uniCloud.httpclient.request(
	// 	"https://api.weixin.qq.com/sns/jscode2session?appid="+appId+"&secret="+appSecret+"&js_code="+code+"&grant_type=authorization_code",
	// 	{
	// 		dataType:"json"
	// 	}
	// )
	const db = uniCloud.database();
	const openid = 'asdaxczx24242xasxa';//先写死 小程序通过微信openid获取
	let token = getToken(openid);
	let userData = {
		code: 100000,
		msg: '账号或密码错误,请重试'
	}
	// 登录
	if (event.loginType) {
		const databaseUser = await db
			.collection("user").where({
				username: event.username,
				password: event.password
			}).get()

		if (databaseUser.affectedDocs) {
			userData = databaseUser.data[0]
			userData["token"] = token;
			userData["code"] = 200;
			delete userData["password"];
		}
	} else {
		const findUser = await db
			.collection("user").where({
				username: event.username,
			}).get()
		if (findUser.affectedDocs <= 0) {
			userData = {
				username: event.username,
				password: event.password,
				avatar: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7f440455-44a5-4f19-9b84-2a1a07efe17c/fa83612c-8f09-4988-acca-0e93a099b6ff.jpg",
				signature: "世界和平",
				token: token,
			}
			await db.collection("user")
				.add(userData)
			userData['code'] = 200
			delete userData["password"];
		} else {
			userData["msg"] = '用户名已存在'
		}
	}
	return userData
};
