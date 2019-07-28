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
          :placeholder="labelList.length ? '' : '搜索UID、起止时间、仓位ID、币种、S:产品'"
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
      <el-table-column type="selection" width="70"></el-table-column>
      <el-table-column prop="uids" label="UID" width="80">
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
import { futuresState, bugUid } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "cfdOrder",
      searchUrl: "cfdOrderSearch",
      dynamicTable: [
        { name: "uids", value: false, label: "UID", isSearch: true },
        {
          name: "pid",
          value: true,
          label: "仓位ID",
          width: 90,
          isSearch: true
        },
        { name: "pIdCode", value: true, label: "仓位ID", width: 60 },
        {
          name: "name",
          value: true,
          label: "产品",
          width: 120,
          isSearch: true
        },
        {
          name: "coin",
          value: true,
          label: "币种",
          width: 50,
          isSearch: true
        },
        { name: "direction", value: true, label: "方向", width: 50 },
        { name: "lever", value: true, label: "杠杆", width: 70 },
        { name: "amount", value: true, label: "数量" },
        { name: "margin", value: true, label: "委托价值" },
        { name: "type", value: true, label: "类型", width: 50 },
        { name: "price", value: true, label: "价位" },
        { name: "filled", value: true, label: "成交价" },
        { name: "timely", value: true, label: "过期时间" },
        { name: "state", value: true, label: "状态", width: 85 },
        // { name: 'comment', value: false, label: '评论' },
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
      filterSummaries: ["price", "filled", "cost"] // 需要统计的字段
    };
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = [];
      data.forEach(function(element) {
        list.push({
          uids: element.UID,
          pIdCode: element.IdCode,
          uidCode: uidCode(element.UID),
          pid: element.PID,
          oId: element.ID,
          name: element.Code,
          instructions: element.Shared ? "平仓" : "开仓",
          direction: element.Side ? "做空" : "做多",
          amount: element.Filled + "/" + element.Volume, // 已成交/委托数量
          lever: Number(element.Scale).toFixed(2) + "x",
          price: this.numFilter(element.Price / 1),
          timely:
            element.Timely == "0"
              ? "GTC"
              : element.Timely == "1"
              ? this.getdate(element.Deadline)
              : this.getdate(element.TimelyParam),
          markPrice: "",
          filled: this.numFilter(element.Filled / 1),
          type: element.Kind ? "限价" : "市价",
          state: futuresState[element.State],
          comment: "",
          constant: element.Constant,
          coin: this.currencyNumber[element.MarginType],
          margin: this.numFilter(element.Margin),
          createTime: element.CreatedAt.replace("T", " ").substring(0, 19),
          detail: element
        });
      }, this);
      this.list = list;
    },
    // 添加标签列表
    // 添加标签列表
    // 添加标签列表
    addLabelList(val) {
      val = val.replace(/(^\s*)|(\s*$)/g, "");
      let first = "";
      let last = "";
      const regx = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{30,50}$/;
      const coinregx = /^[A-Z]*$/;
      // 数字UID
      if (
        (this.arrayMemberLen(val, 8) == "1" && parseInt(val) > 10000000) ||
        bugUid[val] == "1"
      ) {
        first = "UID";
        this.isCodeUid ? (last = uidCode(val)) : (last = val);
        this.changeLabelList(first, last);
      } else if (/^S\:/.test(val)) {
        first = "产品";
        last = val;
        this.changeLabelList(first, last);
      } else if (val.indexOf("~") !== -1) {
        first = "时间";
        last = val;
        this.changeLabelList(first, last);
      } else if (val.match(coinregx)) {
        first = "币种";
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
    getdate(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
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
          case "产品":
            params.name = item[2];
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
          case "币种":
            params.coin = item[1];
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

