module.exports = function (rule, value, data, callback) {
    // rule  当前规则
    // value 当前规则校验数据
    // data  全部校验数据
    // callback 回调，不支持异步，如果执行了callback，return结果无效，callback 将替换 errorMessage 属性
    // callback('message') 字符串类型表示成功
    return value.length>=6
  }