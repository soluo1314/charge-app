<template>
	<uni-popup type="bottom" ref="PopAdd" @maskClick="toggle" :safe-area="false">
		<view class="add-wrap">
			<view class="header">
				<view class="close" @click="toggle">
					<uni-icons type="closeempty" size="20" />
				</view>
				<!-- <button class="add-btn" type="primary" @click="addBill()">确定</button> -->
			</view>
			<view class="filter">
				<view class="type">
					<text @click="changeType('expense')"
						:class="{ expense: true, active: payType == 'expense' }">支出</text>
					<text @click="changeType('income')" :class="{ income: true, active: payType == 'income' }">收入</text>
				</view>
				<view @click="showDay = true" class="time">
					<!-- {{ $filters.transDay(date) }}  -->
					<text class="iconfont sort-down"></text>
				</view>
			</view>
			<view class="money">
				<text class="sufix">¥</text>
				<text class="amount animation">{{ amount }}</text>
			</view>
			<view class="type-warp">
				<scroll-view scroll-x class="type-body" v-if="payType == 'expense'">
					<view class="type-item" v-for="item in expense" :key="item._id" @click="choseType(item)">
						<view :class="{
                'iconfont-wrap': true,
                expense: true,
                active: currentType._id == item._id,
              }">
							<!-- <i class="iconfont" :class="typeMap[item.id].icon"
            /> -->
							<uni-icons type="closeempty" class="iconfont" size="20"></uni-icons>
						</view>
						<text>{{ item.name }}</text>
					</view>
				</scroll-view>
				<scroll-view scroll-x class="type-body" v-else>
					<view class="type-item" v-for="item in income" :key="item._id" @click="choseType(item)">
						<view :class="{
                'iconfont-wrap': true,
                income: true,
                active: currentType._id == item._id,
              }">
							<!-- <text class="iconfont" :class="typeMap[item.id].icon"></text> -->
							<uni-icons type="closeempty" class="iconfont" size="20"></uni-icons>
						</view>
						<text>{{ item.name }}</text>
					</view>
				</scroll-view>
			</view>
			<view class="remark" v-if="remark" @click="remarkVisible = true">{{
        remark
      }}</view>
			<view class="remark" v-else @click="remarkVisible = true">添加备注</view>
			<keyboard-package @onInput="inputChange" :detail="{}" @onDelete="onDelete"></keyboard-package>
		</view>
		<!-- <van-dialog v-model:show="remarkVisible" title="备注" show-cancel-button>
			<van-field v-model="remark" rows="2" autosize type="textarea" maxlength="10" placeholder="请输入备注"
				show-word-limit />
		</van-dialog> -->
		<!-- <uni-popup v-model:show="showDay" position="bottom" round :style="{ height: '46%' }">
			<van-datetime-picker v-model="date" type="date" title="选择时间" @confirm="choseDay"
				@cancel="showDay = false" />
		</uni-popup> -->
	</uni-popup>
</template>

<script>
	import KeyboardPackage from "./keyboard-package/keyboard-package.vue";
	export default {
		props: {
			show: Boolean,
			detail: {
				type: Object,
				default: () => {},
			},
		},
		components: {
			KeyboardPackage,
		},
		data() {
			return {
				expense: true,
				income: false,
				payType: "expense", // 支出或收入类型
				showDay: false, //显示日期选择框
				amount: "", // 账单价格
				expense: [], //支出类型
				currentType: {}, // 当前选择的类型对象
				income: [], //收入类型
				remark: "", //显示备注
				remarkVisible: false, //显示备注输入框
			};
		},
		watch: {
			show(val) {
				if (val) {
					this.$refs.PopAdd.open();
					this.popInit();
				}
			},
		},
		methods: {
			popInit() {
				// 外部传进来的账单详情 id
				if (!!this.$props.detail && this.$props.detail.id) {
					const id = this.$props.detail.id;
					this.payType = id ?
						this.$props.detail.pay_type == 1 ?
						"expense" :
						"income" :
						"expense";
					this.amount = id ? this.$props.detail.amount : "";
					this.currentType = id ? {
						id: this.$props.detail.type_id,
						name: this.$props.detail.type_name,
					} : {};
				}

				this.$Request.call({
					name: "query-bill-types",
					data: {},
					success: (res) => {
						const list = res.result
						this.expense = list.filter(i => i.type == 1)
						this.income = list.filter(i => i.type == 2)
						// 没有 id 的情况下，说明是新建账单。
						if (this.$props.detail && !this.$props.detail.id) {
							this.currentType = this.expense[0]
						}
					},
				});
			},
			//关闭添加弹窗
			toggle() {
				this.$emit("update:show", false);
				this.$refs.PopAdd.close();
			},
			//添加
			addBill() {},
			//切换类型  收 支
			changeType(type) {
				this.payType = type;
				this.currentType = this[type][0];
			},
			//选择类型
			choseType(item) {
				this.currentType = item
			},
			//删除输入框内容
			onDelete() {
				this.amount = this.amount.slice(0, this.amount.length - 1);
			},
			//监听键盘输入组件事件
			inputChange(value) {
				// 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
				if (value == "." && this.amount.includes(".")) return;
				// 小数点后保留两位，当超过两位时，不让其字符串继续相加。
				if (
					value != "." &&
					this.amount.includes(".") &&
					this.amount &&
					this.amount.split(".")[1].length >= 2
				)
					return;
				this.amount += value;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.uni-popup {
		z-index: 1001;
	}

	.add-wrap {
		padding-top: 24rpx;
		position: relative;
		background-color: #f5f5f5;

		.header {
			display: flex;
			justify-content: flex-end;
			padding: 0 48rpx;

			// .van-icon-cross {
			// 	font-size: 40rpx;
			// 	color: @color-text-secondary;
			// }

			.close {
				display: flex;
				align-items: center;
			}

			.add-btn {
				padding: 0 24rpx;
				background-color: #007aff;
				border-color: #007aff;
			}
		}

		.filter {
			padding: 24rpx 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.type {

				.expense,
				.income {
					display: inline-block;
					background: #f5f5f5;
					color: #00000080;
					padding: 4px 24rpx;
					font-size: 24rpx;
					border-radius: 48rpx;
					border: 1px solid #f5f5f5;
				}

				.expense {
					margin-right: 12rpx;

					&.active {
						background-color: #eafbf6;
						border-color: #007aff;
						color: #007aff;
					}
				}

				.income {
					&.active {
						background-color: #fbf8f0;
						border-color: #ecbe25;
						color: #ecbe25;
					}
				}
			}

			.time {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 8rpx 24rpx;
				background-color: #f0f0f0;
				border-radius: 40rpx;
				color: #000000e6;

				.sort-down {
					font-size: 24rpx;
					margin-left: 10rpx;
				}
			}
		}

		.money {
			padding-bottom: 24rpx;
			border-bottom: 1px solid #e9e9e9;
			margin: 0 48rpx;

			.sufix {
				font-size: 72rpx;
				font-weight: bold;
				vertical-align: top;
			}

			.amount {
				font-size: 80rpx;
				padding-left: 20rpx;
			}
		}

		.animation::after {
			content: "";
			display: inline-block;
			margin-left: 10rpx;
			width: 2px;
			height: 56rpx;
			animation: blink 1s infinite steps(1, start);
		}

		@keyframes blink {
			0% {
				background-color: white;
			}

			50% {
				background-color: rgba(0, 0, 0, 0.3);
			}

			100% {
				background-color: white;
			}
		}

		.type-warp {
			display: flex;
			overflow-x: auto;
			margin: 0 48rpx;
			margin-bottom: 40rpx;

			* {
				touch-action: pan-x;
			}

			.type-body {
				width: 100%;
				white-space: nowrap;

				.type-item {
					display: inline-block;
					align-items: center;
					padding: 32rpx 24rpx 20rpx 24rpx;

					.iconfont-wrap {
						display: flex;
						justify-content: center;
						align-items: center;
						background-color: #f5f5f5;
						border-radius: 50%;
						width: 60rpx;
						height: 60rpx;
						margin-bottom: 5px;

						.iconfont {
							color: rgba(0, 0, 0, 0.5);
							font-size: 40rpx;
						}
					}

					.expense {
						&.active {
							background-color: #007aff;

							.iconfont {
								color: #fff;
							}
						}
					}

					.income {
						&.active {
							background-color: rgb(236, 190, 37);

							.iconfont {
								color: #fff;
							}
						}
					}
				}
			}
		}

		.remark {
			padding: 0 48rpx;
			padding-bottom: 24rpx;
			color: #4b67e2;
		}
	}
</style>
