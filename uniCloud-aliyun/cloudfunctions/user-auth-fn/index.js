/*
 * @Description:
 * @Author: lz
 * @Date: 2022-03-09 11:16:17
 * @LastEditTime: 2022-03-09 17:55:31
 * @LastEditors: lz
 */
"use strict";
exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log("event : ", event);
  //返回数据给客户端
  return new Promise((resolve, reject) => {
    const db = uniCloud.database();
    const collection = db
      .collection("user")
      .where(event)
      .get
      // 	  {
      //     getCount: true,
      //   }
      ()
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
  return event;
  //UNI_WYQ:这里的uniID换成新的，保证多人访问不会冲突
  uniID = uniID.createInstance({
    context,
  });
  /*
	1.event为客户端 uniCloud.callFunction填写的data的值，这里介绍一下其中的属性
	action：表示要执行的任务名称、比如：登录login、退出登录 logout等
	params：业务数据内容
	uniIdToken：系统自动传递的token，数据来源客户端的 uni.getStorageSync('uni_id_token')
*/
  const { action, uniIdToken, inviteCode } = event;
  const deviceInfo = event.deviceInfo || {};
  let params = event.params || {},
    tokenExpired;
  //event为客户端上传的参数
  console.log("event : ", event);

  let noCheckAction = [
    "register",
    "checkToken",
    "login",
    "logout",
    "sendSmsCode",
  ];
  if (!noCheckAction.includes(action)) {
    if (!uniIdToken) {
      return {
        code: 403,
        msg: "缺少token",
      };
    }
    let payload = await uniID.checkToken(uniIdToken);
    if (payload.code && payload.code > 0) {
      return payload;
    }
    params.uid = payload.uid;
    tokenExpired = payload.tokenExpired;
  }
  // 3.注册成功后触发。
  async function registerSuccess(res) {
    //用户接受邀请
    if (inviteCode) {
      await uniID.acceptInvite({
        inviteCode,
        uid,
      });
    }
    //添加当前用户设备信息
    await addDeviceInfo(res);
  }
  //4.记录成功登录的日志方法
  const loginLog = async (res = {}) => {
    const now = Date.now();
    const uniIdLogCollection = db.collection("uni-id-log");
    let logData = {
      deviceId: context.DEVICEID,
      ip: context.CLIENTIP,
      type: res.type,
      ua: context.CLIENTUA,
      create_date: now,
    };

    if (res.code === 0) {
      logData.user_id = res.uid;
      logData.state = 1;
      if (res.userInfo && res.userInfo.password) {
        delete res.userInfo.password;
      }
      if (res.type == "register") {
        await registerSuccess(res);
      } else {
        if (Object.keys(deviceInfo).length) {
          console.log(context.DEVICEID);
          //避免重复新增设备信息，先判断是否已存在
          let getDeviceRes = await deviceDB
            .where({
              device_id: context.DEVICEID,
            })
            .get();
          if (getDeviceRes.data.length == 0) {
            await addDeviceInfo(res);
          } else {
            await deviceDB
              .where({
                device_id: context.DEVICEID,
              })
              .update({
                ...deviceInfo,
                tokenExpired: res.tokenExpired,
                user_id: res.uid,
                device_id: context.DEVICEID,
                ua: context.CLIENTUA,
                platform: context.PLATFORM,
                create_date: Date.now(),
                last_active_date: Date.now(),
                last_active_ip: context.CLIENTIP,
              });
          }
        }
      }
    } else {
      logData.state = 0;
    }
    return await uniIdLogCollection.add(logData);
  };

  async function addDeviceInfo({ uid, tokenExpired }) {
    return await deviceDB.add({
      ...deviceInfo,
      tokenExpired,
      user_id: uid,
      device_id: context.DEVICEID,
      ua: context.CLIENTUA,
      platform: context.PLATFORM,
      create_date: Date.now(),
      last_active_date: Date.now(),
      last_active_ip: context.CLIENTIP,
    });
  }
  //防止恶意破解登录，连续登录失败一定次数后，需要用户提供验证码
  const isNeedCaptcha = async () => {
    //当用户最近“2小时内(recordDate)”登录失败达到2次(recordSize)时。要求用户提交验证码
    const now = Date.now(),
      recordDate = 120 * 60 * 1000,
      recordSize = 2;
    const uniIdLogCollection = db.collection("uni-id-log");
    let recentRecord = await uniIdLogCollection
      .where({
        deviceId: params.deviceId || context.DEVICEID,
        create_date: dbCmd.gt(now - recordDate),
        type: "login",
      })
      .orderBy("create_date", "desc")
      .limit(recordSize)
      .get();
    return (
      recentRecord.data.filter((item) => item.state === 0).length === recordSize
    );
  };
  let res = {};
  switch (
    action //根据action的值执行对应的操作
  ) {
    case "register":
      var { username, password, nickname } = params;
      if (/^1\d{10}$/.test(username)) {
        return {
          code: 401,
          msg: "用户名不能是手机号",
        };
      }
      if (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(username)) {
        return {
          code: 401,
          msg: "用户名不能是邮箱",
        };
      }
      res = await uniID.register({
        username,
        password,
        nickname,
        inviteCode,
      });
      if (res.code === 0) {
        await registerSuccess(res);
      }
      break;
    case "getNeedCaptcha": {
      const needCaptcha = await isNeedCaptcha();
      res.needCaptcha = needCaptcha;
      break;
    }
    case "login":
      let passed = false;
      let needCaptcha = await isNeedCaptcha();
      console.log("needCaptcha", needCaptcha);
      if (needCaptcha) {
        res = await uniCaptcha.verify({
          ...params,
          scene: "login",
        });
        if (res.code === 0) passed = true;
      }

      if (!needCaptcha || passed) {
        res = await uniID.login({
          ...params,
          queryField: ["username"],
        });
        res.type = "login";
        await loginLog(res);
        needCaptcha = await isNeedCaptcha();
      }
      res.needCaptcha = needCaptcha;
      break;
    case "loginByWeixin":
      let loginRes = await uniID.loginByWeixin(params);
      if (loginRes.code === 0) {
        //用户完善资料（昵称、头像）
        if (context.PLATFORM == "app-plus" && !loginRes.userInfo.nickname) {
          let { accessToken: access_token, openid } = loginRes,
            { appid, appsecret: secret } = uniIdConfig["app-plus"].oauth.weixin;
          let wxRes = await uniCloud.httpclient.request(
            `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&scope=snsapi_userinfo&appid=${appid}&secret=${secret}`,
            {
              method: "POST",
              contentType: "json", // 指定以application/json发送data内的数据
              dataType: "json", // 指定返回值为json格式，自动进行parse
            }
          );
          if (wxRes.status == 200) {
            let { nickname, headimgurl } = wxRes.data;
            let headimgurlFile = {},
              cloudPath = loginRes.uid + "/" + Date.now() + "headimgurl.jpg";
            let getImgBuffer = await uniCloud.httpclient.request(headimgurl);
            if (getImgBuffer.status == 200) {
              let { fileID } = await uniCloud.uploadFile({
                cloudPath,
                fileContent: getImgBuffer.data,
              });
              headimgurlFile = {
                name: cloudPath,
                extname: "jpg",
                url: fileID,
              };
            } else {
              return getImgBuffer;
            }
            await uniID.updateUser({
              uid: loginRes.uid,
              nickname,
              avatar_file: headimgurlFile,
            });
            loginRes.userInfo.nickname = nickname;
            loginRes.userInfo.avatar_file = headimgurlFile;
          } else {
            return wxRes;
          }
        }
        if (context.PLATFORM == "mp-weixin") {
          let resUpdateUser = await uniID.updateUser({
            uid: loginRes.uid,
            sessionKey: loginRes.sessionKey,
          });
          console.log(resUpdateUser);
        }
        delete loginRes.openid;
        delete loginRes.sessionKey;
        delete loginRes.accessToken;
        delete loginRes.refreshToken;
      }
      await loginLog(loginRes);
      return loginRes;
      break;
    case "loginByUniverify":
      res = await uniID.loginByUniverify(params);
      await loginLog(res);
      break;
    case "loginByApple":
      res = await uniID.loginByApple(params);
      await loginLog(res);
      break;
    case "checkToken":
      res = await uniID.checkToken(uniIdToken);
      break;
    case "logout":
      res = await uniID.logout(uniIdToken);
      await deviceDB
        .where({
          device_id: context.DEVICEID,
        })
        .update({
          tokenExpired: Date.now(),
        });
      break;
    case "sendSmsCode":
      /* -开始- 测试期间，为节约资源。统一虚拟短信验证码为： 123456；开启以下代码块即可  */
      return uniID.setVerifyCode({
        mobile: params.mobile,
        code: "123456",
        type: params.type,
      });
      /* -结束- */

      // 简单限制一下客户端调用频率
      const ipLimit = await db
        .collection("opendb-verify-codes")
        .where({
          ip: context.CLIENTIP,
          created_at: dbCmd.gt(Date.now() - 60000),
        })
        .get();
      if (ipLimit.data.length > 0) {
        return {
          code: 429,
          msg: "请求过于频繁",
        };
      }
      const templateId = "11753"; // 替换为自己申请的模板id
      if (!templateId) {
        return {
          code: 500,
          msg: "sendSmsCode需要传入自己的templateId，参考https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=sendsmscode",
        };
      }
      const randomStr = "00000" + Math.floor(Math.random() * 1000000);
      const code = randomStr.substring(randomStr.length - 6);
      res = await uniID.sendSmsCode({
        mobile: params.mobile,
        code,
        type: params.type,
        templateId,
      });
      break;
    case "loginBySms":
      if (!params.code) {
        return {
          code: 500,
          msg: "请填写验证码",
        };
      }
      if (!/^1\d{10}$/.test(params.mobile)) {
        return {
          code: 500,
          msg: "手机号码填写错误",
        };
      }
      res = await uniID.loginBySms(params);
      await loginLog(res);
      break;
    default:
      res = {
        code: 403,
        msg: "非法访问",
      };
      break;
  }
  //返回数据给客户端
  return res;
};
