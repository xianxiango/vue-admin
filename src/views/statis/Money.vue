<template>
  <div class="money public-view">
    <!-- 表格  -->
    <div class="public-table">
      <!-- 头部  -->
      <div class="view-header">
        <div class="header-left">
          <h4>每日统计</h4>
        </div>
        <div class="header-right">
          <el-dropdown>
            <el-button type="primary">
              筛选
              <i class="el-icon-menu el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in dynamicTable" :key="item.name">
                <el-checkbox v-model="item.value" @change="checkboxChange">{{item.label}}</el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <el-table :data="Today" border :span-method="objectSpanMethod" :cell-style="rowClass">
        <el-table-column prop="CreateTime" :formatter="formattertime" label="日期" width="100"></el-table-column>
        <el-table-column prop="Type" label="币种"></el-table-column>
        <el-table-column
          :prop="item.name"
          v-if="item.value"
          :key="item.name"
          v-for="item in dynamicTable"
          :label="item.label"
          :width="item.width"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </el-table>
    </div>
    <div class="public-table">
      <h4>累计统计</h4>

      <el-table :data="Sum" border :cell-class-name="rowClass">
        <el-table-column prop="Coin" label="币种" width="200" :formatter="formatterCoin"></el-table-column>
        <el-table-column prop="Profitloss" label="累计总盈亏" width="200"></el-table-column>
        <el-table-column prop="Pay" label="累计充值" width="200"></el-table-column>
        <el-table-column prop="Withdraw" label="累计提现" width="200"></el-table-column>
        <el-table-column prop="Openlots" label="累计开仓手数" width="200"></el-table-column>
        <el-table-column prop="Closelots" label="累计平仓手数" width="200"></el-table-column>
        <el-table-column prop="Opensum" label="累计开仓总额" width="200"></el-table-column>
        <el-table-column prop="Burstlots" label="累计爆仓手数" width="200"></el-table-column>
        <el-table-column prop="Burstfee" label="累计爆仓保费" width="200"></el-table-column>
        <el-table-column prop="Fee" label="总手续费" width="200"></el-table-column>

        <el-table-column prop="BTCfee" label="累计币币交易BTC手续费" width="200"></el-table-column>
        <el-table-column prop="TDfee" label="累计币币交易TD手续费" width="200"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchData } from "@/api";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      Sum: [],
      Today: [],
      dynamicTable:
        Cookies.get("statis_money_today_dynamicTable") != undefined
          ? JSON.parse(Cookies.get("statis_money_today_dynamicTable"))
          : [
              {
                name: "FutresBalance",
                value: true,
                label: "合约账户余额",
                width: "200"
              },
              {
                name: "FutresPay",
                value: true,
                label: "合约账户充值",
                width: "200"
              },
              {
                name: "FutresWithdraw",
                value: true,
                label: "合约账户提现",
                width: "200"
              },
              {
                name: "OpenLots",
                value: true,
                label: "今日开仓手数",
                width: "200"
              },
              {
                name: "OpenSum",
                value: true,
                label: "今日开仓总额",
                width: "200"
              },
              {
                name: "CloseLots",
                value: true,
                label: "今日平仓手数",
                width: "200"
              },
              { name: "Burstlots", value: true, label: "爆仓数", width: "200" },
              {
                name: "BurstFee",
                value: true,
                label: "爆仓保费",
                width: "200"
              },
              { name: "Fee", value: true, label: "总手续费", width: "200" },
              {
                name: "ProfitLoss",
                value: true,
                label: "今日总盈亏",
                width: "200"
              },
              {
                name: "SpotBalance",
                value: true,
                label: "币币账户余额",
                width: "200"
              },
              {
                name: "Pay",
                value: true,
                label: "币币账号充值数",
                width: "200"
              },
              {
                name: "Withdraw",
                value: true,
                label: "币币账号提现数",
                width: "200"
              },
              { name: "BTCfee", value: true, label: "BTC手续费", width: "200" },
              { name: "TDfee", value: true, label: "TD手续费", width: "200" }
            ]
    };
  },
  created() {
    this.createdFun();
  },

  // mounted() {
  //   this.fetchDashboard();
  // },
  methods: {
    async createdFun(){
      await this.getCoinInfo()
      await this.fetchDashboard()
    },
    getCoinInfo() {
      fetchData("coinInfo").then(data => {
        var item = {};
        for (let i in data.list) {
          item[data.list[i].Id] = data.list[i].Code;
        }
        this.currencyNumber = item;
        // this.addressPath.XRP = { Address: "", Tx: "" };
        // this.addressPath.CRE = this.addressPath.ETH;
      });
    },
    fetchDashboard() {
      fetchData("reportSum").then(data => {
        // this.Sum = [data.sum];
        // var sumlen = [];
        this.Sum = data.sum;

        // for (var item in sumlen) {
        //   var ppchild = sumlen[item];
        //   ppchild.Type = item;
        //   this.Sum.push(ppchild);
        // }
      });
      fetchData("reportToday").then(data => {
        var todaylen = [];
        todaylen = data.today;

        for (let i = 0; i < todaylen.length; i++) {
          var sumchild = todaylen[i];

          for (var item in sumchild) {
            if (item != "CreateTime") {
              var ppchild = sumchild[item];
              ppchild.Type = item;
              ppchild.CreateTime = sumchild.CreateTime;
              this.Today.push(ppchild);
            }
          }
        }
      });
    },
    rowClass({ row, column, rowIndex, columnIndex }) {
      return "padding:5px 0";
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    formattertime(row, column) {
      return row.CreateTime.replace("T", " ").substring(0, 10);
    },
    formatterCoin(row, column) {
      return this.currencyNumber[row[column.property]];
    },
    checkboxChange() {
      Cookies.set(
        "statis_money_today_dynamicTable",
        JSON.stringify(this.dynamicTable),
        { expires: 30 }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.money .el-table {
  font-size: 12px;
}
.money .el-table--medium td,
.money .el-table--medium th {
  padding: 5px 0 !important;
}
.public-table {
  clear: both;
}
.child-table {
  height: 100%;
  ul {
    overflow: hidden;
    border-top: 1px solid #eee;
    li {
      float: left;
      width: 16.66%;
      list-style: none;
      box-sizing: border-box;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
  }
}
h4 {
  line-height: 3;
  text-indent: 2em;
}
h5 {
  line-height: 3;
  text-indent: 2em;
}
.el-col {
  padding-left: 1em;
  padding-right: 1em;
}
.box-card {
  margin: 0 0 2em;
}
</style>

