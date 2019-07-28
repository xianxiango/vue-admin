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
        <el-input
          @keyup.enter.native="submitSearch"
          :placeholder="labelList.length ? '' : '搜索UID、起止时间'"
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
        </el-input>
      </div>
      <el-date-picker
        class="reset-date-picker"
        ref="datePicker"
        @change="datePickerChange"
        unlink-panels
        value-format="yyyy-MM-dd"
        v-model="period"
        slot="prepend"
        type="daterange"
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
      <el-table-column prop="uid" label="UID" width="100">
        <template slot-scope="scope">
          <router-link
            target="_blank"
            :to="{ name: 'memberDetail', query: { uid: scope.row.uid } }"
            class="jump-detail"
          >{{scope.row.uid}}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        :prop="item.name"
        v-if="item.value"
        :key="item.name"
        v-for="item in dynamicTable"
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
import { fetchData } from "@/api";
import { bugUid, errstatus } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "futuresWalletlogslist",
      searchUrl: "futuresWalletlogssearch",
      dynamicTable: [
        // { name: 'uidCode', value: true, label: 'UID' },
        { name: "createTime", value: true, label: "创建时间" },
        { name: "id", value: true, label: "ID" },
        { name: "aboutID", value: true, label: "订单ID" },
        { name: "action", value: true, label: "行为" },
        { name: "coin", value: true, label: "币种" },
        { name: "margin", value: true, label: "保证金" },
        { name: "newMargin", value: true, label: "新保证金" },
        { name: "oldMargin", value: true, label: "旧保证金" },
        { name: "volume", value: true, label: "余额" },
        { name: "newVolume", value: true, label: "新余额" },
        { name: "oldVolume", value: true, label: "旧余额" }
      ],
      filterSummaries: [] // 需要统计的字段
    };
  },
  methods: {
    // 设置表格数据
    async setTableData(data) {
      const markPrice = await fetchData("markPrice");
      const list = [];
      data.forEach(function(element) {
        list.push({
          aboutID: element.AboutID,
          action: errstatus[element.Action],
          coin: this.currencyNumber[element.Coin],
          createTime: element.CreatedAt.replace("T", " ").substring(0, 19),
          id: element.ID,
          margin: element.Margin,
          newMargin: element.NewMargin,
          newVolume: element.NewVolume,
          oldMargin: element.OldMargin,
          oldVolume: element.OldVolume,
          uid: element.UID,
          volume: element.Volume,
          detail: element
        });
      }, this);
      this.list = list;
    },
    // 添加标签列表
    addLabelList(val) {
      val = val.replace(/(^\s*)|(\s*$)/g, "");
      let first = "";
      let last = "";
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
          case "时间":
            const formatDate = item[1].split("~");
            params.start_time = parseInt(
              new Date(formatDate[0]).getTime() / 1000
            );
            params.end_time = parseInt(
              new Date(formatDate[1]).getTime() / 1000
            );
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

