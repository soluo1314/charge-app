<template>
	<uni-popup type="bottom" ref='Popup' @maskClick='toggle' :safe-area='false'>
		<view class="pop">
			<view class="header van-hairline--bottom">
				请选择类型
				<uni-icons type="closeempty" class="cross" size="20" @click="toggle"></uni-icons>
			</view>
			<view class="content">
				<view @click="choseType({ id: 'all' })" :class="{ all: true, active: state.active == '全部类型' }">全部类型
				</view>
				<view class="title">支出</view>
				<view class="expense-wrap">
					<view class="wrap-p" @click="choseType(item)" :class="{active: state.active == item.id}"
						v-for="(item,index) in 10" :key="index">测试</view>
				</view>
				<view class="title">收入</view>
				<view class="income-wrap">
					<view class="wrap-p" @click="choseType(item)" :class="{active: state.active == item.id}"
						v-for="(item,index) in 6" :key="index">
						测试
					</view>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		props: {
			show: Boolean
		},
		data() {
			return {
				state: {
					active: '全部类型',
					show: false,
					expense: [],
					income: []
				}
			}
		},
		onLoad() {
			// this.init()
		},
		watch: {
			show(val) {
				if (val) {
					this.$refs.Popup.open()
				}
			}
		},
		methods: {
			toggle() {
				this.$emit('update:show', false)
				this.$refs.Popup.close()
			},
			choseType(item) {
				this.state.active = item.id
				this.state.show = false
				this.$emit('onSelect', item)
			},
			init() {
				// const {
				// 	data: {
				// 		list
				// 	}
				// } = await axios.get('/type/list')
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
				})
				// this.state.expense = list.filter(i => i.type == 1)
				// this.state.income = list.filter(i => i.type == 2)
			}
		},
	}
</script>

<style lang='less' scoped>
	* {
		box-sizing: border-box;
	}

	.uni-popup {
		z-index: 1001;
	}

	.pop {
		position: relative;
		background-color: #f5f5f5;
		.header {
			position: sticky;
			top: 0;
			left: 0;
			z-index: 1000;
			width: 100%;
			height: 112rpx;
			text-align: center;
			font-size: 14px;
			line-height: 112rpx;
			color: #000000e6;
			background-color: #fff;
			.cross {
				position: absolute;
				right: 20rpx;
				top: 50%;
				font-size: 20px;
				transform: translateY(-50%);
				color: #0009;
			}
		}

		.content {
			padding: 40rpx 40rpx 0 40rpx;

			.all {
				display: inline-block;
				padding: 24rpx 40rpx;
				font-size: 32rpx;
				color: #000000e6;
				background-color: #fff;
			}

			.title {
				color: #000000e6;
				margin: 20rpx 0;
				font-size: 28rpx;
			}

			.expense-wrap,
			.income-wrap {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.wrap-p {
					width: 210rpx;
					text-align: center;
					padding: 24rpx 0;
					margin-bottom: 20rpx;
					background-color: #fff;
					font-size: 32rpx;
				}
			}

			.active {
				background-color: #007fff !important;
				color: #fff;
			}
		}
	}
</style>
