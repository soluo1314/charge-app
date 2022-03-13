<template>
	<view class="userinfo">
		<h1>个人资料</h1>
		<view class="item">
			<view class="title">
				头像
			</view>
			<view class="avatar">
				<image class="avatar-url" :src="user.avatar" alt="" />
				<view class="desc">
					<text class="desc-title">支持 jpg、png、jpeg 格式大小 200KB 以内的图片</text>
					<uni-file-picker class="upload" v-model="fileImage" :limit="1" file-mediatype="image"
						file-extname="png,jpg,jpeg" fileMediatype="all" :list-styles="listStyles" @success="success"
						@fail="fail" :del-icon='false' return-type='object'>
						<button class="upload-btn" type="primary" @click="upload()" size="mini">点击上传</button>
					</uni-file-picker>
				</view>
			</view>

		</view>
		<view class="item">
			<view class="title">
				个性签名
			</view>
			<view class="signature">
				<input type="text" v-model="user.signature" placeholder="请输入个性签名" />
			</view>

		</view>
		<button class="userinfo-save" type="primary" block @click="save()">保存</button>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'UserInfo',
		data() {
			return {
				fileImage: [],
				listStyles: {
					// 是否显示边框
					border: false,
					// 是否显示分隔线
					dividline: false,
					// 线条样式
					// borderStyle: {
					// 	width: 1,
					// 	color: 'blue',
					// 	radius: 2
					// }
				},
				user: {
					avatar: '',
					signature: '',
				}
			};
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info'
			})
		},
		created() {
			this.user = Object.assign(this.user, {
				...this.userInfo
			})
		},
		methods: {
			save() {},
			upload() {

			},
			// 上传成功
			success(e) {
				this.user.avatar = this.fileImage.url
				this.user.avatarName = this.fileImage.name
				this.fileImage = {}
				uni.showToast({
					title: '上传成功',
					icon: 'success'
				});
			},

			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
			}
		}
	}
</script>

<style lang="scss">
	.userinfo {
		padding: 0 20rpx;

		h1 {
			border-bottom: 1px solid #e9e9e9;
			padding-bottom: 10px;
			font-size: 48rpx;
		}

		.item {
			border-bottom: 1px solid #e9e9e9;
			margin-bottom: 20px;

			.title {
				font-size: 16px;
				padding: 10px;
			}

			.avatar {
				display: flex;
				margin-bottom: 20px;

				.avatar-url {
					width: 160rpx;
					height: 160rpx;
					flex-shrink: 0;
					border-radius: 50%;
				}

				.desc {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					margin-left: 20rpx;

					.desc-title {
						font-size: $uni-font-size-sm;
						white-space: nowrap;
					}

					.upload {

						// width: 400rpx;.
						.upload-btn {
							// line-height: 1.5;
						}
					}
				}
			}

			.signature {
				padding: 0 10px;
			}
		}

		.userinfo-save {
			margin-top: 100rpx;
		}
	}
</style>
