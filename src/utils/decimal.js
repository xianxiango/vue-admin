import Big from 'big.js'

export default {
  //除法函数
  accDiv(arg1, arg2, scale) {
    var b1 = new Big(arg1)
    var b2 = new Big(arg2)
    return scale === 0 || scale ? b1.div(b2).toFixed(scale) : b1.div(b2)
  },

  //乘法函数
  accMul(arg1, arg2, scale) {
    var b1 = new Big(arg1)
    var b2 = new Big(arg2)
    return scale === 0 || scale ? b1.times(b2).toFixed(scale) : b1.mul(b2)
  },

  //加法函数
  accAdd(arg1, arg2, scale) {
    var b1 = new Big(arg1)
    var b2 = new Big(arg2)
    return scale === 0 || scale ? b1.plus(b2).toFixed(scale) : b1.add(b2)
  },
  //减法函数
  accSubtr(arg1, arg2, scale) {
    var b1 = new Big(arg1)
    var b2 = new Big(arg2)
    return scale === 0 || scale ? b1.minus(b2).toFixed(scale) : b1.sub(b2)
  },
  mod: function (arg1, arg2) {
    var a1 = new Big(arg1)
    return a1.mod(arg2)
  },
  //金额加逗号
  addCommas(nStr) {
    nStr += ''
    var x = nStr.split('.');
    var x1 = x[0]
    var x2 = x.length > 1 ? '.' + x[1] : ''
    var rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2')
    }
    return x1 + x2
  },
  //格式化金额
  //@str 金额
  //@scale 小数点保留位数
  formatAmount(str, scale) {
    var n = new Big(str)
    return this.addCommas((n.round(scale)))
  },
  toFixed(num, scale) {
    var n = new Big(num)

    return n.toFixed(scale)
  },
  //非四舍五入
  format(num, scale) {
    var n = new Big(num)
    return n.round(scale, 0)
  },
  round(num, scale) {
    var n = new Big(num)
    return n.round(scale, 0)
  },
  //获取小数点后的位数
  getDotDigit(num) {
    var sVal = String(num)
    var findex = sVal.indexOf('.')
    return findex == -1 ? 0 : sVal.length - (findex + 1)
  },
  toPercent(num, scale) {
    if (scale) return new Big(num).mul(100).toFixed(scale).toString() + '%'
    else return new Big(num).mul(100).toString() + '%'
  },
  //转成K或M的值
  toKorM(num) {
    if (num > 100000) {
      return String(this.accDiv(num, Math.pow(10, 6), 2)) + 'M'
    } else if (num >= 10) {
      return String(this.accDiv(num, Math.pow(10, 3), 2)) + 'K'
    }
    return parseInt(num)
  },
  ceil(num, scale){
    if (String(num)!=="0") {
        var n = new Big(num);
        num = n.round(scale, 3);
    }
    return this.toFixed(num, scale);
  },
}