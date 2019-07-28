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
    <el-table
      class="public-table"
      :data="list"
      border
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
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
import Moment from "moment";
import SearchMixin from "@/mixins/search";
import { uidCode } from "@/utils/uidCode";
import { userType, userLogsCmd, bugUid } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: "", // 搜索时间周期
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "userLogs",
      searchUrl: "userLogs",
      dynamicTable: [
        { name: "uid", value: false, label: "UID", isSearch: true },
        { name: "agent", value: true, label: "来源" },
        { name: "cmdid", value: true, label: "指令", isSearch: true },
        { name: "params", value: true, label: "参数" },
        { name: "state", value: true, label: "状态" },
        { name: "ip", value: true, label: "IP" },
        { name: "time", value: true, label: "时间" }
      ],
      filterSummaries: [] // 需要统计的字段
    };
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = [];
      data.forEach(function(element) {
        list.push({
          uid: element.Uid ? element.Uid : "",
          uidCode: element.Uid ? uidCode(element.Uid) : "",
          agent: element.Agent,
          cmdid: element.zhdesc,
          params: element.Params,
          state: element.Status ? element.Status : "成功",
          ip: element.IP,
          time: Moment(element.Time).format("YYYY-MM-DD HH:mm:ss"),
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
      } else if (
        Object.keys(userLogsCmd).find(key => userLogsCmd[key] === val)
      ) {
        first = "指令";
        last = val;
        this.changeLabelList(first, last);
      } else {
        this.$message(`抱歉!无法解析[${val}]`);
        return false;
      }
    },
    cmdidHandler(item) {
      // console.log(userLogsCmd)
      const cmdId = Object.keys(userLogsCmd).find(
        val => userLogsCmd[val] === item
      );
      if (cmdId) {
        return cmdId;
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
          case "指令":
            const cmdId = Object.keys(userLogsCmd).find(
              val => userLogsCmd[val] === item[1]
            );
            if (cmdId) {
              params.cmd_id = cmdId;
            }
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

