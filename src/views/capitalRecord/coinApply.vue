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
        <span class="left-span">
          <span>币种：</span>
          <el-select
            style="width: 100px;"
            v-model="filterCoin"
            placeholder="请选择"
            @change="filterCurrency"
          >
            <el-option label="全部" :value="-1"></el-option>
            <el-option
              v-for="(value, key) in this.currencyNumber"
              :label="value"
              :value="key"
              :key="key"
            ></el-option>
          </el-select>
        </span>
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
        :width="item.width"
        :label="item.label"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">{{scope.row[item.name]}}</template>
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
import { errstatus, bugUid } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      filterCoin: -1,
      // currencyNumberList: currencyNumber,
      // keyword: {
      //   // 搜索附带参数
      //   currency: -1,
      // },
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "capitalRecordCoinApply",
      searchUrl: "capitalRecordCoinApplySearch",
      dynamicTable: [
        { name: "uid", value: false, label: "UID", isSearch: true },
        { name: "project", value: true, label: "期号", isSearch: true },
        { name: "currency", value: true, label: "申购品种" , isSearch: true,handler:this.coinHandler},
        { name: "tdAmount", value: true, label: "所需TD数量" },
        { name: "result", value: true, label: "中签数量" },
        { name: "amount", value: true, label: "申购数量" },
        { name: "return", value: true, label: "返还数量" },
        { name: "inviteAddition", value: true, label: "邀请加成" },
        { name: "realAddition", value: true, label: "实际加成" },
        {
          name: "status",
          value: true,
          label: "状态",
          isSearch: true,
        },
        {
          name: "createTime",
          value: true,
          label: "申购时间",
          isSearch: true,
          isTime: true,
          handler: this.createdTimeHandler
        }
      ],
      filterSummaries: ["amount", "return", "tdAmount", "result"] // 需要统计的字段
    };
  },
  methods: {
    // 设置表格数据
    async setTableData(data) {
      // const markPrice = await fetchData("markPrice");
      const list = [];
      data.forEach(function(element) {
        list.push({
          uid: element.Uid,
          uidCode: uidCode(element.UID),
          tdAmount: element.TDAmount,
          result: element.Result,
          currency: this.currencyNumber[element.Currency],
          amount: element.Amount,
          return: element.Return,
          status: element.Status == 0 ? "未派签" : "已派签",
          project: element.Project,
          inviteAddition: element.InviteAddition,
          realAddition: element.RealAddition,
          createTime: element.CreateTime,
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
    
    // 币种筛选
    filterCurrency(val) {
      this.keyword.currency = val;
      if (val > 0) {
        this.fetchSearchData();
      } else {
        this.fetchTableData();
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

