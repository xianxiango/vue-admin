<template>
  <div class="public-view">
    <!-- <el-row :gutter="40">
      <el-col :span="8">
        <el-card class="box-card counts2">
          <div class="counts-header">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="example"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>{{balance.BTC}}</h2>
              <p>BTC钱包余额</p>
            </div>
          </div>
          <a
            :href="`${this.addressPath['BTC'].Address}${this.btc_account}`"
            target="_blank"
          >{{this.btc_account}}</a>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card counts3">
          <div class="counts-header">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="example"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>{{balance.ETH}}</h2>
              <p>ETH钱包余额</p>
            </div>
            <div class="counts-header-right">
              <h2>{{this.eth_block}}</h2>
              <p>ETH区块高度</p>
            </div>
          </div>
          <a
            :href="`${this.addressPath['ETH'].Address}${this.eth_account}`"
            target="_blank"
          >{{this.eth_account}}</a>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card counts4">
          <div class="counts-header">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="example"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>{{balance.USDT}}</h2>
              <p>USDT钱包余额</p>
            </div>
            <div class="counts-header-right">
              <h2>{{balance.BTC_FEE}}</h2>
              <p>BTC余额</p>
            </div>
          </div>
          <a
            :href="`${this.addressPath['USDT'].Address}${this.usdt_account}`"
            target="_blank"
          >{{this.usdt_account}}</a>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="40" style="margin-top: 30px;">
      <el-col :span="8">
        <el-card class="box-card counts4">
          <div class="counts-header">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="example"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>{{balance.EOS}}</h2>
              <p>EOS钱包余额</p>
            </div>
            <div class="counts-header-right">
              <h2>{{balance.TD}}</h2>
              <p>TD余额</p>
            </div>
          </div>
          <a
            :href="`${this.addressPath['EOS'].Address}${this.eos_account}`"
            target="_blank"
          >{{this.eos_account}}</a>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card counts2">
          <div class="counts-header">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="example"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>{{balance.LTC}}</h2>
              <p>LTC钱包余额</p>
            </div>
          </div>
          <a
            :href="`${this.addressPath['LTC'].Address}${this.ltc_account}`"
            target="_blank"
          >{{this.ltc_account}}</a>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card counts3">
          <div class="counts-header">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="example"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>{{balance.BCHABC}}</h2>
              <p>BCHABC钱包余额</p>
            </div>
          </div>
          <a
            :href="`${this.addressPath['BCHABC'].Address}${this.bch_account}`"
            target="_blank"
          >{{this.bch_account}}</a>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="40" style="margin-top: 30px;">
      <el-col :span="8">
        <el-card class="box-card counts3">
          <div class="counts-header">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="example"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>{{balance["USDT-ERC20"]}}</h2>
              <p>USDT-ERC20钱包余额</p>
            </div>
          </div>
          <a
            :href="`${this.addressPath['USDT-ERC20'].Address}${this.eth_account}`"
            target="_blank"
          >{{this.eth_account}}</a>
        </el-card>
      </el-col>
    </el-row>-->
    <el-card class="asset-card" style="margin-top: 40px;">
      <h4 style="margin-bottom:20px">自动钱包信息</h4>
      <div class="user-table">
        <el-table :data="wallet" border>
          <el-table-column prop="Currency" label="币种" fixed="left"></el-table-column>
          <el-table-column prop="Address" label="地址" width="400">
            <template slot-scope="scope">
              <a
                :href="`${addressPath[scope.row.Currency].Address}${scope.row.Address}`"
                target="_blank"
              >{{scope.row.Address}}</a>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="Address" label="地址"></el-table-column> -->
          <el-table-column prop="Balance" label="余额"></el-table-column>
          <el-table-column prop="Commission" label="手续费余额"></el-table-column>
          <el-table-column prop="Limit" label="自动提现限额"></el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-row :gutter="40" style="margin-top: 30px;">
      <el-col :span="8">
        <el-card class="box-card counts1">
          <div class="counts-header">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="people"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>
                <vue-count :startVal="0" :endVal="newUser" :duration="2000"></vue-count>
              </h2>
              <p>新增用户</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card counts2">
          <div class="counts-header">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="peoples"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>
                <vue-count :startVal="0" :endVal="onlineUser" :duration="2000"></vue-count>
              </h2>
              <p>在线人数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top: 30px;">
      <div slot="header" class="clearfix">
        <span>在线人数图表</span>
      </div>
      <div ref="chart" style="height: 300px;"></div>
    </el-card>
  </div>
</template>

<script>
import Moment from "moment";
import { fetchData } from "@/api";
import VueCount from "vue-count-to";
import Cookies from "js-cookie";
const eCharts = require("echarts");
export default {
  components: {
    VueCount
  },
  data() {
    return {
      wallet: [],
      balance: {
        BTC: 0,
        ETH: 0,
        USDT: 0,
        EOS: 0,
        LTC: 0,
        BCHABC: 0,
        USDT_FEE: 0,
        BTC_FEE: "",
        ["USDT-ERC20"]: 0
      },

      currency: {
        "1": "BTC",
        "2": "ETH",
        "3": "USDT",
        "4": "EOS",
        "5": "LTC",
        "10": "BCHABC",
        "11": "TD",
        "8": "BNB",
        "13": "CRE",
        "14": "EGT",
        "15": "LAMB",
        "16": "ARPA",
        "17": "V91",
        "109": "USDT-ERC20",
        "1000": "USDT_FEE",
        "1001": "BTC_FEE"
      },
      address: {
        "1": "btc_account",
        "2": "eth_account",
        "3": "usdt_account",
        "4": "eos_account",
        "5": "ltc_account",
        "10": "bch_account",
        "11": "TD",
        "8": "BNB",
        "13": "CRE",
        "14": "EGT",
        "15": "LAMB",
        "16": "ARPA",
        "17": "V91",
        "109": "USDT-ERC20",
        "1000": "USDT_FEE",
        "1001": "BTC_FEE"
      },
      addressPath: {},
      newUser: 0,
      onlineUser: 0,
      activeTime: "",
      btc_account: "",
      eth_account: "",
      usdt_account: "",
      eos_account: "",
      bch_account: "",
      ltc_account: "",
      usdt_fee_account: "",
      eth_block: "",
      weekProfit: [],
      weekLoss: [],
      dynamicTable: [
        { name: "Index", label: "排名", width: 60 },
        { name: "Uid", label: "UID", width: 120 },
        { name: "Profit0", label: "本周(盈亏/成交量)" },
        { name: "Profit1", label: "前一周" },
        { name: "Profit2", label: "前二周" },
        { name: "Profit3", label: "前三周" },
        { name: "Profit4", label: "前四周" }
      ]
    };
  },
  methods: {
    async createdFun() {
      await this.getCoinInfo();
      // await this.fetchCoinExplorer();
      await this.fetchDashboard();
      await this.fetchOnlineUser();
      await this.fetchOnlineChart();
      await this.fetchWeek();
    },
    async getCoinInfo() {
      await fetchData("coinInfo").then(data => {
        var item = {};
        var family = {};
        var item2 = {};
        for (let i in data.list) {
          item[data.list[i].Id] = data.list[i].Code;
          family[data.list[i].Id] = data.list[i].Family;
          if (data.list[i].Id != 11 && data.list[i].Id < 100) {
            item2[data.list[i].Id] = data.list[i].Code;
          }
        }
        this.currencyNumber = item;
        this.currencyFamily = family;
        this.currentCoin = item2;
        this.currentCoin[1101] = "TD-已锁定";
        this.currentCoin[1102] = "TD-已解锁";
      });
      await fetchData("coinExplorer").then(data => {
        this.addressPath = data.list;

        for (let i in this.currencyNumber) {
          if (this.addressPath[this.currencyNumber[i]] == undefined) {
            this.addressPath[this.currencyNumber[i]] = this.addressPath[
              this.currencyFamily[i]
            ];
          }
          // console.log(this.addressPath[this.currencyNumber[i]])
        }
      });
    },

    // 获取钱包余额
    fetchBalanceWallet() {
      for (let key in this.currency) {
        fetchData("balance", {
          currency: key
        }).then(data => {
          if (data) {
            var value = data.value.replace(/[^0-9]/gi, "");
            console.log(value);
            this.balance[this.currency[key]] = Number(value).toFixed(4);
          }
        });
      }
    },
    // 获取在线人数
    fetchOnlineUser() {
      fetchData("userOnline").then(data => {
        if (data) this.onlineUser = data.total;
      });
    },
    // 获取新增用户
    fetchNewUser() {
      const start = new Date();
      const end = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      fetchData("countsActive", {
        start_time: parseInt(start / 1000),
        end_time: parseInt(end.getTime() / 1000)
      }).then(data => {
        if (data) this.newUser = data.activated;
      });
    },
    // 获取在线用户图表
    fetchOnlineChart() {
      const start = new Date();
      const end = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      fetchData("userOnlineChart", {
        starttime: parseInt(start / 1000),
        endtime: parseInt(end.getTime() / 1000)
      }).then(data => {
        if (data && data.list && data.list.length)
          this.drawOnlineChart(data.list);
      });
    },

    // 绘制在线图表
    drawOnlineChart(list) {
      const data = [];
      list.forEach(function(element) {
        data.push([
          Moment(element.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss"),
          element.num
        ]);
      }, this);
      const myChart = eCharts.init(this.$refs.chart);
      const option = {
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          data: data.map(item => item[0])
        },
        grid: {
          left: 50
        },
        yAxis: {
          splitLine: {
            show: false
          }
        },
        visualMap: {
          top: 10,
          right: 10,
          pieces: [
            {
              gt: 0,
              lte: 500,
              color: "#096"
            },
            {
              gt: 500,
              lte: 1000,
              color: "#ff9933"
            },
            {
              gt: 1000,
              color: "#cc0033"
            }
          ],
          outOfRange: {
            color: "#999"
          }
        },
        dataZoom: [
          {
            startValue: data[parseInt(data.length / 2)][0]
          },
          {
            type: "inside"
          }
        ],
        series: {
          name: "Online users ",
          type: "line",
          data: data.map(item => item[1])
        }
      };
      myChart.setOption(option);
    },
    // 首页仪表盘
    fetchDashboard() {
      if (Cookies.get("dashboard") == undefined) {
        //没有缓存就读接口，存在缓存就读缓存，缓存寿命10秒
        fetchData("dashboard").then(data => {
          var millisecond = new Date().getTime();
          var expiresTime = new Date(millisecond + 10 * 1000);

          Cookies.set("dashboard", JSON.stringify(data), {
            expires: expiresTime
          });
          this.Dashboard(data);
        });
      } else {
        this.Dashboard(JSON.parse(Cookies.get("dashboard")));
      }
    },
    Dashboard(data) {
      if (data && data.balance) {
        for (let key in data.balance) {
          var value = data.balance[key].replace(/[a-zA-Z]/g, "");
          this.balance[this.currency[key]] = Number(value).toFixed(4);
        }

        this.newUser = data.users_new;
        this.btc_account = data.btc_account;
        this.eth_account = data.eth_account;
        this.usdt_account = data.usdt_account;
        this.eos_account = data.eos_account;
        this.ltc_account = data.ltc_account;
        this.bch_account = data.bch_account;
        // this.usdt_fee_account = data.usdt_fee_account;

        for (let i of Object.keys(this.currency)) {
          if (i < 1000) {
            var Commission;
            var Address;
            switch (i) {
              case "3":
                Commission = this.balance["BTC_FEE"] + " BTC";
                break;
              case "4":
                Commission = this.balance["TD"] + " TD";
                break;

              default:
                Commission = "";
                break;
            }
            if (
              i == 109 ||
              i == 8 ||
              i == 13 ||
              i == 14 ||
              i == 15 ||
              i == 16 ||
              i == 17
            ) {
              Address = data[this.address[2]];
            } else if (i == 11) {
              Address = data[this.address[4]];
            } else {
              Address = data[this.address[i]];
            }

            var m = {
              Currency: this.currency[i],
              Balance: this.balance[this.currency[i]],
              Address: Address,
              Commission: Commission,
              Limit: data.currencyLimit[i]
            };
            this.wallet.push(m);
          }
        }
        this.eth_block = parseInt(data.eth_block, 16);
      }
    },
    // 盈利亏损
    fetchWeek() {
      fetchData("week", {
        Currency: 1
      }).then(data => {
        if (!data) return;
        if (data.profit && data.profit.length) {
          data.profit.map((v, i) => (v.Index = i + 1));
          this.weekProfit = data.profit;
        }
        if (data.loss && data.loss.length) {
          data.loss.map((v, i) => (v.Index = i + 1));
          this.weekLoss = data.loss;
        }
      });
    }
  },
  created() {
    this.createdFun();
  }
};
</script>

<style lang="less" scoped>
.counts-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  &-left {
    flex: 0.4;
  }
  &-right {
    flex: 0.6;
    p {
      color: #c8c8c8;
    }
  }
  &-svg {
    width: 4rem !important;
    height: 4rem !important;
  }
}

.gray {
  color: #999;
  font-size: 12px;
}

.box-card {
  width: 410px;
  a {
    display: block;
    line-height: 24px;
  }
}

.counts1 {
  color: rgb(45, 140, 240);
}

.counts2 {
  color: rgb(100, 213, 114);
}

.counts3 {
  color: rgb(255, 213, 114);
}

.counts4 {
  color: rgb(242, 94, 67);
}

.recharge-rank {
  margin: 30px 0;
}
</style>

