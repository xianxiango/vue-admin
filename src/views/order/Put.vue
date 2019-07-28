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
            <el-option label="等待审核" :value="5"></el-option>
            <el-option label="审核失败" :value="6"></el-option>
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
            <el-option label="普通" :value="2001"></el-option>
            <el-option label="OTC" :value="2003"></el-option>
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
      <el-table-column prop="uid" label="UID" width="80">
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
          <a
            v-if="item.name === 'address'"
            :href="scope.row.addressPath + scope.row.address+((scope.row.address.substr(0, 2) == '0x')?'#tokentxns':'')"
            target="_block"
            class="jump-detail jump-color"
          >
            <span
              v-if="scope.row.detail.Status === 5||(scope.row.detail.Status === 6&&scope.row.detail.Is5Min ==1)"
              style="color:#64d572"
            >{{scope.row[item.name]}}</span>
            <span v-else>{{scope.row[item.name]}}</span>
          </a>
          <span v-else>
            <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span>
            <span v-if="scope.row[item.name]==0">-</span>
            <el-popover
              v-if="scope.row.WithdrawStatus === 2 && item.name === 'orderStatus'"
              placement="top"
              width="200"
              trigger="hover"
              :content="scope.row.WithdrawInfo"
            >
              <i slot="reference" class="error-info el-icon-warning"></i>
            </el-popover>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            v-if="scope.row.detail.Status === 5||(scope.row.detail.Status === 6&&scope.row.detail.Is5Min ==1)"
            @click="handleConfirm(scope.$index, scope.row)"
          >审核</el-button>
          <el-button
            size="mini"
            type="success"
            v-else-if="scope.row.detail.Status === 3"
            @click="handleVerify(scope.$index, scope.row)"
          >处理</el-button>
          <div v-else>
            <el-tag type="info">{{scope.row.orderStatus}}</el-tag>
            <div v-if="scope.row.orderStatus=='异常'">{{scope.row.StatusMsg}}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div
      style="font-size: 14px;
    color: #606266;
    margin-bottom: 20px;"
    >筛选后到账金额合计：{{totalTargetAmount}}</div>
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
    <!-- 提现弹窗  -->
    <el-dialog title="提现" :visible.sync="centerVisible" width="30%" center>
      <p>目标币种：{{orderInfo.currency}}</p>
      <p>目标地址：{{orderInfo.address}}</p>
      <p>到账金额：{{orderInfo.targetAmount}}</p>
      <!-- <p>真实姓名：{{orderInfo.userName}}</p> -->
      <!-- <p>银行卡号：{{orderInfo.bankNo}}</p> -->
      <!-- <p>银行信息：{{orderInfo.bankName+orderInfo.bankBrach}}</p> -->
      <p>
        自动审核：
        <span v-if="orderInfo.isUnusual==0">通过</span>
        <span v-else style="color:#F56C6C">异常</span>
      </p>
      <p>当前状态：{{orderInfo.statusMsg}}</p>
      <el-radio-group v-model="putMode" size="small" style="margin-top:10px;">
        <el-radio :label="1" border>人工提现</el-radio>
        <el-radio :label="0" border>自动提现</el-radio>
      </el-radio-group>
      <el-form label-position="top" v-if="putMode==1" class="input-hash">
        <el-form-item label="请输入处理完成的HASH:">
          <el-input v-model="inputHash"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cancelOrder">拒绝</el-button>
        <el-button type="primary" @click="confirmPut">通过</el-button>
      </span>
    </el-dialog>
    <!-- OTC提现弹窗  -->
    <el-dialog title="提现" :visible.sync="centerVisibleOTC" width="30%" center>
      <p>目标币种：{{orderInfo.currency}}</p>
      <!-- <p>目标地址：{{orderInfo.address}}</p> -->
      <p>到账金额：{{orderInfo.targetAmount}}</p>
      <p>参考价格：{{orderInfo.orderUnitPrice}}</p>
      <p>真实姓名：{{orderInfo.userName}}</p>
      <p>银行卡号：{{orderInfo.bankNo}}</p>
      <p>银行信息：{{orderInfo.bankName+orderInfo.bankBrach}}</p>
      <p>
        自动审核：
        <span v-if="orderInfo.isUnusual==0">通过</span>
        <span v-else style="color:#F56C6C">异常</span>
      </p>
      <p>当前状态：{{orderInfo.statusMsg}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="otcSell(1)">拒绝</el-button>
        <el-button type="primary" @click="otcSell(0)">通过</el-button>
      </span>
    </el-dialog>
    <!-- 审核弹窗  -->
    <el-dialog title="审核" :visible.sync="verifyVisible" width="30%" center>
      <div class="order-info" v-if="orderInfo">
        <p>UID：{{orderInfo.uid}}</p>
        <p>币种：{{orderInfo.currency}}</p>
        <p>金额：{{orderInfo.orderAmount}}</p>
        <p>订单号：{{orderInfo.orderId}}</p>
        <p>钱包地址：{{orderInfo.address}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cancelOrder">取消订单</el-button>
        <el-button type="success" @click="doneOrder">完成订单</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchData } from "@/api";
import SearchMixin from "@/mixins/search";
import { uidCode } from "@/utils/uidCode";
import { orderStatus, bugUid, putHandler } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      totalTargetAmount: "",
      param: {
        // 请求附带参数
        action: 2,
        status: -1,
        currency: -1,
        type: -1
      },
      keyword: {
        // 搜索附带参数
        action: 2,
        status: -1,
        currency: -1,
        type: -1
      },

      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "orderPut",
      searchUrl: "orderPutSearch",
      filterValue: -1,
      typeValue: -1,
      filterCoin: -1,
      dynamicTable: [
        { name: "uid", value: false, label: "UID", isSearch: true },
        {
          name: "orderId",
          value: true,
          label: "订单号",
          width: 100,
          isSearch: true
        },
        { name: "currency", value: true, label: "币种", width: 90 },
        { name: "target", value: true, label: "目标币种", width: 90 },
        { name: "orderAmount", value: true, label: "提现金额", width: 80 },
        { name: "targetAmount", value: true, label: "到账金额", width: 80 },
        { name: "walletTag", value: true, label: "标签", width: 90 },
        {
          name: "address",
          value: true,
          label: "钱包地址",
          width: 300,
          isSearch: true
        },
        { name: "handler", value: true, label: "操作", width: 50 },
        { name: "orderStatus", value: true, label: "支付状态", width: 90 },
        { name: "action", value: true, label: "类型", width: 50 },
        { name: "orderDate", value: true, label: "更新时间", width: 140 },
        {
          name: "createTime",
          value: true,
          label: "订单时间",
          width: 140,
          isSearch: true,
          isTime: true,
          handler: this.createdTimeHandler
        }
        // { name: 'StatusMsg', value: true, label: '错误信息', width: 200 }
      ],
      centerVisible: false,
      centerVisibleOTC: false,
      putMode: 1,
      inputHash: "",
      orderId: null,
      uid: null,
      orderIndex: null,
      verifyVisible: false,
      orderInfo: {},
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
          userName: element.UserName,
          currency: this.currencyNumber[element.Currency],
          target: this.currencyNumber[element.Target],
          orderDate: element.UpdateTime.replace("T", " ").substring(0, 19),
          orderAmount: element.Amount / 1,
          targetAmount: element.TargetAmount / 1,
          hash: element.Hash,
          bankNo: element.BankNo,
          address: element.Address.split("@")[1]
            ? element.Address.split("@")[1]
            : element.Address.split("@")[0],
          walletTag: element.Address.split("@")[1]
            ? element.Address.split("@")[0]
            : "",
          // addressPath: this.addressPath[this.currencyNumber[element.Target]]
          //   .Address,
          addressPath: this.addressPath[this.currencyNumber[element.Target]]
            ? this.addressPath[this.currencyNumber[element.Target]].Address
            : "",
          action: element.Action == 2003 ? "OTC" : "普通",
          orderStatus:
            element.Status == "6"
              ? orderStatus[element.Status] + "-" + element.StatusMsg
              : orderStatus[element.Status],
          status: element.Status,
          createTime: element.CreateTime.replace("T", " ").substring(0, 19),
          WithdrawStatus: element.WithdrawStatus,
          WithdrawInfo: element.WithdrawInfo,
          handler: putHandler[element.Handler],
          isUnusual: element.IsUnusual,
          statusMsg: element.StatusMsg,
          bankBrach: element.BankBrach,
          bankName: element.BankName,
          orderUnitPrice: element.OrderUnitPrice,
          detail: element
        });
      }, this);
      this.list = list;
    },
    filterType(val) {
      this.keyword.type = val;
      if (val > 0) {
        this.fetchSearchData();
      } else {
        this.fetchTableData();
      }
    },
    // 审核
    handleConfirm(index, row) {
      this.orderIndex = index;
      this.orderInfo = row;
      this.orderId = row.detail.Id;
      this.uid = row.detail.Uid;
      if (row.action == "OTC") {
        this.centerVisibleOTC = true;
      } else {
        this.centerVisible = true;
      }
    },
    // 处理
    handleVerify(index, row) {
      this.orderInfo = row;
      this.orderIndex = index;
      this.verifyVisible = true;
    },
    //otc订单
    otcSell(status) {
      var message;
      if (status == 0) {
        message = `订单 ${this.orderInfo.orderId}${
          this.orderInfo.isUnusual > 0 ? "，该Uid存在账额异常，" : ""
        } 确认完成吗?`;
      } else {
        message = `确认取消 ${this.orderInfo.orderId} 订单吗?`;
      }

      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {};

          params.uids = this.uid;
          params.orderid = this.orderId;
          params.status = status;
          fetchData("otcSell", params).then(data => {
            if (data) {
              this.fetchTableData();
              this.centerVisibleOTC = false;
              this.$Notification.success("操作成功");
            }
          });
        })
        .catch(err => console.log(err));
    },
    // 确认提现
    confirmPut() {
      this.$confirm(
        `订单 ${this.orderInfo.orderId}${
          this.orderInfo.isUnusual > 0 ? "，该Uid存在账额异常，" : ""
        }确认完成吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const params = {};
          if (this.putMode) {
            if (!this.inputHash) {
              this.$message.info("请输入HASH");
              return false;
            }
            params.demand = 1;
            params.hash = this.inputHash;
            params.orderid = this.orderId;
          } else {
            params.demand = 0;
            params.hash = this.inputHash;
            params.orderid = this.orderId;
          }
          fetchData("orderWithdraw", params).then(data => {
            if (data) {
              this.fetchTableData();
              this.centerVisible = false;
              this.$Notification.success("操作成功");
            }
          });
        })
        .catch(err => console.log(err));
    },
    // 取消订单
    cancelOrder() {
      this.$confirm(`确认取消 ${this.orderInfo.orderId} 订单吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetchData("orderChange", {
            action: "cancel",
            orderid: this.orderInfo.orderId,
            reject: 1
          }).then(data => {
            if (data) {
              this.fetchTableData();
              this.verifyVisible = false;
              this.centerVisible = false;
              this.$Notification.success("操作成功");
            }
          });
        })
        .catch(err => console.log(err));
    },
    // 完成订单
    doneOrder() {
      this.$confirm(`订单 ${this.orderInfo.orderId} 确认完成吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetchData("orderChange", {
            action: "complete",
            orderid: this.orderInfo.orderId
          }).then(data => {
            if (data) {
              this.fetchTableData();
              this.verifyVisible = false;
              this.$Notification.success("操作成功");
            }
          });
        })
        .catch(err => console.log(err));
    },
    // 错误信息
    errorInfo(index, row) {
      if (!row.error) {
        fetchData("orderLogs", {
          orderid: row.orderId
        }).then(data => {
          console.log(data);
          if (data) this.list[index].error = data;
        });
      }
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
            params.uid = item[1];
            break;
          case "订单号":
            params.orderId = item[1];
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

<style lang="less" scoped>
.order-info {
  padding: 20px 30px;
  p {
    line-height: 32px;
  }
}

.error-info {
  margin-left: 10px;
}
</style>


