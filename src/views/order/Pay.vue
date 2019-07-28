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
        <span class="left-span">
          <span>状态：</span>
          <el-select
            style="width: 100px;"
            v-model="filterValue"
            placeholder="请选择"
            @change="filterStatus"
          >
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="处理中" :value="3"></el-option>
            <el-option label="已完成" :value="1"></el-option>
          </el-select>
        </span>
        <span class="left-span">
          <span>类型：</span>
          <el-select
            style="width: 100px;"
            v-model="typeValue"
            placeholder="请选择"
            @change="filterType"
          >
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="普通" :value="1001"></el-option>
            <el-option label="OTC" :value="1002"></el-option>
          </el-select>
        </span>
      </div>
      <div class="header-right">
        <!-- <el-input
          @keyup.enter.native="submitSearch"
          :placeholder="labelList.length ? '' : '搜索UID、订单号、订单起止时间、钱包地址'"
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
        :width="item.width"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="item.name !== 'address'">
            <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span>
            <span v-if="scope.row[item.name]==0">-</span>
          </span>
          <a
            v-else
            :href="scope.row.addressPath + scope.row.address+((scope.row.address.substr(0, 2) == '0x')?'#tokentxns':'')"
            target="_block"
            class="jump-dateil jump-color"
          >
            <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span>
            <span v-if="scope.row[item.name]==0">-</span>
          </a>
        </template>
      </el-table-column>
    </el-table>

    <div
      style="font-size: 14px;
    color: #606266;
    margin-bottom: 20px;"
    >筛选后订单金额合计：{{totalAmount}}</div>
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
import { uidCode } from "@/utils/uidCode";
import { orderStatus, bugUid } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      param: {
        // 请求附带参数
        action: 1,
        status: -1,
        currency: -1,
        type: -1
      },
      keyword: {
        // 搜索附带参数
        action: 1,
        status: -1,
        currency: -1,
        type: -1
      },
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "orderPay",
      searchUrl: "orderPaySearch",
      totalAmount: "",
      filterValue: -1,
      typeValue: -1,
      filterCoin: -1,
      addressPath: {
        
      },
      dynamicTable: [
        { name: "uid", value: false, label: "UID", isSearch: true },
        {
          name: "orderId",
          value: true,
          label: "订单号",
          width: 200,
          isSearch: true
        },
        { name: "currency", value: true, label: "币种", width: 100 },
        { name: "target", value: true, label: "目标币种", width: 100 },
        { name: "orderAmount", value: true, label: "订单金额", width: 100 },
        { name: "targetAmount", value: true, label: "目标金额", width: 100 },
        { name: "confirmations", value: true, label: "确认数" },
        { name: "orderDate", value: true, label: "订单时间", width: 200 },
        {
          name: "address",
          value: true,
          label: "钱包地址",
          width: 460,
          isSearch: true
        },
        { name: "orderStatus", value: true, label: "支付状态" },
        { name: "action", value: true, label: "类型" },
        {
          name: "createTime",
          value: true,
          label: "创建时间",
          width: 200,
          isSearch: true,
          isTime: true,
          handler: this.createdTimeHandler
        }
      ],
      filterSummaries: ["orderAmount"] // 需要统计的字段
    };
  },
  created() {
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
          target: this.currencyNumber[element.Target],
          orderDate: element.UpdateTime.replace("T", " ").substring(0, 19),
          orderAmount: element.Amount / 1,
          targetAmount: element.TargetAmount / 1,
          address: (element.Currency == 4 || element.Currency == 11
            ? element.Hash
            : element.Address
          ).split("-")[0],
          action: element.Action == 1002 ? "OTC" : "普通",
          addressPath: this.addressPath[this.currencyNumber[element.Target]]
            ? (element.Currency == 4 || element.Currency == 11
              ? (this.addressPath[this.currencyNumber[element.Currency]]?this.addressPath[this.currencyNumber[element.Currency]].Tx:'')
              : (this.addressPath[this.currencyNumber[element.Currency]]?this.addressPath[this.currencyNumber[element.Currency]].Address:''))
            : "",
            
          orderStatus: orderStatus[element.Status],
          createTime: element.CreateTime.replace("T", " ").substring(0, 19),
          confirmations: element.Confirmations,
          detail: element
        });
      }, this);
      this.list = list;
    },

    // 状态筛选
    filterStatus(val) {
      this.keyword.status = val;
      if (val > 0) {
        this.fetchSearchData();
      } else {
        this.fetchTableData();
      }
    },
    filterType(val) {
      this.keyword.type = val;
      if (val > 0) {
        this.fetchSearchData();
      } else {
        this.fetchTableData();
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

