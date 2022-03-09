<template>
  <view class="login">
    <view class="login-head"> </view>
    <view class="login-tab">
      <text
        class="text"
        :class="{ active: loginType === 'login' }"
        @click="setType('login')"
        >登录</text
      >
      <text
        class="text"
        :class="{ active: loginType === 'register' }"
        @click="setType('register')"
        >注册</text
      >
    </view>
    <uni-forms
      class="login-form"
      ref="loginForm"
      v-model:modelValue="formUser"
      :rules="rules"
    >
      <uni-forms-item name="username">
        <uni-easyinput
          type="text"
          v-model:value="formUser.username"
          prefixIcon="person-filled"
          placeholder="请输入账号"
        />
      </uni-forms-item>
      <uni-forms-item name="password">
        <uni-easyinput
          type="password"
          v-model:value="formUser.password"
          placeholder="请输入密码"
          prefixIcon="locked-filled"
        />
      </uni-forms-item>
    </uni-forms>
    <view class="login-operation">
      <button @click="onSubmit" type="primary">
        {{ loginType === "login" ? "登录" : "注册" }}
      </button>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      loginType: "login",
      formUser: {
        username: "admin",
        password: "123456",
      },
      rules: {
        // 对name字段进行必填验证
        username: {
          rules: [
            {
              required: true,
              errorMessage: "请输入用户名",
            },
            {
              minLength: 5,
              errorMessage: "姓名长度不能少于 {minLength} 个字符",
            },
          ],
        },
        // 对email字段进行必填验证
        password: {
          rules: [
            {
              required: true,
              errorMessage: "请输入用户密码",
            },
          ],
        },
      },
    };
  },
  onLoad() {},
  methods: {
    setType(type) {
      this.loginType = type;
    },
    setUsers(value, type) {
      this.formUser[type] = value ? value : "";
    },
    // 触发提交表单
    onSubmit() {
      this.$refs.loginForm
        .validate()
        .then((res) => {
          console.log("表单数据信息：", res);
          this.loging(res);
        })
        .catch((err) => {
          console.log("表单错误信息：", err);
        });
    },
    loging(params) {
      //   if (!this.agree) {
      //     return uni.showToast({
      //       title: this.$t("common").noAgree,
      //       icon: "none",
      //     });
      //   }
      // 下边是可以登录
      uniCloud.callFunction({
        name: "user-auth-fn",
        data: {
          ...params,
        },
        success: ({ result }) => {
          console.log(result);
          if (result.affectedDocs) {
            uni.showToast({
              title: "登录成功",
              icon: "success",
            });
          }else{
			  uni.showToast({
              title: "登录失败",
              icon: "fail",
            });
		  }
        },
        fail(err) {
          console.log(err);
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login {
  min-height: 100%;
  background-image: linear-gradient(
    217deg,
    #6fb9f8,
    #3daaf85e,
    #49d3fc1a,
    #3fd3ff00
  );

  .login-head {
    height: 400rpx;
    background: url("../../static/cryptocurrency.png") no-repeat center;
    background-size: 120%;
    border-bottom-left-radius: 24rpx;
    border-bottom-right-radius: 24rpx;

    img {
      width: 68rpx;
      margin: 30rpx 0 0 30rpx;
    }
  }

  .login-tab {
    color: #597fe7;
    padding: 60rpx 48rpx 20rpx 48rpx;

    .text {
      margin-right: 20rpx;
      font-size: 28rpx;
      font-weight: bold;

      &.active {
        font-size: 40rpx;
        border-bottom: 4rpx solid #597fe7;
        padding-bottom: 12rpx;
      }
    }
  }

  .login-form {
    padding: 0 48rpx;
  }

  .login-operation {
    padding: 20rpx 48rpx 0 48rpx;
  }

  .captcha-box {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

  .captcha-img {
    margin: 0 15px 10px 0;
    width: 250rpx;
  }

  .captcha {
    width: 350rpx;
  }
}
</style>
