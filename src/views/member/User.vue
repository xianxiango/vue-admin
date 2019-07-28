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
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="isChangeWallet = true"
        >快捷加币</el-button>
      </div>
      <div class="header-right">
        <!-- <el-input
          @keyup.enter.native="submitSearch"
          :placeholder="labelList.length ? '' : '搜索UID、IP、类型、邮箱、手机、起止时间'"
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
      <el-table-column label="冻结状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.detail.Block" type="danger">已冻结</el-tag>
          <el-tag size="mini" v-else>未冻结</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
          <!-- <el-button size="mini" @click="handleAccount(scope.$index, scope.row)">对账</el-button> -->
          <el-button
            size="mini"
            v-if="scope.row.detail.Block"
            type="primary"
            @click="handleThaw(scope.$index, scope.row)"
          >解冻</el-button>
          <el-button
            size="mini"
            v-else
            type="danger"
            @click="handleFrozen(scope.$index, scope.row)"
          >冻结</el-button>
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
    <!-- 账号加币  -->
    <el-dialog
      title="账号加币"
      :visible.sync="isChangeWallet"
      :close-on-click-modal="false"
      class="user-unbind"
      width="40%"
    >
      <el-form ref="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="userEmail" placeholder="输入邮箱或数字UID"></el-input>
        </el-form-item>
        <el-form-item label="货币类型">
          <el-select v-model="changeCurrency" placeholder="请选择" v-if="hostConfig">
            <el-option v-for="(value, key) in currentCoin" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流水类型">
          <el-select v-model="selectAction" placeholder="请选择">
            <el-option v-for="(value, key) in flowWaterList" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="inputCurrency"></el-input>
          <p class="tips" style="color: #ca0c16;">*提示：正数为增加，负数为扣除</p>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="currencyRemarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isChangeWallet = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitChangeWallet"
          :loading="isQuickAdd"
        >{{isQuickAdd ? '提交中' : '确 定'}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchData } from "@/api";
import SearchMixin from "@/mixins/search";
import { uidCode } from "@/utils/uidCode";
import { userType, flowWater, bugUid } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "userList",
      searchUrl: "userSearch",
      dynamicTable: [
        { name: "uids", value: false, label: "UID", isSearch: true },
        { name: "userName", value: true, label: "用户姓名" },
        {
          name: "user_type",
          value: true,
          label: "用户类型",
          isSearch: true,
          handler: this.userTypeHandler
        },
        { name: "vip", value: true, label: "vip等级" },
        {
          name: "mobiles",
          value: true,
          label: "用户手机",
          width: 130,
          isSearch: true
        },
        {
          name: "emails",
          value: true,
          label: "用户邮箱",
          width: 220,
          isSearch: true
        },
        { name: "google", value: true, label: "谷歌绑定" },
        { name: "ips", value: true, label: "注册IP", isSearch: true },
        {
          name: "createTime",
          value: true,
          label: "注册时间",
          width: 180,
          isSearch: true,
          isTime: true,
          handler: this.createdTimeHandler
        }
      ],
      filterSummaries: [], // 需要统计的字段
      isChangeWallet: false,
      isQuickAdd: false,
      userEmail: "",
      changeCurrency: "",
      selectAction: "",
      inputCurrency: "",
      currencyRemarks: "",
      flowWaterList: flowWater
    };
  },
  computed: {
    hostConfig: function() {
      return this.$store.state.hostConfig;
    }
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = [];
      data.forEach(function(element) {
        list.push({
          uids: element.Uid,
          userName: element.UserName,
          uidCode: uidCode(element.Uid),
          user_type: userType[element.Type],
          mobiles: String(element.Mobile).substring(6),
          emails: element.Email,
          google: element.GgAuth ? "已绑定" : "未绑定",
          ips: element.CreateIP,
          createTime: element.CreateTime.replace("T", " ").substring(0, 19),
          detail: element,
          vip: element.Vip
        });
      }, this);
      this.list = list;
    },
    // 详情
    handleDetail(index, row) {
      this.$router.push({ name: "memberDetail", query: { uid: row.uids } });
    },
    // handleAccount(index, row) {
    //   this.$router.push({ name: "memberAccount", query: { uid: row.uid } });
    // },
    // 冻结
    handleFrozen(index, row) {
      this.$prompt("请输入冻结理由", "冻结用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (!value) {
            this.$message.info("请输入冻结理由");
            return false;
          }
          fetchData("userFrozen", {
            reason: value,
            uid: row.detail.Uid,
            block: row.detail.Block ? false : true
          }).then(data => {
            if (data) {
              this.$Notification.success("操作成功");
              row.detail.Block
                ? (this.list[index].detail.Block = 0)
                : (this.list[index].detail.Block = 1);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 解冻
    handleThaw(index, row) {
      this.$confirm(`确认解冻 ${row.uid} 用户吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          fetchData("userFrozen", {
            uid: row.detail.Uid,
            block: row.detail.Block ? false : true
          }).then(data => {
            if (data) {
              this.$Notification.success("操作成功");
              row.detail.Block
                ? (this.list[index].detail.Block = 0)
                : (this.list[index].detail.Block = 1);
            }
          });
        })
        .catch(err => console.log(err));
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
      } else if (val.indexOf("@") !== -1) {
        first = "邮箱";
        last = val;
        this.changeLabelList(first, last);
      } else if (
        this.arrayMemberLen(val, 11) == "1" &&
        parseInt(val) > 10000000000
      ) {
        first = "手机";
        last = val;
        this.changeLabelList(first, last);
      } else if (val.split(".").length === 4) {
        first = "IP";
        last = val;
        this.changeLabelList(first, last);
      } else if (val.indexOf("~") !== -1) {
        first = "时间";
        last = val;
        this.changeLabelList(first, last);
      } else if (this.arrayMemberLen(val, 6) == "1") {
        first = "UID";
        last = val;
        this.changeLabelList(first, last);
      } else if (
        val === userType[1] ||
        val === userType[2] ||
        val === userType[3] ||
        val === userType[8]
      ) {
        first = "类型";
        last = val;
        this.changeLabelList(first, last);
      } else {
        this.$message.info("抱歉!无法识别搜索内容");
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
          case "IP":
            params.ips = item[1];
            break;
          case "邮箱":
            params.emails = item[1];
            break;
          case "手机":
            params.mobiles = item[1];
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
          case "类型":
            let type = 0;
            for (let key in userType) {
              if (item[1] === userType[key]) {
                type = key;
              }
            }
            params.user_type = type;
            break;

          default:
            console.log(" >> 无法解析搜索内容...");
            break;
        }
      });
      return params;
    },
    // 快捷加减币
    async submitChangeWallet() {
      if (!this.userEmail) return;
      this.isQuickAdd = true;
      let uid = null;
      if (this.userEmail.indexOf("@") !== -1) {
        // 邮箱账号
        const result = await fetchData("userSearch", {
          emails: this.userEmail
        });
        if (result && result.list && result.list.length)
          uid = result.list[0].Uid;
      } else if (
        this.userEmail.length === 8 &&
        parseInt(this.userEmail) > 10000000
      ) {
        // 数字ID
        uid = this.userEmail;
      } else {
        this.$message.error("抱歉！无法识别内容");
        return false;
      }
      if (!uid) {
        this.$message.error("抱歉！获取用户ID失败");
        return false;
      }
      const params = {
        currency: this.changeCurrency,
        uid: uid,
        action: this.selectAction, // 9002 9004
        amount: Math.abs(this.inputCurrency),
        remarks: this.currencyRemarks
      };
      if (this.inputCurrency.indexOf("-") !== -1) {
        params.type = "sub";
      } else {
        params.type = "add";
      }
      if (this.changeCurrency == "1101") {
        params.currency = "11";
        params.unlock = false;
      }
      if (this.changeCurrency == "1102") {
        params.currency = "11";
        params.unlock = true;
      }
      this.$confirm(
        `确认给账户 ${uid} ${params.type === "add" ? "增加" : "扣除"}${Math.abs(
          this.inputCurrency
        )}${this.currentCoin[this.changeCurrency]}吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          fetchData("userWallet", params).then(data => {
            this.isQuickAdd = false;
            if (data) {
              this.userEmail = "";
              this.$Notification.success("操作成功");
            }
          });
        })
        .catch(err => {
          this.isQuickAdd = false;
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less">
.user-unbind {
  .el-dialog__body {
    padding: 30px 50px;
  }
}
</style>


