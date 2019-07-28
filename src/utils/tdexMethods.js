import Decimal from './decimal'
// 盈亏 = (均价 - 标记价格)* 数量 * 合约规模
export const profitAndLoss = data => {
  const direction = data.side ? 1 : -1
  if (data.price && data.markPrice && Number(data.price) > 0 && Number(data.markPrice) > 0) {
    return String(
      Decimal.accMul(Decimal.accSubtr(Decimal.accDiv(1, data.price), Decimal.accDiv(1, data.markPrice)), parseInt(data.scale) * parseInt(data.volume) * direction, 2)
    )
  } else {
    return 0
  }
}
// 盈亏率 = 盈亏/保证金
export const profitRate = (pl, deposit) => {
  if (deposit && Number(deposit) > 0) {
    return String(Decimal.accDiv(Number(pl), deposit))
  } else {
    return '0.00'
  }
}