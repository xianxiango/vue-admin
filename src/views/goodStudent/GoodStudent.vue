<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="create">新建</el-button>
        <span class="left-span">
          <span>状态：</span>
          <el-select
            style="width: 100px;"
            v-model="filterValue"
            placeholder="请选择"
            @change="filterStatus"
          >
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="显示" :value="1"></el-option>
            <el-option label="隐藏" :value="0"></el-option>
          </el-select>
        </span>
      </div>
    </div>

    <el-card class="box-card image-box-card">
      <el-row :gutter="40">
        <el-col :span="4" v-for="item in list" :key="item.Url" class="box-card-child">
          <div class="box-card-child-image">
            <el-image class="child-image" :src="item.Url" fit="fill" lazy></el-image>
          </div>

          <div class="image-title">{{item.Title}}</div>
          <el-button-group class="button-group">
            <el-button class="edit-botton" type="primary" size="small" @click="handleEdit(item)">编辑</el-button>
            <el-button
              class="edit-botton"
              type="success"
              size="small"
              @click="setIsShow(item,0)"
              v-if="item.IsShow"
            >显示</el-button>
            <el-button
              class="edit-botton"
              type="info"
              size="small"
              @click="setIsShow(item,1)"
              v-if="!item.IsShow"
            >隐藏</el-button>
          </el-button-group>
          <el-button-group class="button-group">
            <el-button class="edit-botton" type="danger" size="small" @click="handleDelete(item)">删除</el-button>
            <el-button
              class="edit-botton"
              type="warning"
              size="small"
              @click="handleSetTop(item)"
            >置顶</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-card>
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
    <!-- 新建活动  -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="createVisible"
      width="707px"
      :show-close="false"
    >
      <el-form :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="Title" placeholder="请输图片标题"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        class="avatar-uploader"
        ref="imageLarge"
        :show-file-list="false"
        :limit="1"
        :on-exceed="handleExceed"
        :action="imageUpload"
        :on-success="handleLargeSuccess"
      >
        <div v-if="imageLarge">
          <div class="avatar">
            <img :src="imageLarge" />
          </div>
          <i class="delete el-icon-close" @click.stop="handleLargeDelete"></i>
        </div>
        <i v-else class="el-icon-plus avatar-uploader-icon">上传图片</i>
      </el-upload>
      <tinymce ref="Tinymce" :height="200" v-model="Content"></tinymce>
      <span slot="footer" class="dialog-footer" style="padding-right: 35px;">
        <el-button @click="closeCreate">取 消</el-button>
        <!-- <el-button type="success" @click="resetForm">重 置</el-button> -->
        <el-button type="primary" @click="createActivity">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import url from "@/api/url";
import Moment from "moment";
import { fetchData } from "@/api";
import SearchMixin from "@/mixins/search";

import Tinymce from "@/components/Tinymce";
const isDev = process.env.NODE_ENV === "development";
export default {
  mixins: [SearchMixin],
  components: {
    Tinymce
  },
  data() {
    return {
      list: [],
      period: "", // 搜索时间周期
      requestUrl: "advertList",
      searchUrl: "advertSearch",
      param: {
        // 请求附带参数
        module: 8,
        isShow: -1
      },
      keyword: {
        // 搜索附带参数
        module: 8
      },
      filterValue: -1,
      imageLarge: "",
      imageSmall: "",
      imageLargeInfo: "",
      imageSmallInfo: "",
      imageUpload: isDev ? "/api" + url.imageUpload : url.imageUpload,
      dynamicTable: [{ name: "Url", value: true, label: "标题" }],
      filterSummaries: [],
      createVisible: false,
      Title: "",
      Content: "",
      rules: {
        Title: [{ required: true, message: "请输入活动标题", trigger: "blur" }],
        Content: [
          { required: true, message: "请输入图片详情", trigger: "blur" }
        ]
      },
      editForm: null
    };
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = [];
      data.forEach(function(element) {
        list.push({
          ID: element.ID,
          Url: element.Url,
          Title: element.Title,
          IsShow: element.IsShow,
          Content: element.Content,
          Module: element.Module,
          detail: element
        });
      }, this);
      this.list = list;
    },
    filterStatus(val) {
      this.param.isShow = val;
      this.fetchTableData();
    },
    create() {
      this.createVisible = true;
    },
    // 创建活动
    createActivity() {
      // this.$refs.ruleForm.validate(valid => {
      //   if (valid) this.submitActivity();
      // });
      this.submitActivity();
    },
    setIsShow(item, type) {
      const params = {
        id: item.ID,
        isShow: type
      };
      fetchData("advertIsShow", params).then(data => {
        if (data) {
          this.fetchTableData();
        }
      });
    },
    // 提交活动
    submitActivity() {
      if (!this.imageLarge) {
        this.$message("请上传图片");
        return false;
      }
      const params = {
        title: this.Title, // 标题
        content: this.Content, // 内容
        url: this.imageLarge, // 图片
        module: this.param.module,
        isShow: 1 // 是否显示
      };
      if (this.editForm) {
        params.id = this.editForm.ID;
        params.url = this.imageLarge;
        params.isShow = this.editForm.IsShow;
        // params.module = this.editForm.Module;
        params.title = this.Title;
        params.content = this.Content;
        fetchData("advertEdit", params).then(data => {
          if (data) {
            // this.resetForm();
            this.createVisible = false;
            this.clearFrom();
            this.fetchTableData();
            this.$Notification.success("编辑成功");
          }
        });
      } else {
        fetchData("advertAdd", params).then(data => {
          if (data) {
            // this.resetForm();
            this.createVisible = false;
            this.clearFrom();
            this.fetchTableData();
            this.$Notification.success("发布成功");
          }
        });
      }
    },
    clearFrom() {
      if (this.editForm) {
        this.editForm = null;
      }
      this.$refs.Tinymce.setHasChange();
      this.Title = "";
      this.Content = "";
      
      this.imageLarge = null;
      this.$refs.imageLarge.clearFiles();
    },
    // 关闭创建
    closeCreate() {
      this.$refs.Tinymce.setHasChange();
      this.createVisible = false;
      if (this.imageLarge) {
        var address = this.imageLarge.split("/");
        this.imageLarge = "";
        this.$refs.imageLarge.clearFiles();
        if (!this.editForm) {
          fetchData("imageDelete", {
            id: address[address.length - 1]
          }).then(data => {
            if (data) {
              // this.imageLarge = null;
              // this.$refs.imageLarge.clearFiles();
            }
          });
        }
      }
      if (this.editForm) {
        this.editForm = null;
      }
      this.Title = "";
      this.Content = "";
    },
    // 上传PC图片成功
    handleLargeSuccess(res, file) {
      if (!res.code && res.data) {
        // this.imageLargeInfo = res.data;
        // this.imageLarge = URL.createObjectURL(file.raw)
        this.imageLarge = res.data.filename;
      } else {
        this.$message(res.message);
      }
    },

    // 移除图片
    handleLargeDelete(file, fileList) {
      if (this.imageLarge) {
        var address = this.imageLarge.split("/");
        // console.log(this.imageLarge);
        fetchData("imageDelete", {
          id: address[address.length - 1]
        }).then(data => {
          if (data) {
            this.imageLarge = null;
            this.$refs.imageLarge.clearFiles();
          }
        });
      }
    },

    // 超过限制
    handleExceed(file, fileList) {
      this.$message("当前已选中文件");
    },
    // 编辑
    handleEdit(row) {
      if (this.$refs.Tinymce) {
        this.$refs.Tinymce.setHasChange();
      }

      this.editForm = row.detail;
      this.Title = row.detail.Title;
      this.Content = row.detail.Content;
      this.imageLarge = row.detail.Url;

      this.createVisible = true;
    },

    // 删除
    handleDelete(item) {
      this.$confirm("确定删除该图片吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetchData("advertDel", { id: item.ID }).then(data => {
            if (data) {
              this.fetchTableData();
              this.$Notification.success("操作成功");
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSetTop(item) {
      this.$confirm("确定置顶该图片吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetchData("advertSetTop", { id: item.ID, module: item.Module }).then(
            data => {
              if (data) {
                this.fetchTableData();
                this.$Notification.success("操作成功");
              }
            }
          );
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less">
.avatar-uploader {
  text-align: center;
  // float: left;
  margin: 5px 9px 30px;
  overflow: hidden;
  position: relative;
  .el-upload {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
      .delete {
        display: block;
      }
    }
  }
  .avatar-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    width: 600px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height: 160px;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    background: #f5f5f5;
    font-size: 0;
    img {
      cursor: pointer;
      max-width: 100%;
      max-height: 100%;
      border: 0;
      display: block;
      margin: 0 auto;
    }
  }
  .delete {
    display: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 40px;
    border-radius: 6px;
  }
}

.demo-ruleForm {
  padding-right: 35px;
  .line {
    padding: 0 5px;
  }
}
</style>


