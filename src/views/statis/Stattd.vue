<template>
  <div class="public-view">
    <!-- 表格  -->
    <div class="public-table">
      <!-- <h4>每日统计</h4> -->
      <el-col :span="12">
        <el-card class="box-card">
          <h5>TD总量</h5>
          <el-table :data="TdSum" border>
            <el-table-column prop="count" label="数值"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <h5>TD每天释放量</h5>
          <el-table :data="TdDailyRelease" border>
            <el-table-column prop="count" label="数值"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </div>
  </div>
</template>

<script>
import { fetchData } from "@/api";
export default {
  data() {
    return {
      TdSum: [],
      TdDailyRelease: []
    };
  },
  mounted() {
    this.fetchDashboard();
  },
  created() {
    this.getCoinInfo();
  },
  methods: {
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
      fetchData("reportStattd").then(data => {
        this.TdSum.push({ count: data.Quantity + data.Lock });
        this.TdDailyRelease.push({ count: (data.Quantity + data.Lock) * 0.01 });
      });
    },
    formatterCurrency(row, column) {
      return currencyNumber[row.Currency];
    }
  }
};
</script>

<style lang="less" scoped>
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

