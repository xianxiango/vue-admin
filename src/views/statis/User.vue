<template>
  <div class="public-view user">
    <!-- 表格  -->
    <div class="public-table">
      <h4>每日统计</h4>
      <el-table
        :data="Today"
        border
        :cell-style="rowClass"
      >
        <el-table-column
          prop="Createtime"
          :formatter="formattertime"
          label="时间"
        ></el-table-column>
        <el-table-column
          prop="Newuser"
          label="今日注册用户数"
        ></el-table-column>
        <el-table-column
          prop="TotalUser"
          label="总人数"
        ></el-table-column>
        <el-table-column
          prop="Logsum"
          label="今日登录次数"
        ></el-table-column>
        <el-table-column
          prop="Loguser"
          label="今日登录用户数"
        ></el-table-column>
        <el-table-column
          prop="FuturesTrading"
          label="今日合约交易用户数"
        ></el-table-column>
        <el-table-column
          prop="SpotTrading"
          label="今日币币交易用户数"
        ></el-table-column>
        <el-table-column
          prop="Logipsum"
          label="登录ip总数"
        ></el-table-column>
      </el-table>
    </div>
    <div class="public-table">
      <h4>累计统计</h4>
      <el-table
        :data="Sum"
        border
        :cell-style="rowClass"
      >
        <el-table-column
          prop="TotalUser"
          label="累计总人数"
        ></el-table-column>
        <el-table-column
          prop="TotalLog"
          label="登录总数"
        ></el-table-column>
        <el-table-column
          prop="TotalFuturesTrading"
          label="累计合约交易用户数"
        ></el-table-column>
        <el-table-column
          prop="TotalSpotTrading"
          label="累计现货交易用户数"
        ></el-table-column>
      </el-table>
    </div>
    <div class="public-table">
      <h4>推广统计</h4>
      <el-table
        :data="AgentData"
        border
        :cell-style="rowClass"
      >
        <el-table-column
          prop="downLineDate"
          label="总注册量"
        ></el-table-column>
        <el-table-column
          prop="downLine"
          label="有效邀请用户量"
        ></el-table-column>
        <el-table-column
          prop="prizeTotal"
          label="总收益量(TD)"
        ></el-table-column>
        <el-table-column
          prop="prizeDate"
          label="昨日收益量(TD)"
        ></el-table-column>
        <el-table-column
          prop="agentTotal"
          label="总推广人数"
        ></el-table-column>
         <el-table-column
          prop="vipCount"
          label="vip领取人数"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchData } from "@/api";
export default {
  data() {
    return {
      Sum: [],
      Today: [],
      AgentData:[]
    };
  },
  mounted() {
    this.fetchDashboard();
  },
  methods: {
    fetchDashboard() {
      fetchData("reportUser").then(data => {
        this.Sum = [data.sum];
        this.Today = data.today;
      });
      fetchData("reportAgentData").then(data => {
        // this.Sum = [data.sum];
        // this.Today = data.today;
        this.AgentData=[data]
      });
    },
    formattertime(row, column) {
      return row.Createtime.replace("T", " ").substring(0, 10);
    },
    rowClass({ row, column, rowIndex, columnIndex }) {
      return "padding:5px 0";
    }
  }
};
</script>

<style lang="less" scoped>
.user .el-table {
  font-size: 12px;
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

