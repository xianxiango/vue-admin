<template>
  <div class="public-view">
    <div class="public-table">
      <h4>奖品分布</h4>
      <el-table :data="lucktotal" border>
        <el-table-column prop="PrizeType" label="奖品" :formatter="formatterPrizetype"></el-table-column>
        <el-table-column prop="Total" label="数量"></el-table-column>
      </el-table>
    </div>
    <div class="public-table">
      <h4>每天统计</h4>
      <el-table :data="luckbydate" border :span-method="objectSpanMethod">
        <el-table-column prop="D" label="日期" width="100"></el-table-column>
        <el-table-column prop="PrizeType" label="奖品" :formatter="formatterPrizetype"></el-table-column>
        <el-table-column prop="Total" label="数量"></el-table-column>
        <el-table-column prop="Uidtotal" label="人数"></el-table-column>
      </el-table>
    </div>
    <!-- 头部  -->
    <div class="public-table">
      <h4>历史记录</h4>
      <div class="view-header">
        <div class="header-left">
          <el-button
            type="primary"
            :loading="downloadLoading"
            icon="el-icon-download"
            @click="handleDownload"
          >导出</el-button>
        </div>
        <div class="header-right">
          <el-input
            @keyup.enter.native="submitSearch"
            :placeholder="labelList.length ? '' : '搜索UID'"
            v-model="inputText"
          >
            <el-tag
              v-for="(item, index) in labelList"
              :key="index"
              slot="suffix"
              size="small"
              closable
              @close="removeTags(index)"
            >{{item}}</el-tag>
            <el-button @click.native.prevent="submitSearch" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
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
        <el-table-column
          :prop="item.name"
          v-if="item.value"
          :key="item.name"
          v-for="item in dynamicTable"
          :label="item.label"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope"><span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span><span v-if="scope.row[item.name]==0">-</span></template>
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
  </div>
</template>

<script>
import SearchMixin from "@/mixins/search";
import { uidCode } from "@/utils/uidCode";
import { fetchData } from "@/api";
import { profitAndLoss, profitRate } from "@/utils/tdexMethods";
import { luckDraw ,bugUid } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      lucktotal: [],
      luckbydate: [],
      luckbydate2: [],
      spanArr: [],
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "luckyList",
      searchUrl: "luckySearch",
      filterSummaries: [], // 需要统计的字段
      dynamicTable: [
        // { name: 'uidCode', value: true, label: 'UID' },
        { name: "CreateTime", value: true, label: "时间" },
        { name: "Uid", value: true, label: "Uid" },
        { name: "PrizeType", value: true, label: "奖品" }
      ]
    };
  },
  mounted() {
    this.fetchDashboard();
  },

  methods: {
    // 设置表格数据
    async setTableData(data) {
      const list = [];
      data.forEach(function(element) {
        list.push({
          CreateTime: element.CreateTime.replace("T", " ").substring(0, 19),
          PrizeType: luckDraw[element.PrizeType],
          Uid: element.Uid
        });
      }, this);
      this.list = list;
    },

    fetchDashboard() {
      fetchData("luckyGetluckbydate", {
        start_time: 0,
        end_time: 9999999999
      }).then(data => {
        this.luckbydate = data.list;
        this.getSpanArr(this.luckbydate);
      });
      fetchData("luckyGetlucktotal").then(data => {
        // console.log(data)
        this.lucktotal = data.list;
      });
    },
    formatterPrizetype(row, column) {
      return luckDraw[row.Prizetype];
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].D === data[i - 1].D) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },

    //luckyGetlucktotal
    // 添加标签列表
    addLabelList(val) {
      val =val.replace(/(^\s*)|(\s*$)/g, "")
      let first = "";
      let last = "";
      // 数字UID
      if ((this.arrayMemberLen(val, 8) == "1" && parseInt(val) > 10000000)|| bugUid[val]=='1'){
        first = "UID";
        this.isCodeUid ? (last = uidCode(val)) : (last = val);
        this.changeLabelList(first, last);
      } else {
        this.$message.info("抱歉!无法识别搜索内容");
      }
    },
    // 格式化搜索标签
    formatLabelList() {
      const params = {};
      this.labelList.forEach(elm => {
        const item = elm.split(":");
        switch (item[0]) {
          case "UID":
            if (this.isCodeUid) {
              params.encode_uids = item[1];
            } else {
              params.uids = item[1];
            }
            break;
          default:
            console.log(" >> 无法解析搜索内容...");
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

