<!--
 * @Description: 
 * @Author: lz
 * @Date: 2022-02-25 22:59:47
 * @LastEditTime: 2022-02-25 22:59:47
 * @LastEditors: lz
-->
<template>
	<view class="uni-container">
		<view class="header">
			<view class="dataWrap">
				<text class="expense">总支出：<b>¥ 8.88</b></text>
				<text class="income">总收入：<b>¥ 8.88</b></text>
			</view>
			<view class="typeWrap">
				<view class="left">
					<text class="title">全部类型</text>
					<uni-icons type="bottom" color="#fff"></uni-icons>
				</view>
				<view class="right">
					<view class="example-body" @click="getTime()">
						<text class="time">{{single}}</text>
						<uni-icons type="bottom" color="#fff"></uni-icons>
						<!-- <uni-datetime-picker type="date" :value="single" start="2021-01" end="2025-06" @change="change"
							:border='false'>
							<text class="time">{{single}}</text>
							<uni-icons type="bottom" color="#fff"></uni-icons>
						</uni-datetime-picker> -->
					</view>
				</view>
			</view>
		</view>
		<view class="contentWrap">
			<uni-card is-full :border='false' margin='false' :padding='"false"' v-for="item in bills"
				:key='item.type_id'>
				<view slot="title" class="card-title">
					<view class="card-title-item left">
						<uni-dateformat :date="item.date" format='yyyy-MM-dd'></uni-dateformat>
					</view>
					<view class="card-title-item">
						<view class="card-title-item-price">
							<image src="../../../static/zhi@2x.png" mode="" alt='支'></image>
							<text>¥ {{item.amount}}</text>
						</view>
						<view class="card-title-item-price">
							<image src="../../../static/shou@2x.png" mode="" alt='收'></image>
							<text>¥ {{item.amount}}</text>
						</view>
					</view>
				</view>
				<view class="card-body">
					<view class="card-body-top">
						<view class="decs">
							<uni-icons type="wallet" size="24" color="#007fff"></uni-icons>
							<text>{{item.type}}</text>
						</view>
						<view class="price">
							-25.94
						</view>
					</view>
					<view class="card-body-date">
						11:58
					</view>
				</view>
				<!-- 				<view class="card-body">
					<view class="card-body-top">
						<view class="decs">
							<uni-icons type="fire-filled" size="24" color="#007fff"></uni-icons>
							<text>工资</text>
						</view>
						<view class="price reverse">
							+55.88
						</view>
					</view>
					<view class="card-body-date">
						11:54
					</view>
				</view> -->
			</uni-card>
		</view>
		<view class="add">
			<uni-icons type="compose" size="30" color="#007fff"></uni-icons>
		</view>
		<w-picker ref="date" :visible.sync="visible" mode="date" startYear="2017" endYear="2099" :value="single"
			fields="month" @confirm="onConfirm($event,'date')" @cancel="onCancel" :disabled-after="false">
		</w-picker>
	</view>
</template>
<script>
	import wPicker from "../../../components/w-picker/w-picker.vue";
	export default {
		components: {
			wPicker
		},
		data() {
			return {
				single: "2022-03",
				visible: false,
				bills: []
			}
		},
		onLoad() {

		},
		onReady() {
			console.log(this.$store)
			this.getBillList()
		},
		methods: {
			onConfirm(e) {
				this.single = e.value;
				console.log("-change事件:", e);
			},
			onCancel() {
				this.visible = false
			},
			getTime() {
				this.visible = true
				// this.$refs.date.show()
			},
			getBillList() {
				this.$Request.call({
					name: "handle-bill-fn",
					data: {
						date: 1646720483727,
						// page: 1,
						// page_size: 5,
					},
					success: (
						res
					) => {
						this.bills = res.result
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.uni-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		padding-top: 160rpx;
		width: 100%;
		box-sizing: border-box;

		.header {
			box-sizing: border-box;
			position: fixed;
			top: 0;
			left: 0;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
			height: 160rpx;
			background-color: #007fff;
			color: #fff;
			font-size: 28rpx;
			z-index: 100;
			padding: 20rpx;

			.dataWrap {
				font-size: $uni-font-size-sm*2;

				.expense,
				.income {
					font-size: $uni-font-size-sm;

					b {
						font-size: 26px;
						font-family: DINCondensed-Bold, DINCondensed;
						margin-left: 4px;
					}
				}

				.income {
					margin-left: 20rpx;
				}
			}

			.typeWrap {
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;

				.left,
				.right {
					align-self: flex-start;
					background: rgba(0, 0, 0, 0.1);
					border-radius: 60rpx;
					padding: 3px 8px;
					font-size: 12px;
				}

				.left {
					margin-right: 6px;
				}

				.uni-icons {
					font-size: 12px;
					margin-left: 4px;
				}
			}
		}

		.contentWrap {
			height: calc(100vh - 100rpx);
			overflow: hidden;
			overflow-y: scroll;
			background-color: #f5f5f5;
			padding: 20rpx;

			.uni-card {
				padding: 0 !important;
				border-radius: 20rpx;
				margin-bottom: 10px !important;

				/deep/ .uni-card__content {
					padding: 0 !important;
					line-height: 1;
				}
			}

			.card-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				background-color: #f9f9f9;
				height: 80rpx;
				border-bottom: 1px solid #eee;
				padding: 0 10px;

				.card-title-item {
					display: flex;
					align-items: center;
					justify-content: space-between;

					&.left {
						color: #000000e6;
						font-weight: 700;
						font-size: 16px;
					}

					.card-title-item-price {
						display: flex;
						align-items: center;
						margin-left: 20px;
						color: #000000e6;
						font-size: $uni-font-size-sm;

						uni-image {
							width: 40rpx;
							height: 40rpx;
							margin-right: 5px;
						}
					}
				}
			}

			.card-body {
				padding: 0 16px;
				background-color: #fff;

				&:not(&:nth-child(1)) {
					border-bottom: 1px solid #eee;
				}

				.card-body-top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 108rpx;
					font-size: 15px;

					.decs {
						display: flex;
						align-items: center;

						.uni-icons {
							margin-right: 2px;
						}
					}

					.price {
						color: rgb(57, 190, 119);

						&.reverse {
							color: red;
						}
					}
				}

				.card-body-date {
					padding-bottom: 20rpx;
					color: #000;
					font-size: $uni-font-size-sm;
				}
			}
		}

		.add {
			position: fixed;
			bottom: 200rpx;
			right: 60rpx;
			z-index: 1000;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			box-shadow: 0 0 20rpx 0 #0003;
			background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1PX solid #e9e9e9;
			color: #007fff;
		}
	}
</style>
