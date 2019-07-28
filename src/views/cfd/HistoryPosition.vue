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
        :width="item.width"
        v-for="item in dynamicTable"
        :label="item.label"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span>
          <span v-if="scope.row[item.name]==0">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="手续费" width="120">
        <template slot-scope="scope">
          <p v-html="formatterFee(scope.row)"></p>
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
  historyCONST,
  cfdHistoryAction,
  historyAction,
  historyType,
  historyOperate
} from "@/utils/tdexMap";
import Decimal from "@/utils/decimal";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "cfdHistoryPosition",
      searchUrl: "cfdHistoryPositionSearch",
      // currencyNumber: currencyNumber,
      dynamicTable: [
        { name: "uids", value: false, label: "UID", isSearch: true },
        {
          name: "pid",
          value: true,
          label: "仓位ID",
          width: 90,
          isSearch: true
        },
        {
          name: "pIdCode",
          value: true,
          label: "仓位ID",
          width: 60
        },
        {
          name: "name",
          value: true,
          label: "产品",
          width: 120,
          isSearch: true
        },
        { name: "coin", value: true, label: "币种", width: 50, isSearch: true },
        { name: "direction", value: true, label: "方向", width: 50 },
        { name: "lever", value: true, label: "杠杆", width: 70 },
        { name: "amount", value: true, label: "数量", width: 100 },
        { name: "price", value: true, label: "开仓均价" },
        { name: "margin", value: true, label: "总保证金" },
        { name: "pureMargin", value: true, label: "仓位保证金" },
        { name: "type", value: true, label: "类型", width: 100 },
        { name: "cPrice", value: true, label: "成交价" },
        { name: "realyPNL", value: true, label: "已实现盈亏" },
        { name: "valueFee", value: true, label: "valueFee" },
        { name: "coin1Fee", value: true, label: "coin1Fee" },
        { name: "coin2Fee", value: true, label: "coin2Fee" },
        { name: "fundFee", value: true, label: "fundFee" },
        { name: "originFee", value: true, label: "originFee" },
        { name: "coinFee", value: true, label: "coinFee" },
        { name: "valueOriginFee", value: true, label: "valueOriginFee" },
        // { name: "pingPrice", value: true, label: "强平价格" },
        {
          name: "commission",
          value: false,
          label: "手续费"
        },
        {
          name: "createTime",
          value: true,
          label: "创建时间",
          isSearch: true,
          isTime: true,
          width: 150,
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
        //   price: element.Price,
        //   markPrice: markPrice,
        //   volume: element.Volume,
        //   side: element.Side,
        //   scale: element.contract.Scale
        // });
        // const plValue = plVal ? plVal : "0.00";
        // const marValue = profitRate(plVal, parseInt(element.Margin));
        var parsePositionList = this.parsePositionList(element);
        list.push({
          uids: element.UID,
          uidCode: uidCode(element.UID),
          pid: element.ID,
          pIdCode: element.IdCode,
          name: element.Code,
          instructions: element.Shared ? "平仓" : "开仓",
          direction: element.Side ? "做空" : "做多",
          amount: element.Volume / 1,
          lever: Number(element.Scale).toFixed(2) + "x",
          price: this.numFilter(element.Price / 1),
          realyPNL: this.numFilter(element.RealyPNL / 1),
          // type: this.getType(element),
          // markPrice: markPrice,
          // fundFee: element.FundFee,
          pingPrice: Math.round(element.Force),
          margin: this.numFilter(element.margin),
          // cost: Number(element.Margin).toFixed(2),
          pureMargin: this.numFilter(element.PureMargin),
          coin: this.currencyNumber[element.MarginType],
          // plVal: plValue + "(" + marValue + "%)",
          cPrice: element.CloseWeight
            ? element.CloseWeight / element.Volume
            : null,
          coin1Fee: element.Coin1Fee,
          coin2Fee: element.Coin2Fee,
          valueFee: element.ValueFee,
          fundFee: element.FundFee,
          originFee: element.OriginFee,
          coinFee: element.CoinFee,
          valueOriginFee: element.ValueOriginFee,
          type: historyOperate[element.Operate],
          state: futuresState[element.State],
          comment: "",
          chargeFeeDesc: parsePositionList.ChargeFeeDesc,
          chargeFeeUnit: parsePositionList.ChargeFeeUnit,
          chargeFeeOriginDesc: parsePositionList.ChargeFeeOriginDesc,
          commission:
            parsePositionList.ChargeFeeDesc +
            " " +
            parsePositionList.ChargeFeeUnit,
          createTime: element.CreatedAt.replace("T", " ").substring(0, 19),
          detail: element
        });
      }, this);
      this.list = list;
    },
    // 添加标签列表
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
    formatterFee(row, column) {
      if (row.chargeFeeOriginDesc === undefined) {
        row.chargeFeeOriginDesc = "";
      }
      var result = `<span style="text-decoration:line-through;" >${row.chargeFeeOriginDesc}</span> ${row.chargeFeeDesc} ${row.chargeFeeUnit}`;
      return result;
    },
    parsePositionList(list, itemCallback) {
      if (!list) return [];

      // var oldPositionCodes = this.positionCodes;
      // this.positionCodes = [];

      // var delList = [],
      //   addList = [];

      // this.netPositionStat = {};

      try {
        var item = list;

        var sb = this.currencyNumber[item.MarginType];

        var fixed = 0;

        var isUpdateSwap = false;
        // if (item.FundFee!=0) {
        //资金费用

        // console.log(item.ShowDigits)
        item.FundFee = Decimal.toFixed(item.FundFee || 0);
        item.FundFeeDesc =
          Decimal.toFixed(item.FundFee || 0, item.ShowDigits) + " " + sb;

        item.OriginFeeDesc =
          Decimal.toFixed(item.OriginFee || 0, item.ShowDigits) + " " + sb;

        item.ValueOriginFeeDesc =
          Decimal.ceil(item.ValueOriginFee || 0, fixed) + " " + "TD";

        //手续费
        if (Number(item.Coin1Fee) == 0 && Number(item.Coin2Fee) == 0) {
          //BTC
          item.ChargeFee = item.CoinFee;
          item.ChargeFeeDesc = Decimal.toFixed(
            Decimal.accAdd(item.ChargeFee, item.FundFee),
            item.ShowDigits
          );
          item.ChargeFeeUnit = sb;
          // if (Number(item.ChargeFee)<Number(item.OriginFee)){
          //     item.ChargeFeeOriginDesc = Decimal.toFixed(item.OriginFee, contract.ShowFixed);
          // }
        } else {
          //TD
          //资金费用换算成TD
          if (Number(item.FundFee)) {
            item.ValueFundFee = Decimal.ceil(
              Decimal.accMul(
                item.FundFee,
                Decimal.accDiv(item.ValueOriginFee, item.OriginFee)
              ),
              fixed
            );
            item.ValueFundFeeDesc = item.ValueFundFee;
          } else {
            item.ValueFundFee = 0;
          }

          //佣金折扣的
          item.CoinFeeVip = Decimal.accAdd(item.Coin1Fee, item.Coin2Fee);
          var coinFeeVip = Decimal.round(item.CoinFeeVip, fixed);
          item.CoinFeeVipDesc = coinFeeVip + " " + "TD";
          //佣金还需支付BTC
          item.CoinFeeDesc =
            Decimal.toFixed(item.CoinFee, item.ShowDigits) + " " + sb;
          //佣金折合TD
          var valueFee = Decimal.ceil(item.ValueFee, fixed);
          item.ValueFeeDesc = valueFee + " " + "TD";

          //佣金总扣除的TD
          item.ChargeFee = Decimal.accAdd(coinFeeVip, valueFee);
          //佣金+资金费用
          item.ChargeFeeDesc = Decimal.ceil(
            Decimal.accAdd(item.ChargeFee, item.ValueFundFee),
            fixed
          );
          item.ChargeFeeUnit = "TD";
          // if (Number(item.ChargeFee)<Number(item.ValueOriginFee)){
          item.ChargeFeeOriginDesc = Decimal.accAdd(
            Decimal.ceil(item.ValueOriginFee, 0),
            Decimal.ceil(item.ValueFundFee, 0),
            fixed
          );

          // }
        }

        if (
          Number(item.Coin1ExtraFee) ||
          Number(item.Coin2ExtraFee) ||
          Number(item.ExtraFee)
        ) {
          item.extraFlag = true;
          //额外费用
          if (
            Number(item.Coin1ExtraFee) == 0 &&
            Number(item.Coin2ExtraFee) == 0
          ) {
            // 无抵扣
            item.OriginExtraFeeDes = item.OriginExtraFee + " " + sb; //原始
            item.ValueOriginExtraFeeDes = item.ValueOriginExtraFee + " " + "TD"; //折算TD
          } else {
            // 抵扣数量
            item.extraDeduction = Decimal.accAdd(
              item.Coin1ExtraFee,
              item.Coin2ExtraFee
            );
            item.extraDeductionDes = item.extraDeduction + " " + "TD";

            if (Number(item.ExtraFee)) {
              // 部分抵扣
              item.ValueExtraFeeDes = item.ValueExtraFee + " " + sb; //还需要支付
              item.ExtraFeeDes = item.ExtraFee + " " + "TD"; // 还需要支付换算
            } else {
            }
          }
        }

        //隔夜费折扣
        if (item.hasOwnProperty("OriginSwapFee")) {
          item.SwapFee = Decimal.toFixed(item.OriginSwapFee || 0);

          item.OriginSwapFeeDesc =
            Decimal.toFixed(item.OriginSwapFee || 0, item.ShowDigits) +
            " " +
            sb;

          item.ValueOriginSwapFeeDesc =
            Decimal.ceil(item.ValueOriginSwapFee || 0, fixed) + " " + "TD";

          // if (Number(item.OriginSwapFee)) {
          //   //产品不能抵扣 或者 可以抵扣但vip0
          //   if (
          //     Number(item.ValueOriginSwapFee) == 0 ||
          //     (Number(item.Coin1SwapFee) == 0 && Number(item.Coin2SwapFee) == 0)
          //   ) {
          //     item.ChargeSwapFee = Decimal.toFixed(item.OriginSwapFee || 0);
          //     item.ChargeSwapFeeDesc = Decimal.toFixed(
          //       item.ChargeSwapFee,
          //       item.ShowFixed
          //     );
          //     item.ChargeSwapFeeUnit = sb;

          //     isUpdateSwap = true;
          //   } else {
          //     //抵扣
          //     //vip抵扣部分
          //     item.SwapFeeVip = Decimal.accAdd(
          //       item.Coin1SwapFee,
          //       item.Coin2SwapFee
          //     );
          //     var coinFeeVip = Decimal.round(item.SwapFeeVip, fixed);
          //     item.CoinSwapFeeVipDesc = coinFeeVip + " " + "TD";

          //     //还需支付BTC
          //     item.CoinSwapFeeDesc =
          //       Decimal.toFixed(item.CoinSwapFee, item.ShowFixed) + " " + sb;
          //     //折合TD
          //     var valueFee = Decimal.ceil(item.ValueSwapFee, fixed);
          //     item.ValueSwapFeeDesc = valueFee + " " + "TD";

          //     //总扣除的TD
          //     item.ChargeSwapFee = Decimal.accAdd(coinFeeVip, valueFee);
          //     item.ChargeSwapFeeDesc = Decimal.ceil(item.ChargeSwapFee, fixed);
          //     item.ChargeSwapFeeUnit =  "TD" ;
          //     //未折扣的TD
          //     item.ChargeSwapFeeOriginDesc = Decimal.ceil(
          //       item.ValueOriginSwapFee,
          //       fixed
          //     );

          //     isUpdateSwap = true;
          //   }
          // }
        }

        // if (!isUpdateSwap) {
        //   item.ChargeSwapFeeDesc = Decimal.toFixed(
        //     item.SwapFee,
        //     item.ShowFixed
        //   );
        //   item.ChargeSwapFeeUnit = sb;
        // }
      } catch (e) {
        console.error(e);
      }

      return item;
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
            params.pid = item[1];
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

