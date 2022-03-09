let token = uni.getStorageSync('token');

function call(option) {
	return new Promise((resolve, reject) => {
		if (!option.data) option.data = {};
		if (token) option.data.token = token;
		uni.showLoading({
			mask: true
		});
		uniCloud.callFunction({
			name: option.name,
			data: option.data,
			success: (res) => {
				console.log(res)
				uni.hideLoading();
				if (res.result.code == 200) {
					if (res.result.token) {
						token = res.result.token;
						uni.setStorageSync('token', res.result.token);
					}
					if (option.success) option.success(res.result.data);
					resolve(res.result);
				} else if (res.result.code == 201) {
					uni.showToast({
						icon: 'none',
						title: res.result.msg
					})
					if (option.fail) option.fail(res);
				} else if (res.result.code == -1) {
					// uni.clearStorageSync();
					uni.showToast({
						icon: 'none',
						title: token ? '请重新登录' : '请登录'
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}, 1000)
				}else if (res.result.code == 100000) {
					// uni.clearStorageSync();
					uni.showToast({
						icon: 'none',
						title: res.result.msg ? res.result.msg : '请重新登录'
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}, 1000)
				}
			},
			fail: (err) => {
				uni.hideLoading();
				if (option.fail) option.fail(err);
				reject();
			},
			complete: () => {
				uni.hideLoading();
				if (option.complete) option.complete();
			}
		});
	});
}
module.exports = {
	call: call
}
