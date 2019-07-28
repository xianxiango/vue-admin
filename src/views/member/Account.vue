<template>
  <div class="public-view user-detail">
    <el-row :gutter="40">
      <!-- <el-col :span="8">
        <el-card class="box-card" v-if="userInfo">
          <div slot="header" class="info-header">
            <strong>{{userInfo.Email}}</strong>
          </div>
          <div class="info-body">
            <p>Uid：{{userInfo.Uid}}</p>
            <p>类型：{{userInfo.userType}}</p>
            <p>邮箱：{{userInfo.Email}}</p>
            <p>手机：{{ userInfo.Mobile ? userInfo.Mobile.substring(6) : '--'}}</p>
            <p>谷歌：{{ userInfo.GgAuth ? '已绑定' : '未绑定'}}</p>
            <p>创建时间：{{userInfo.CreateTime.replace('T', ' ').substring(0, 19)}}</p>
            <p>创建IP：{{userInfo.CreateIP}}</p>
            <p>最近登录时间：{{userInfo.LastLoginTime.replace('T', ' ').substring(0, 19)}}</p>
            <p>最近登录IP：{{userInfo.LastLoginIP}}</p>
          </div>
        </el-card>
      </el-col>-->
      <el-col :span="24">
        <el-card class="box-card" v-if="userInfo">
          <div slot="header" class="info-header">
            <strong>{{userInfo.Email}}</strong>
          </div>
          <div class="info-body">
            <p>Uid：{{userInfo.Uid}}</p>
            <p>类型：{{userInfo.userType}}</p>
            <p>邮箱：{{userInfo.Email}}</p>
            <p>手机：{{ userInfo.Mobile ? userInfo.Mobile.substring(6) : '--'}}</p>
            <p>谷歌：{{ userInfo.GgAuth ? '已绑定' : '未绑定'}}</p>
            <p>创建时间：{{userInfo.CreateTime.replace('T', ' ').substring(0, 19)}}</p>
            <p>创建IP：{{userInfo.CreateIP}}</p>
            <p>最近登录时间：{{userInfo.LastLoginTime.replace('T', ' ').substring(0, 19)}}</p>
            <p>最近登录IP：{{userInfo.LastLoginIP}}</p>
          </div>
        </el-card>
        <el-card class="asset-card">
          <h4>
            BTC（合约账户）
            <span>
              合约账户余额:{{FutresBtc.Balance}}
              <!-- <span v-if="FutresBtc.Balance!=Fbalance">(异常)</span> -->
            </span>
          </h4>
          <el-table :data="FutresBtclist" border>
            <el-table-column prop="Balance" label="合约账号余额" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Margin" label="保证金" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="FutresCome" label="划入合约账户" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="SpotBack" label="划出合约账户" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="BuyTdOrder" label="挂单所花BTC" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Fee" label="总手续费" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="ProfitLoss" label="总盈亏" :formatter="formatterTNE"></el-table-column>
          </el-table>
        </el-card>
        <el-card class="asset-card" style="margin-top: 40px;">
          <h4>
            BTC（币币账户）
            <span>
              币币账户余额:{{SpotBtc.balance}}
              <!-- <span v-if="SpotBtc.balance!=Sbalance">(异常)</span> -->
            </span>
          </h4>
          <el-table :data="SpotBtclist" border>
            <el-table-column prop="balance" label="币币账号余额" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Pay" label="充值" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Withdraw" label="提现" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="SpotCome" label="划入币币账户" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="FutresBack" label="划出币币账户" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="BuyTd" label="TD/BTC买入TD所花的BTC" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="SellTd" label="TD/BTC卖出TD所得BTC" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="BuyTdTrading" label="内部转账交易买入TD所得BTC" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="SellTdTrading" label="内部转账交易卖出TD所花BTC" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="BuyTdOrder" label="TD/BTC买入挂单金额" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Activity" label="活动赠送" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Adjust" label="系统调整" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Bonus" label="分红" :formatter="formatterTNE"></el-table-column>
          </el-table>
        </el-card>
        <el-card class="asset-card" style="margin-top: 40px;">
          <h4>
            TD
            <span>
              TD余额:{{Td.balance}}
              <!-- <span v-if="Td.balance!=Tbalance">(异常)</span> -->
            </span>
          </h4>
          <el-table :data="Tdlist" border>
            <el-table-column prop="balance" label="TD账号余额" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="BuyTd" label="TD/BTC买入TD数" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="SellTd" label="TD/BTC卖出TD数量" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="BuyTdOrder" label="TD/BTC卖出挂单数量" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="BuyTdTrading" label="内部转账交易买入TD" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="SellTdTrading" label="内部转账交易卖出TD" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Fee" label="手续费（买入TD支付的手续费）" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="FeeTd" label="抵扣手续费TD" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Private" label="私募" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Commission" label="邀请返佣" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Activity" label="TD活动奖励" :formatter="formatterTNE"></el-table-column>
            <el-table-column prop="Adjust" label="系统调整" :formatter="formatterTNE"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchData } from "@/api";
import { userType, flowWater } from "@/utils/tdexMap";
import Decimal from "@/utils/decimal";
export default {
  name: "user-detail",
  data() {
    return {
      Futresbalance: 0,
      Spotbalance: 0,
      Tdbalance: 0,
      uid: this.$route.query.uid,
      userInfo: null,
      FutresBtclist: [],
      SpotBtclist: [],
      Tdlist: [],
      FutresBtc: {
        BuyTdOrder: 0, //挂单所花BTC
        Fee: 0, //总手续费
        FutresCome: 0, //划入合约账户
        ProfitLoss: 0, //总盈亏
        SpotBack: 0, //划出币币账户
        balance: 0, //合约账号余额
        Margin: 0
      },
      SpotBtc: {
        Activity: 0, //活动赠送
        Adjust: 0, //系统调整
        Bonus: 0, //分红
        BuyTd: 0, //TD/BTC买入TD所花的BTC
        BuyTdOrder: 0, //TD/BTC买入挂单金额
        BuyTdTrading: 0, //内部转账交易买入TD所得BTC
        FutresBack: 0, //划到合约账户
        Pay: 0, //充值
        SellTd: 0, //TD/BTC卖出TD所得BTC
        SellTdTrading: 0, //内部转账交易卖出TD所花BTC
        SpotCome: 0, //划回币币账户
        Withdraw: 0, //提现
        balance: 0 //币币账号余额
      },
      Td: {
        Activity: 0, //TD活动奖励
        Adjust: 0, //系统调整
        BuyTd: 0, //TD/BTC买入TD数
        BuyTdOrder: 0, //TD/BTC卖出挂单数量
        BuyTdTrading: 0, //内部转账交易买入TD（已完成)
        Commission: 0, //邀请返佣
        Fee: 0, //手续费（买入TD支付的手续费）
        FeeTd: 0, //抵扣手续费TD
        Private: 0, //私募
        SellTd: 0, //TD/BTC卖出TD数量
        SellTdTrading: 0, //内部转账交易卖出TD（进行中或已完成
        balance: 0 //TD账号余额
      }
    };
  },
  computed: {
    Fbalance: function() {
      //合约账户余额 = 划入合约账户BTC-划出到币币账户BTC-挂单所花BTC+总盈亏（有符号、含爆仓，不含手续费）-总手续费（资金费率是算到盈亏里面？这个待确定～） 注：TD抵扣手续费部分需扣除
      return Decimal.accSubtr(
        Decimal.accSubtr(
          Decimal.accAdd(
            Decimal.accSubtr(
              Decimal.accSubtr(
                this.FutresBtc.FutresCome,
                this.FutresBtc.SpotBack
              ),
              this.FutresBtc.BuyTdOrder
            ),
            this.FutresBtc.ProfitLoss
          ),
          this.FutresBtc.Fee
        ),
        this.FutresBtc.Margin
      );
    },
    Sbalance: function() {
      //充值-提现-划到合约账户+划回币币账户-TD/BTC买入TD所花的BTC - TD/BTC买入挂单金额+TD/BTC卖出TD所得BTC+内部转账交易卖出TD所得BTC-内部转账交易买入TD所花BTC+分红+活动赠送+系统调整 = 币币账户余额
      return Decimal.accAdd(
        Decimal.accAdd(
          Decimal.accAdd(
            Decimal.accSubtr(
              Decimal.accAdd(
                Decimal.accAdd(
                  Decimal.accSubtr(
                    Decimal.accSubtr(
                      Decimal.accAdd(
                        Decimal.accSubtr(
                          Decimal.accSubtr(
                            this.SpotBtc.Pay,
                            this.SpotBtc.Withdraw
                          ),
                          this.SpotBtc.FutresBack
                        ),
                        this.SpotBtc.SpotCome
                      ),
                      this.SpotBtc.BuyTd
                    ),
                    this.SpotBtc.BuyTdOrder
                  ),
                  this.SpotBtc.SellTd
                ),
                this.SpotBtc.SellTdTrading
              ),
              this.SpotBtc.BuyTdTrading
            ),
            this.SpotBtc.Bonus
          ),
          this.SpotBtc.Activity
        ),
        this.SpotBtc.Adjust
      );
    },
    Tbalance: function() {
      //初始余额 +TD/BTC买入TD数-TD/BTC卖出TD数量+TD/BTC卖出挂单数量-内部转账交易卖出TD（进行中或已完成）+内部转账交易买入TD（已完成）+邀请返佣-手续费（买入TD支付的手续费）+抵扣手续费TD+TD活动奖励+系统调整 = TD余额
      return Decimal.accAdd(
        Decimal.accAdd(
          Decimal.accAdd(
            Decimal.accSubtr(
              Decimal.accAdd(
                Decimal.accAdd(
                  Decimal.accSubtr(
                    Decimal.accAdd(
                      Decimal.accSubtr(
                        Decimal.accAdd(this.Td.Private, this.Td.BuyTd),
                        this.Td.SellTd
                      ),
                      this.Td.BuyTdOrder
                    ),
                    this.Td.SellTdTrading
                  ),
                  this.Td.BuyTdTrading
                ),
                this.Td.Commission
              ),
              this.Td.Fee
            ),
            this.Td.FeeTd
          ),
          this.Td.Activity
        ),
        this.Td.Adjust
      );
    }
  },
  methods: {
    // 获取用户信息
    fetchUserInfo(uid) {
      if (!uid) return false;
      fetchData("userSearch", {
        uids: uid
      }).then(data => {
        if (data && data.list && data.list.length) {
          this.userInfo = data.list[0];
          this.userInfo.userType = userType[data.list[0].Type];
        }
      });
      fetchData("userBill", { uids: uid }).then(data => {
        this.FutresBtc = data.FutresBtc;
        this.SpotBtc = data.SpotBtc;
        this.Td = data.Td;

        this.FutresBtclist.push(data.FutresBtc);
        this.SpotBtclist.push(data.SpotBtc);
        this.Tdlist.push(data.Td);
      });
    },
    formatterTNE(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      var m = date.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      return date.toFixed(Math.max(0, (m[1] || "").length - m[2]));
    }
  },

  mounted() {
    this.fetchUserInfo(this.$route.query.uid);
  }
};
</script>

<style lang="less">
.user-detail {
  .el-card__header {
    border-bottom: 0;
  }
  .el-card__body {
    padding: 0 20px 20px;
  }
  .box-card {
    margin-bottom: 30px;
  }
  .info-header {
    strong {
      color: #666;
      font-size: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .info-body {
    p {
      color: #999;
      font-size: 14px;
      line-height: 22px;
    }
  }
  .info-item {
    margin: 20px 0;
    .el-button {
      width: 100%;
    }
  }
  .asset-card {
    padding-top: 30px;
    h4 {
      color: #666;
      font-size: 16px;
      line-height: 36px;
    }
    .user-table {
      padding: 20px 20px 40px;
    }
  }
  .user-unbind {
    .el-dialog__body {
      padding: 30px 50px;
    }
  }
}
</style>


