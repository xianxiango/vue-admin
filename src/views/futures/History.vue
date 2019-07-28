<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-button
          type="primary"
          :loading="downloadLoading"
          icon="el-icon-download"
          @click="handleDownload"
        >导出</el-button>
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
        <!-- <el-input
          @keyup.enter.native="submitSearch"
          :placeholder="labelList.length ? '' : '搜索UID、起止时间、仓位ID'"
          v-model="inputText"
        >
          <i slot="prefix" class="el-input__icon el-icon-date" @click="selectTime"></i>
          <el-tag
            v-for="(item, index) in labelList"
            :key="index"
            slot="suffix"
            size="small"
            closable
            @close="removeTags(index)"
          >{{item}}</el-tag>
          <el-button @click.native.prevent="submitSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>-->
        <div style="position: absolute;width: 50%;z-index: 1000;background: #fff;" v-click-outside="searchHide">
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
    <el-table
      class="public-table"
      :data="list"
      border
      v-loading="loading"
      show-summary
      @selection-change="handleSelectionChange"
      :summary-method="getSummaries"
    >
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column prop="uids" label="UID" width="100">
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="{ name: 'memberDetail', query: { uid: scope.row.uids } }"
            class="jump-detail"
          >{{scope.row.uids}}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        :prop="item.name"
        v-if="item.value"
        :key="item.name"
        v-for="item in dynamicTable"
        :width="item.width"
        :label="item.label"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span>
          <span v-if="scope.row[item.name]==0">-</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页  -->
    <el-pagination
      background
      @size-change="handleSize"
      @current-change="handlePage"
      :current-page="page"
      :page-sizes="sizeList"
      :page-size="size"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import SearchMixin from "@/mixins/search";
import { uidCode, string10to62, string62to10 } from "@/utils/uidCode";
import { fetchData } from "@/api";
import { profitAndLoss, profitRate } from "@/utils/tdexMethods";
import {
  futuresState,
  bugUid,
  historyState,
  historyAction,
  historyCONST,
  historyType
} from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "futuresList",
      searchUrl: "futuresSearch",
      dynamicTable: [
        { name: "uids", value: false, label: "UID", isSearch: true },
        {
          name: "pid",
          value: true,
          label: "仓位ID",
          width: 120,
          isSearch: true
        },
        { name: "pIdCode", value: true, label: "仓位ID" },
        { name: "product", value: true, label: "品种" },
        { name: "direction", value: true, label: "方向" },
        { name: "marginType", value: true, label: "保证金类型" },
        { name: "margin", value: true, label: "保证金" },
        { name: "price", value: true, label: "均价" },
        { name: "finalPrice", value: true, label: "成交位" },
        { name: "amount", value: true, label: "数量", width: 110 },
        { name: "type", value: true, label: "类型" },
        { name: "lever", value: true, label: "杠杆" },
        // { name: 'filled', value: true, label: '已成交' },
        { name: "instructions", value: true, label: "指令" },
        { name: "cost", value: true, label: "总佣金" },
        // { name: "valueFee", value: true, label: "实际扣除佣金" },
        { name: "coin1Fee", value: true, label: "TD抵扣" },
        { name: "coin2Fee", value: true, label: "TD-赠送抵扣" },
        { name: "plVal", value: true, label: "盈亏", width: 100 },
        { name: "action", value: true, label: "状态" },
        // { name: "comment", value: false, label: "评论" },
        {
          name: "createTime",
          value: true,
          label: "创建时间",
          width: 150,
          isSearch: true,
          isTime: true,
          handler: this.createdTimeHandler
        }
      ],
      filterSummaries: ["amount", "price", "filled", "cost"] // 需要统计的字段
    };
  },
  methods: {
    // 设置表格数据
    async setTableData(data) {
      // const markPrice = await fetchData("markPrice");
      const list = [];
      data.forEach(function(element) {
        // const plVal = profitAndLoss({
        //   price: element.FinalPrice,
        //   markPrice: element.Price,
        //   volume: element.Volume,
        //   side: element.Side,
        //   scale: element.contract.Scale
        // });
        // console.log(plVal)
        const plValue = element.Pnl ? element.Pnl : "0.0000";
        const marValue = profitRate(element.Pnl, parseInt(element.Margin));
        list.push({
          uids: element.UID,
          uidCode: uidCode(element.UID),
          pIdCode: element.IdCode,
          pId: element.PID,
          pid: element.ID,
          product: this.currencyNumber[element.CID],
          instructions: element.Shared ? "逐仓" : "全仓",
          direction: element.Side ? "做空" : "做多",
          amount: element.Filled + "/" + element.Volume, // 已成交/委托数量
          lever: Number(element.Scale).toFixed(2) + "x",
          price: this.numFilter(element.Price / 1),
          finalPrice: this.numFilter(element.FinalPrice / 1),
          // filled: element.Filled / 1,
          cost: this.numFilter(element.fee),
          plVal: plValue + "(" + marValue + "%)",
          type: this.getType(element),
          margin: this.numFilter(element.Margin),
          marginType: this.currencyNumber[element.MarginType],
          state: historyState[element.State],
          action: historyAction[element.Action],
          comment: "",
          createTime: element.CreatedAt.replace("T", " ").substring(0, 19),
          coin1Fee: this.numFilter(element.Coin1Fee),
          coin2Fee: this.numFilter(element.Coin2Fee),
          valueFee: this.numFilter(element.ValueFee),
          detail: element
        });
      }, this);
      this.list = list;
    },
    getType(data) {
      if (data.Attempt == historyCONST.FUT.Action.SL) {
        if (data.Strategy == historyCONST.FUT.Strategy.Trail)
          data.TypeDesc = historyType["trade.order.Type6"];
        else data.TypeDesc = historyType["trade.order.Type5"];
      } else if (data.Attempt == historyCONST.FUT.Action.TP) {
        data.TypeDesc = historyType["trade.order.Type4"];
        if (data.Passive) {
          data.TypeDesc = historyType["trade.order.Type7"] + data.TypeDesc;
        } else if (data.Visible >= 0) {
          data.TypeDesc = historyType["trade.order.Type8"] + data.TypeDesc;
        }
      } else if (data.Attempt == historyCONST.FUT.Action.CLEAR) {
        data.TypeDesc = historyType["trade.order.Type9"];
      } else {
        var actionDesc = historyAction[data.Attempt];
        if (data.Kind == historyCONST.FUT.Kind.LMT) {
          if (data.Passive) {
            data.TypeDesc = historyType["trade.order.Type7"] + actionDesc;
          } else if (data.Visible >= 0) {
            data.TypeDesc = historyType["trade.order.Type8"] + actionDesc;
          } else {
            data.TypeDesc = historyType["trade.order.Type1"] + actionDesc;
          }
        } else {
          if (data.Strategy == historyCONST.FUT.Strategy.Line) {
            if (data.Variable == historyCONST.FUT.Variable.MarkPrice) {
              data.TypeDesc = historyType["trade.order.Type3"] + actionDesc;
            } else if (data.Variable == historyCONST.FUT.Variable.LastPrice) {
              data.TypeDesc = historyType["trade.order.Type2"] + actionDesc;
            }
          } else if (data.Strategy == historyCONST.FUT.Strategy.Immediate) {
            data.TypeDesc = historyType["trade.order.Type0"] + actionDesc;
          }
        }
      }
      return data.TypeDesc;
    },
    // 添加标签列表
    addLabelList(val) {
      val = val.replace(/(^\s*)|(\s*$)/g, "");
      let first = "";
      let last = "";
      const regx = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{30,50}$/;
      // 数字UID
      if (
        (this.arrayMemberLen(val, 8) == "1" && parseInt(val) > 10000000) ||
        bugUid[val] == "1"
      ) {
        first = "UID";
        this.isCodeUid ? (last = uidCode(val)) : (last = val);
        this.changeLabelList(first, last);
      } else if (val.indexOf("~") !== -1) {
        first = "时间";
        last = val;
        this.changeLabelList(first, last);
      } else if (val.match(regx)) {
        first = "地址";
        last = val;
        this.changeLabelList(first, last);
      } else {
        first = "仓位ID";
        last = val;
        this.changeLabelList(first, last);
      }
    },
    // 格式化搜索标签
    formatLabelList() {
      const params = {};
      this.labelList.forEach(elm => {
        const item = elm.split(":");
        switch (item[0]) {
          case "UID":
            params.uids = item[1];
            break;
          case "仓位ID":
            var regu = /^(?![^a-zA-Z]+$)/;
            if (regu.test(item[1])) {
              params.pid = string62to10(item[1]);
            } else {
              params.pid = item[1];
            }
            break;
          case "时间":
            const formatDate = elm.substring(elm.indexOf(":")).split("~");
            params.start_time = parseInt(
              new Date(formatDate[0]).getTime() / 1000
            );
            params.end_time = parseInt(
              new Date(formatDate[1]).getTime() / 1000
            );
            break;
          case "地址":
            params.address = item[1];
            break;
          default:
            console.log(" >> 多余的参数：", item[1]);
            break;
        }
      });
      return params;
    },
    arrayMemberLen(val, len) {
      let array = val.split(",");
      for (let i = 0; i < array.length; i++) {
        if (array[i].length != len) {
          return "0";
        }
      }
      return "1";
    }
  }
};
</script>

