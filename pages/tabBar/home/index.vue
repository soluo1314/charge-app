<!--
 * @Description: 
 * @Author: lz
 * @Date: 2022-02-25 22:59:47
 * @LastEditTime: 2022-02-25 22:59:47
 * @LastEditors: lz
-->
<template>
	<view class="uni-container">
		首页
		<view class="header">
			<view class="dataWrap">
				<text class="expense">总支出：¥8.88</text>
				<text class="income">总收入：¥6.66</text>
			</view>
			<view class="typeWrap">
				<view class="left">
					<text class="title"></text>
				</view>
				<view class="right">
					<text class="time"></text>
				</view>
			</view>
		</view>
		<view class="contentWrap">

		</view>
		<view class="add">
			<uni-icons type="compose" size="30"></uni-icons>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {}
		},
		onLoad() {

		},
		onReady() {
			console.log(this.$store)
		},
		mounted() {
			// console.log(this.$store)
		}
	}
</script>

<style scoped lang="scss">
	.home {
		height: 100%;
		display: flex;
		flex-direction: column;
		padding-top: 160rpx;

		.header {
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
			font-size: 14px;
			z-index: 100;
			padding: 20rpx;

			.data-wrap {
				font-size: 28rpx;

				>span {
					font-size: 12px;

					>b {
						font-size: 26px;
						font-family: DINCondensed-Bold, DINCondensed;
						margin-left: 4px;
					}
				}

				.income {
					margin-left: 10px;
				}
			}

			.type-wrap {
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;

				>div {
					align-self: flex-start;
					background: rgba(0, 0, 0, 0.1);
					border-radius: 60rpx;
					padding: 3px 8px;
					font-size: 12px;
				}

				.left {
					margin-right: 6px;
				}

				.arrow {
					font-size: 12px;
					margin-left: 4px;
				}
			}
		}

		.content-wrap {
			height: calc(100% - 100rpx);
			overflow: hidden;
			overflow-y: scroll;
			background-color: #f5f5f5;
			padding: 10px;

			:global {
				.za-pull {
					overflow: unset;
				}
			}
		}

		.add {
			position: fixed;
			bottom: 200rpx;
			right: 30px;
			z-index: 1000;
			width: 50px;
			height: 50px;
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
