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
      </div>
      <div class="header-right">
        <!-- <el-input
          @keyup.enter.native="submitSearch"
          :placeholder="labelList.length ? '' : '搜索UID、订单号'"
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
        </el-input>-->
        <div
          style="position: absolute;width: 50%;z-index: 1000;background: #fff;"
          v-click-outside="searchHide"
        >
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

      <el-table-column
        :prop="item.name"
        v-if="item.value"
        :key="item.name"
        v-for="item in dynamicTable"
        :label="item.label"
        :show-overflow-tooltip="true"
        :width="item.width"
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
import { uidCode } from "@/utils/uidCode";
import { orderActions, bugUid, orderStatus } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],

      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "cfdRank",
      searchUrl: "cfdSearchRank",
      dynamicTable: [
        {
          name: "createTime",
          value: false,
          label: "查询时间",
          width: 150,
          isSearch: true,
          isTime: true,
          handler: this.createdTimeHandler
        },
        {
          name: "rank",
          value: true,
          label: "#"
        },
        { name: "uid", value: true, label: "Uid" },
        { name: "coin", value: true, label: "币种" },
        { name: "symbol", value: true, label: "产品" },
        { name: "volume", value: true, label: "成交量"},
        { name: "realyPNL", value: true, label: "已实现盈亏" },
        { name: "usdtRealyPNL", value: true, label: "折算盈亏" },
      ],
      filterSummaries: ["orderAmount"] // 需要统计的字段
    };
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = [];
      data.forEach(function(element) {
        list.push({
          uid: element.Uid,
          coin: this.currencyNumber[element.Coin],
          rank: element.Rank,
          symbol: element.Symbol,
          volume: element.Volume,
          realyPNL: element.RealyPNL,
          volume: element.Volume,
          usdtRealyPNL: element.USDTRealyPNL,
          detail: element
        });
      }, this);
      this.list = list;
    }
  }
};
</script>

