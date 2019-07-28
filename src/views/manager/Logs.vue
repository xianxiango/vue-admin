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
import { fetchData } from "@/api";
import SearchMixin from "@/mixins/search";
import { adminAction, bugUid } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: "", // 搜索时间周期
      requestUrl: "adminLogs",
      searchUrl: "adminLogsSearch",
      dynamicTable: [
        {
          name: "uid",
          value: true,
          label: "管理员账号",
          isSearch: true,
          handler: this.adminListHandler
        },
        { name: "id", value: true, label: "日志编号" },
        { name: "modules", value: true, label: "操作模块" },
        { name: "target", value: true, label: "操作目标" },
        { name: "params", value: true, label: "携带参数" },
        {
          name: "action",
          value: true,
          label: "操作事件",
          isSearch: true,
          handler: this.actionHandler
        },
        { name: "time", value: true, label: "创建时间" }
      ],
      filterSummaries: [], // 需要统计的字段
      adminList: {}
    };
  },
  methods: {
    // 设置表格数据
    async setTableData(data) {
      if (JSON.stringify(this.adminList) === "{}") {
        const adminMap = await fetchData("adminList");
        if (adminMap && adminMap.length) {
          adminMap.forEach(item => {
            if (!this.adminList[item.uid]) {
              this.adminList[item.uid] = item.username;
            }
          });
        }
      }
      const list = [];
      data.forEach(function(element) {
        list.push({
          id: element.id,
          uid: this.adminList[element.uid],
          orderId: element.Id,
          modules: element.module,
          target: element.target,
          params: element.value,
          action: adminAction[element.action],
          time: element.crtime,
          detail: element
        });
      }, this);
      this.list = list;
    },
    adminListHandler(item) {
      for (let key in this.adminList) {
        if (this.adminList[key] === item) {
          return key;
        }
      }
    },
    actionHandler(item) {
      for (let key in adminAction) {
        if (adminAction[key] === item) {
          return key;
        }
      }
    },
    // 添加标签列表
    addLabelList(val) {
      val = val.replace(/(^\s*)|(\s*$)/g, "");
      let first = "";
      let last = "";
      for (let key in this.adminList) {
        if (this.adminList[key] === val) {
          first = "管理员";
          last = this.adminList[key];
        }
      }
      if (!first && !last) {
        for (let key in adminAction) {
          if (adminAction[key] === val) {
            first = "事件";
            last = adminAction[key];
          }
        }
        if (!first && !last) {
          this.$message("无法识别的内容");
        } else {
          this.changeLabelList(first, last);
        }
      } else {
        this.changeLabelList(first, last);
      }
    },
    // 格式化搜索标签
    formatLabelList() {
      const params = {};
      this.labelList.forEach(element => {
        const item = element.split(":");
        switch (item[0]) {
          case "管理员":
            for (let key in this.adminList) {
              if (this.adminList[key] === item[1]) {
                params.uid = key;
              }
            }
            break;
          case "事件":
            for (let key in adminAction) {
              if (adminAction[key] === item[1]) {
                params.action = key;
              }
            }
            break;
          default:
            this.$message("无法解析搜索内容");
            console.log(" >> 无法解析搜索内容:", element);
            break;
        }
      });
      return params;
    }
  }
};
</script>

