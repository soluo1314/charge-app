<!--
 * @Description: 
 * @Author: lz
 * @Date: 2022-02-25 23:00:14
 * @LastEditTime: 2022-02-25 23:00:14
 * @LastEditors: lz
-->
<template>
	<view class="uni-container">
		<view class="head">
			<view class="info">
				<text class="span">昵称: {{userInfo.username}}</text>
				<text class="span">
					<image src="//s.yezgea02.com/1615973630132/geqian.png" mode=""
						:style="{width:'60rpx',height:'60rpx',verticalAlign: '-20rpx'}" alt=''></image>
					<b>{{userInfo.signature || '暂无内容'}}</b>
				</text>
			</view>
			<image class="avatar" :src="userInfo.avatar" mode="" alt=''
				:style="{width:'120rpx',height:'120rpx',borderRadius: 8}">
			</image>
		</view>
		<view class="content">
			<view class="body" @click="userTo('/pages/userinfo/userinfo')">
				<view>
					<uni-icons type="gear-filled" size='20'></uni-icons>
					<text>用户信息修改</text>
				</view>
				<uni-icons type="right" size='20'></uni-icons>
			</view>

			<view class="body">
				<view>
					<uni-icons type="refresh-filled" size='20'></uni-icons>
					<text>重置密码</text>
				</view>
				<uni-icons type="right" size='20'></uni-icons>
			</view>
			<view class="body last-body">
				<view>
					<uni-icons type="person-filled" size='20'></uni-icons>
					<text>关于我们</text>
				</view>
				<uni-icons type="right" size='20'></uni-icons>
			</view>
		</view>
		<button class="logout" type="warn" block @click="logOut()">退出登录</button>
	</view>
</template>
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info'
			})
		},
		methods: {
			...mapMutations({
				M_USER_LOGOUT: 'user/M_LOGOUT'
			}),
			userTo(path) {
				uni.navigateTo({
					url: path
				});
			},
			//退出登录
			logOut() {
				this.M_USER_LOGOUT()
				uni.showToast({
					title: '退出成功',
					icon: 'loading',
					duration: 3000
				});
				setTimeout(()=>{
					uni.reLaunch({
						url: '/pages/login/login'
					});
				},1000)
			}
		}
	}
</script>
<style scoped lang="scss">
	.uni-container {
		min-height: 100%;
		background-color: #f5f5f5;

		.head {
			height: 320rpx;
			background-image: linear-gradient(189deg, #0033d6, #215ae4, #277ff2, #18a4ff);
			// background: url('//s.yezgea02.com/1615971681107/%E4%BD%8D%E5%9B%BE%402x.png') no-repeat;
			background-size: cover;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			padding: 48rpx;

			.info {
				display: flex;
				flex-direction: column;

				>.span {
					color: #fff;
				}

				.span:nth-of-type(1) {
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 6px;
					align-self: baseline;
					background-color: rgba(89, 127, 231, 1);
					padding: 2px 10px;
					border-radius: 40rpx;
				}

				.span:nth-of-type(2) {
					font-size: 28rpx;
				}
			}
		}

		.content {
			width: 85%;
			position: absolute;
			top: 240rpx;
			left: 50%;
			transform: translateX(-50%);
			box-shadow: 3px 2px 20px 10px rgba(0, 0, 0, .1);
			border-radius: 10px;
			overflow: hidden;
			background-color: #f5f5f5;
			padding: 0 32rpx;

			.body {
				padding: 30rpx 0;
				@extend .cs-flex-ai-center;
				justify-content: space-between;

				&:not(.last-body) {
					border-bottom: 2rpx solid #cccccc;
				}

				.uni-icons {
					margin-right: 32rpx;
				}

				span {
					color: #343434
				}
			}
		}

		.logout {
			width: 90%;
			position: absolute;
			bottom: 70rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
