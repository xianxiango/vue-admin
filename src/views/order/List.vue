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
            >{{scope.row[item.name]}}</router-link>
          </span>
          <span v-else>{{scope.row[item.name]}}</span>
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
import {
  orderActions,
  orderStatus,
  orderType,
  handler,
  notify,
  payStatus,
  bugUid
} from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      param: {
        // 请求附带参数
        action: 0,
        status: -1,
        currency: -1,
        type: -1
      },
      keyword: {
        // 搜索附带参数
        action: 0,
        status: -1,
        currency: -1,
        type: -1
      },
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "orderList",
      searchUrl: "orderPaySearch",
      dynamicTable: [
        { name: "uid", value: true, label: "UID", width: 100, isSearch: true },
        {
          name: "orderId",
          value: true,
          label: "订单号",
          width: 200,
          isSearch: true
        },
        { name: "orderType", value: true, label: "订单类型", width: 100 },
        { name: "createAt", value: true, label: "订单时间", width: 200 },
        { name: "currency", value: true, label: "订单币种", width: 100 },
        { name: "orderAmount", value: true, label: "订单数量" },
        { name: "targetCurrency", value: true, label: "目标币种", width: 100 },
        { name: "targetAmount", value: true, label: "目标数量" },
        { name: "orderState", value: true, label: "状态", width: 100 },
        { name: "orderAction", value: true, label: "行为", width: 120 },
        { name: "orderDate", value: true, label: "完成时间", width: 200 },
        { name: "address", value: true, label: "充值地址", width: 200 },
        { name: "appId", value: true, label: "appId" },
        {
          name: "appOrderId",
          value: true,
          label: "第三方接口订单号",
          width: 200
        },
        { name: "confirmations", value: true, label: "确认数" },
        { name: "fee", value: true, label: "手续费" },
        { name: "handler", value: true, label: "处理器" },
        { name: "hash", value: true, label: "交易hash", width: 200 },
        { name: "inputAddress", value: true, label: "来源地址", width: 200 },
        { name: "notify", value: true, label: "通知状态" },
        { name: "price", value: true, label: "兑换价", width: 200 },
        { name: "sign", value: true, label: "签名" },
        { name: "status", value: true, label: "支付状态" },
        { name: "statusMsg", value: true, label: "状态信息", width: 200 },
        { name: "withdrawInfo", value: true, label: "withdrawInfo" },
        { name: "withdrawStatus", value: true, label: "withdrawStatus" }
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
          uidCode: uidCode(element.Uid),
          orderId: element.Id,
          orderType: orderType[element.Type],
          currency: this.currencyNumber[element.Currency],
          orderAmount: element.Amount / 1,
          orderDate: element.UpdateTime.replace("T", " ").substring(0, 19),
          orderState: orderStatus[element.Status],
          createAt: element.CreateTime.replace("T", " ").substring(0, 19),
          detail: element,
          targetUid: element.Targetuid,
          orderAction: orderActions[element.Action] || `code-${element.Action}`,
          targetCurrency: this.currencyNumber[element.Target],
          targetAmount: element.TargetAmount / 1,
          address: element.Address,
          appId: element.AppId,
          appOrderId: element.AppOrderId,
          confirmations: element.Confirmations,
          fee: element.Fee,
          handler: handler[element.Handler],
          hash: element.Hash,
          inputAddress: element.InputAddress,
          notify: notify[element.Notify],
          price: element.Price,
          sign: element.Sign,
          status: payStatus[element.Status],
          statusMsg: element.StatusMsg,
          withdrawInfo: element.WithdrawInfo,
          withdrawStatus: element.WithdrawStatus
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

