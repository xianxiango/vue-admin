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
        <el-switch
          style="margin-left:30px"
          @change="changeAction"
          v-model="isChange"
          active-value="3"
          inactive-value="8"
          active-text="转账"
          inactive-text="期现互转"
        ></el-switch>
      </div>
      <div class="header-right">
        <!-- <el-input @keyup.enter.native="submitSearch" :placeholder="labelList.length ? '' : '搜索UID、订单号'" v-model="inputText">
          <el-tag v-for="(item, index) in labelList" :key="index" slot="suffix" size="small" closable @close="removeTags(index)">{{item}}</el-tag>
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
    </div>
    <!-- 表格  -->
    <el-table class="public-table" :data="list" border v-loading="loading">
      <el-table-column
        :prop="item.name"
        v-if="item.value"
        :key="item.name"
        v-for="item in dynamicTable"
        :label="item.label"
        :show-overflow-tooltip="true"
        :width="item.width"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="item.name === 'uid' || item.name === 'targetUid'">
            <router-link
              target="_blank"
              :to="{ name: 'memberDetail', query: { uid: scope.row[item.name] } }"
              class="jump-detail"
            >
              <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span>
              <span v-if="scope.row[item.name]==0">-</span>
            </router-link>
          </span>
          <span v-else>
            <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span>
            <span v-if="scope.row[item.name]==0">-</span>
          </span>
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
import Cookies from "js-cookie";
import {
  orderActions,
  orderStatus,
  bugUid
} from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      isChange:
        Cookies.get("isChangeAction") == undefined
          ? 8
          : Cookies.get("isChangeAction"),
      list: [],
      param: {
        // 请求附带参数
        action:
          Cookies.get("isChangeAction") == undefined
            ? 8
            : Cookies.get("isChangeAction"),
        status: -1,
        currency: -1,
        type: -1
      },
      keyword: {
        // 搜索附带参数
        action:
          Cookies.get("isChangeAction") == undefined
            ? 8
            : Cookies.get("isChangeAction"),
        status: -1,
        currency: -1,
        type: -1
      },
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      filterCoin: -1,
      requestUrl: "orderTransfer",
      searchUrl: "orderTransferSearch",
      dynamicTable: [
        {
          name: "uid",
          value: true,
          label: "转账UID",
          width: 100,
          isSearch: true
        },
        {
          name: "orderId",
          value: true,
          label: "订单号",
          width: 200,
          isSearch: true
        },
        { name: "createAt", value: true, label: "订单时间", width: 200 },
        { name: "currency", value: true, label: "转账币种", width: 100 },
        { name: "orderAmount", value: true, label: "转账数量" },
        { name: "targetCurrency", value: true, label: "接收币种", width: 100 },
        { name: "targetAmount", value: true, label: "接收数量" },
        { name: "targetUid", value: true, label: "接收UID", width: 100 },
        { name: "orderState", value: true, label: "状态", width: 100 },
        { name: "orderAcion", value: true, label: "行为", width: 180 },
        { name: "orderDate", value: true, label: "完成时间", width: 200 },
        {
          name: "appOrderId",
          value: true,
          label: "第三方接口订单号",
          width: 250
        }
      ],
      filterSummaries: ["orderAmount", "targetAmount"] // 需要统计的字段
    };
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = [];
      data.forEach(function(element) {
        list.push({
          uid: element.Uid,
          uidCode: uidCode(element.Uid),
          orderId: element.Id,
          currency: this.currencyNumber[element.Currency],
          orderAmount: element.Amount / 1,
          orderDate: element.UpdateTime.replace("T", " ").substring(0, 19),
          orderState: orderStatus[element.Status],
          createAt: element.CreateTime.replace("T", " ").substring(0, 19),
          detail: element,
          targetUid: element.Targetuid,
          orderAcion: orderActions[element.Action]
            ? orderActions[element.Action]
            : `code-${element.Action}`,
          targetCurrency: this.currencyNumber[element.Target],
          targetAmount: element.TargetAmount / 1,
          appOrderId: element.AppOrderId
        });
      }, this);
      this.list = list;
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
      } else {
        first = "订单号";
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
            if (this.isCodeUid) {
              params.encode_uids = item[1];
            } else {
              params.uid = item[1];
            }
            break;
          case "订单号":
            params.orderId = item[1];
            break;
          default:
            console.log(" >> 多余的参数：", item[1]);
            break;
        }
      });
      return params;
    },
    changeAction() {
      this.param.action = this.isChange;
      this.keyword.action = this.isChange;
      Cookies.set("isChangeAction", this.isChange, { expires: 30 });
      this.fetchTableData();
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

