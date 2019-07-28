<template>
  <div class="public-view">
    <div class="view-header">
      <div class="header-left">
        短信内容：
        <el-input style="width:50%" placeholder="短信内容" v-model="mobileTemplateId"></el-input>
      </div>
      <div class="header-right">
        <!-- <el-input @keyup.enter.native="submitSearch" :placeholder="labelList.length ? '' : '搜索UID、IP、类型、邮箱、手机、起止时间'" v-model="inputText">
          <i slot="prefix" class="el-input__icon el-icon-date" @click="selectTime"></i>
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
    <!-- 表格  -->
    <el-table
      class="public-table"
      :data="list"
      border
      v-loading="loading"
      show-summary
      @selection-change="handleSelectionChange"
      :summary-method="getSummaries"
      ref="table1"
    >
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column
        :prop="item.name"
        v-if="item.value"
        :key="item.name"
        v-for="item in dynamicTable"
        :label="item.label"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>
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
      :page-sizes="[10, 20, 30, 100,500,1000]"
      :current-page="page"
      :page-size="size"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <div style="margin:60px 0 0">
      <!-- 收信人：<span >{{selectDataString}}</span> -->
      <el-form ref="form" label-width="55px">
        <el-form-item label="收信人">
          <el-input v-model="selectDataString" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-button
      style="margin:20px 0"
      type="primary"
      icon="el-icon-message"
      @click="sendMsg()"
      :loading="sendloading"
    >{{sendloading?"发送中":"发送"}}</el-button>
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce";
import { fetchData } from "@/api";
import SearchMixin from "@/mixins/search";
import { uidCode } from "@/utils/uidCode";
import { userType, bugUid } from "@/utils/tdexMap";
export default {
  mixins: [SearchMixin],
  data() {
    return {
      mobileTemplateId: "",
      sendloading: false,
      lang: "",
      email: {
        enContent: "",
        zhContent: "",
        subject_cn: "",
        subject_en: ""
      },
      period: "", // 搜索时间周期
      list: [],
      isCodeUid: false, // 用户uid需要编码
      requestUrl: "msgList",
      searchUrl: "msgSearch",
      defaultEnd: "", //
      defaultStart: "",
      dynamicTable: [
        { name: "uids", value: true, label: "UID", isSearch: true  },
        { name: "user_type", value: true, label: "用户类型",isSearch: true,
          handler: this.userTypeHandler },
        { name: "mobiles", value: true, label: "用户手机",isSearch: true, },
        { name: "emails", value: true, label: "用户邮箱" ,isSearch: true,},
        { name: "createTime", value: true, label: "最后登录时间", isSearch: true,
          isTime: true,
          handler: this.createdTimeHandler}
      ],
      filterSummaries: [], // 需要统计的字段
      selectdMobile: [],
      selectData: [],
      selectDataString: ""
    };
  },
  created() {
    let _this = this;
    // this.timeout = setInterval(function() {
    //   if (_this.AskEmail() == 1) {
    //     _this.sendloading = false;
    //     _this.$Notification.success("发送成功");
    //   } else {
    //     _this.sendloading = true;
    //   }
    // }, 2000);
  },
  destroyed() {
    // clearTimeout(this.timeout);
    // this.timeout= null;
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = [];
      data.forEach(function(element) {
        list.push({
          uids: element.Uid,
          //   uidCode: uidCode(element.Uid),
          user_type: userType[element.Type],
          mobiles: String(element.Mobile).substring(6),
          emails: element.Email,
          lang: element.Lang,
          createTime: element.LastLoginTime.replace("T", " ").substring(
            0,
            19
          )
        });
      }, this);
      this.list = list;
    },
    // typeHandler(item) {
    //   let type = 0;
    //   for (let key in userType) {
    //     if (item === userType[key]) {
    //       type = key;
    //     }
    //   }
    //   return type;
    // },
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
            const formatDate = item[1].split("~");
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

    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectData = [];
      val.forEach((item, key) => {
        this.selectData[key] = item.mobiles;
      });
      this.selectDataString = this.selectData.join(";");
    },
    // AskEmail() {
    //   fetchData("emailAsk", {}).then(data => {
    //     return data.state;
    //   });
    // },
    sendMsg() {
      //   if (this.AskEmail() == 1) {
      //     this.$Notification.success("邮件发送中，完成后再发");
      //     return;
      //   }
      this.selectdMobile = [];
      this.multipleSelection.forEach((item, key) => {
        this.selectdMobile[key] = item.mobiles;
      });
      if (this.mobileTemplateId == "") {
        this.$message.error("发送失败，请填写短信内容");
        return;
      }
      if (this.selectdMobile.length == 0) {
        this.$message.error("发送失败，无收信人");
        return;
      }
      fetchData("msgSend", {
        content: this.mobileTemplateId,
        mobiles: JSON.stringify(this.selectdMobile)
      }).then(data => {
        console.log(data);
        var len = data;
        for (let i = 0; i < len.length; i++) {
          if (len[i].status == "error") {
            this.$message.error(len[i].msg);
          }
        }
        // if (data) {
        //   //   if (this.AskEmail() == 1) {
        //   //     this.$Notification.success("发送成功");
        //   //   } else {
        //   //     this.$Notification.success("邮件发送中");
        //   //   }
        //   this.$Notification.success("发送成功");
        // } else {

        // }
      });
    }
  }
};
</script>
