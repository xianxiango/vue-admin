<template>
  <div class="public-view">
    <el-card class="box-card image-box-card">
      <p style="margin-bottom:10px">学院简介</p>
      <tinymce ref="Tinymce" :height="200" v-model="sContent"></tinymce>
      <el-button type="primary" @click="Send(1)">发 布</el-button>
    </el-card>
    <el-card class="box-card image-box-card">
      <p style="margin-bottom:10px">最新公告</p>
      <textarea name id rows="10" style="width:100%" v-model="nContent"></textarea>
      <el-button type="primary" @click="Send(2)">发 布</el-button>
    </el-card>
    <el-card class="box-card image-box-card">
      <p style="margin-bottom:10px">关于我们</p>
      <textarea name id rows="10" style="width:100%" v-model="oContent"></textarea>
      <el-button type="primary" @click="Send(3)">发 布</el-button>
    </el-card>
  </div>
</template>

<script>
import url from "@/api/url";
import Moment from "moment";
import { fetchData } from "@/api";
// import SearchMixin from "@/mixins/search";

import Tinymce from "@/components/Tinymce";
const isDev = process.env.NODE_ENV === "development";
export default {
  components: {
    Tinymce
  },
  data() {
    return {
      sContent: "",
      nContent: "",
      oContent: ""
    };
  },
  methods: {
    // 提交活动
    Send(type) {
      switch (type) {
        case 1:
          this.setText(this.sContent, 1);
          break;
        case 2:
          this.setText(this.nContent, 2);
          break;
        case 3:
          this.setText(this.oContent, 3);
          break;

        default:
          break;
      }
    },
    setText(content, type) {
      const params = {
        module: type,
        content: content
      };
      fetchData("advertSetText", params).then(data => {
        if (data) {
          this.$Notification.success("编辑成功");
        }
      });
    },
    getText() {
      fetchData("advertGetText").then(data => {
        if (data) {
        }
      });
    }
  },
  created() {
    this.getText();
  }
};
</script>

<style lang="less">
</style>


