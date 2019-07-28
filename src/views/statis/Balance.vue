<template>
  <div class="public-view">
    <div class="view-header">
      <div class="header-left">
        <!-- <el-button
          type="primary"
          :loading="downloadLoading"
          icon="el-icon-download"
          @click="handleDownload"
        >导出</el-button>-->
        <!-- <el-dropdown>
            <el-button type="primary">
              筛选
              <i class="el-icon-menu el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in dynamicTable" :key="item.name">
                <el-checkbox v-model="item.value">{{item.label}}</el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>-->
      </div>
      <div class="header-right">
        <div style="position: absolute;width: 50%;z-index: 1000;background: #fff;" >
          <el-card v-if="searchShowOrHide" class="box-card searchbox">
            <el-input
              v-for="(item,index) in dynamicTable"
              :key="item.name"
              @keyup.enter.native="submitSearch"
              :placeholder="item.label"
              v-model="item.inputText"
              v-if="item.isSearch"
              style="margin-top:5px"
              clearable
              @clear="searchClear"
            >
              <template slot="prepend">{{item.label}}</template>
              <i
                slot="prefix"
                v-if="item.isTime"
                class="el-input__icon el-icon-date"
                @click="selectTime"
              ></i>
              <el-tag
                v-for="(item, index) in labelList"
                :key="index"
                slot="suffix"
                size="small"
                closable
                @close="removeTags(index)"
              >{{item}}</el-tag>
              <el-button
                v-if="index==0"
                @click.native.prevent="submitSearch"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-card>
          <!--给按钮绑定点击事件-->
          <el-button
            class="searchButton"
            @click="searchShow()"
            :icon="searchIcon"
          >{{searchShowOrHideText}}</el-button>
        </div>
      </div>
      <el-date-picker
        class="reset-date-picker"
        ref="datePicker"
        @change="datePickerChange"
        unlink-panels
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="period"
        slot="prepend"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    </div>
    <!-- 表格  -->
    <div class="public-table">
      <h4>总资产</h4>
      <el-table :data="Sum" border>
        <el-table-column prop="Currency" label="币种" :formatter="formatterC"></el-table-column>
        <el-table-column prop="Volume" label="余额" :formatter="formatter0"></el-table-column>
        <el-table-column prop="Pay" label="充值" :formatter="formatter0"></el-table-column>
        <el-table-column prop="Withdrawal" label="提现" :formatter="formatter0"></el-table-column>
        <el-table-column prop="ProfitLoss" label="盈亏" :formatter="formatter0"></el-table-column>
        <!-- <el-table-column prop="Fee" label="手续费"></el-table-column> -->
        <el-table-column prop="Exchange" label="兑换" :formatter="formatter0"></el-table-column>
        <el-table-column prop="Other" label="其他" :formatter="formatter0"></el-table-column>
        <el-table-column prop="OTCPay" label="OTC充值" :formatter="formatter0"></el-table-column>
      </el-table>
    </div>
    <div class="public-table">
      <h4>合约资产</h4>
      <el-table :data="Futures" border>
        <el-table-column prop="Currency" label="币种" :formatter="formatterC"></el-table-column>
        <el-table-column prop="Volume" label="余额" :formatter="formatter0"></el-table-column>
        <!-- <el-table-column prop="Margin" label="可用"></el-table-column> -->
        <el-table-column prop="Margin" label="保证金" :formatter="formatter0"></el-table-column>
        <el-table-column prop="Buy" label="多仓市值" :formatter="formatter0"></el-table-column>
        <el-table-column prop="Sell" label="空仓市值" :formatter="formatter0"></el-table-column>
        <el-table-column prop="ProfitLoss" label="盈亏" :formatter="formatter0"></el-table-column>
      </el-table>
    </div>
    <el-row :gutter="40">
      <el-col :span="13">
        <div class="public-table">
          <h4>差价资产</h4>
          <el-table :data="Cfd" border>
            <el-table-column prop="Currency" label="币种" :formatter="formatterC"></el-table-column>
            <el-table-column prop="Volume" label="余额" :formatter="formatter0"></el-table-column>
            <!-- <el-table-column prop="Margin" label="可用"></el-table-column> -->
            <el-table-column prop="Margin" label="保证金" :formatter="formatter0"></el-table-column>
            <el-table-column prop="Buy" label="多仓市值" :formatter="formatter0"></el-table-column>
            <el-table-column prop="Sell" label="空仓市值" :formatter="formatter0"></el-table-column>
            <el-table-column prop="ProfitLoss" label="盈亏" :formatter="formatter0"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="11">
        <div class="public-table">
          <h4>币币资产</h4>
          <el-table :data="Spot" border>
            <el-table-column prop="Currency" label="币种" :formatter="formatterC"></el-table-column>
            <el-table-column prop="Volume" label="余额" :formatter="formatter0"></el-table-column>
            <!-- <el-table-column prop="Withdraw" label="可用" width="300"></el-table-column> -->
            <el-table-column prop="Margin" label="保证金" :formatter="formatter0"></el-table-column>
            <el-table-column prop="Lock" label="锁定" :formatter="formatter0"></el-table-column>
            <!-- <el-table-column prop="Activity" label="活动发放"></el-table-column> -->
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- <div class="public-table">
      <h4>平台总数据</h4>
      <el-table :data="Platform" border>
        <el-table-column prop="Type" label="币种"></el-table-column>
        <el-table-column prop="Balance" label="余额" width="200"></el-table-column>
        <el-table-column prop="Pay" label="总充值" width="200"></el-table-column>
        <el-table-column prop="Withdraw" label="总提现" width="200"></el-table-column>
        <el-table-column prop="WaitPay" label="充值待确认" width="200"></el-table-column>
        <el-table-column prop="WaitWithdraw" label="提现待处理" width="200"></el-table-column>
        <el-table-column prop="ProfitLoss" label="总盈亏" width="200"></el-table-column>
        <el-table-column prop="Fee" label="手续费" width="200"></el-table-column>
      </el-table>
    </div>-->
  </div>
</template>

<script>
// import SearchMixin from "@/mixins/search";
import { fetchData } from "@/api";
import { uidCode } from "@/utils/uidCode";
import { orderActions, bugUid } from "@/utils/tdexMap";
export default {
  // mixins: [SearchMixin],
  computed: {
    labelList: {
      get() {
        return this.$store.state.labelList;
      },
      set(list) {
        this.$store.commit("UPDATE_LABEL_LIST", list);
      }
    },
    watchlabel: function() {
      return JSON.stringify(this.labelList);
    }
  },
  data() {
    return {
      Futures: [],
      Sum: [],
      Spot: [],
      Cfd: [],
      Platform: [],
      param: {
        // 请求附带参数
      },
      period: "", // 搜索时间周期
      searchShowOrHideText: "显示查询",
      searchButtonBoolean: false,
      searchShowOrHide: false,
      //图标，可根据自己的需求匹配
      searchIcon: "el-icon-caret-bottom",
      // requestUrl: "statisBalance",
      // searchUrl: "statisBalanceSearch",

      dynamicTable: [
        {
          name: "createTime",
          value: true,
          label: "时间",
          width: 150,
          isSearch: true,
          isTime: true,
          handler: this.createdTimeHandler
        }
      ]
    };
  },
  created() {
    this.createdFun();
  },
  
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
    submitSearch() {
      if (!this.isInputTextNull(this.dynamicTable)) {
        this.$message.info("请输入搜索内容");
        return false;
      }
      // if (this.inputText) {
      //   this.addLabelList(this.inputText)
      //   return false
      // }
      // if (this.labelList.length) {
      this.isSearch = false;
      this.fetchDashboard();
      return false;
      // }
    },
    isInputTextNull(item) {
      for (var v of item) {
        if (v.inputText != "") {
          return true;
        }
      }
      return false;
    },
    datePickerChange(val) {
      // this.addLabelList(val[0] + '~' + val[1])
      var time = val[0] + "~" + val[1];
      console.log(time);
      for (var v of this.dynamicTable) {
        if (v.name == "createTime") {
          this.$set(v, "inputText", time);
        }
      }
    },
    searchShow() {
      if (this.searchButtonBoolean) {
        this.searchIcon = "el-icon-caret-bottom";
        this.searchShowOrHideText = "显示查询";
        // $("#showOrHide").hide();
        this.searchShowOrHide = false;

        this.searchButtonBoolean = !this.searchButtonBoolean;
      } else {
        this.searchShowOrHide = true;
        this.searchIcon = "el-icon-caret-top";
        this.searchShowOrHideText = "收起";
        this.searchButtonBoolean = !this.searchButtonBoolean;
      }
    },
    createdTimeHandler(item) {
      // console.log(item)
      const formatDate = item.split("~");
      // console.log(formatDate)
      this.searchParams.start_time = parseInt(
        new Date(formatDate[0]).getTime() / 1000
      );
      this.searchParams.end_time = parseInt(
        new Date(formatDate[1]).getTime() / 1000
      );
    },
    selectTime() {
      this.$refs.datePicker.showPicker();
    },

    searchClear() {
      this.isSearch = false;
      this.fetchDashboard();
    },
    fetchDashboard() {
      this.searchParams = {};
      for (var v of this.dynamicTable) {
        if (
          v.inputText == "" ||
          v.inputText == null ||
          v.inputText == undefined
        ) {
          continue;
        }
        if (v.name == "createTime") {
          v.handler(v.inputText);
          continue;
        }

        if (v.inputText == null || v.inputText == undefined) {
          v.inputText = "";
        }
        v.inputText = v.inputText.replace(/(^\s*)|(\s*$)/g, "");
        var inputText = v.inputText;

        if (v.handler) {
          inputText = v.handler(inputText);
        }
        this.searchParams[v.name] = inputText;
      }
      fetchData("statisBalance", this.searchParams).then(data => {
        this.Futures = this.delete0(data.Futures);
        this.Sum = this.delete0(data.Sum);
        this.Spot = this.delete0(data.Spot);
        this.Cfd = this.delete0(data.Cfd);
      });
    },
    delete0(data) {
      var returnItem = [];
      for (let i = 0; i < data.length; i++) {
        var isAll0 = false;
        for (var key in data[i]) {
          if (key !== "Currency" && typeof data[i][key] == "string") {
            if (data[i][key] != "0.0000") {
              isAll0 = false;
              break;
            } else {
              isAll0 = true;
            }
          }
        }
        if (!isAll0) {
          returnItem.push(data[i]);
        }
      }
      return returnItem;
    },
    formatter0(row, column) {
      var data = row[column.property];
      if (data == 0) {
        return "-";
      }
      return data;
    },
    formatterC(row, column) {
      return this.currencyNumber[row[column.property]];
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>

