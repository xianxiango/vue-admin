<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="createVisible = true"
        >新建</el-button>
      </div>
    </div>
    <!-- 表格  -->
    <!-- <el-table
      class="public-table"
      :data="list"
      border
      v-loading="loading"
      show-summary
      @selection-change="handleSelectionChange"
      :summary-method="getSummaries"
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
          <span v-if="item.name === 'state'">
            <el-tag v-if="!scope.row.detail.Show" type="danger">已隐藏</el-tag>
            <el-tag v-else type="success">已显示</el-tag>
          </span>
          <span v-else>
            <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span>
            <span v-if="scope.row[item.name]==0">-</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            v-if="!scope.row.detail.Show"
            size="mini"
            type="primary"
            @click="handleUnEnable(scope.$index, scope.row)"
          >显示</el-button>
          <el-button
            v-else
            size="mini"
            type="danger"
            @click="handleUnEnable(scope.$index, scope.row)"
          >隐藏</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <el-card class="box-card">
      <el-row :gutter="40">
        <el-col :span="4" v-for="item in list" :key="item.Url">
          <el-image style="width: 100%; height: 100%" :src="item.Url" :fit="fit"></el-image>
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
    <el-dialog :close-on-click-modal="false" :visible.sync="createVisible" width="707px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输图片标题"></el-input>
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
      <tinymce :height="200" v-model="ruleForm.content"></tinymce>
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
      param: {
        // 请求附带参数
        module: 1
      },
      imageLarge: "",
      imageSmall: "",
      imageLargeInfo: "",
      imageSmallInfo: "",
      imageUpload: isDev ? "/api" + url.imageUpload : url.imageUpload,
      dynamicTable: [{ name: "Url", value: true, label: "标题" }],
      filterSummaries: [],
      createVisible: false,
      ruleForm: {
        title: "",
        content: ""
      },
      rules: {
        title: [{ required: true, message: "请输入活动标题", trigger: "blur" }],
        content: [
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
          Url: element.Url,
          detail: element
        });
      }, this);
      this.list = list;
    },

    // 创建活动
    createActivity() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) this.submitActivity();
      });
    },
    // 提交活动
    submitActivity() {
      if (!this.imageLarge) {
        this.$message("请上传图片");
        return false;
      }
      // 活动状态: 0 未开始, 1 已结束, 2 已取消, 3 进行中
      const params = {
        title: this.ruleForm.title, // 标题
        content: this.ruleForm.content, // 内容
        url: this.imageLarge, // 图片
        module: 1,
        isShow: 1 // 是否显示
      };
      if (this.editForm) {
        params.id = this.editForm.Id;
        params.url = this.imageLarge;
        params.isShow = this.editForm.isShow;
        params.module = this.editForm.module;
        params.title = this.editForm.title;
        params.content = this.editForm.content;
        fetchData("advertEdit", params).then(data => {
          if (data) {
            // this.resetForm();
            this.createVisible = false;
            if (this.editForm) {
              this.editForm = null;
            }
            this.ruleForm = {
              title: "",
              content: ""
            };
            this.imageLarge = null;
            this.$refs.imageLarge.clearFiles();
            this.fetchTableData();
            this.$Notification.success("编辑成功");
          }
        });
      } else {
        fetchData("advertAdd", params).then(data => {
          if (data) {
            // this.resetForm();
            this.createVisible = false;
            if (this.editForm) {
              this.editForm = null;
            }
            this.ruleForm = {
              title: "",
              content: ""
            };
            this.imageLarge = null;
            this.$refs.imageLarge.clearFiles();
            this.fetchTableData();
            this.$Notification.success("发布成功");
          }
        });
      }
    },
    // 关闭创建
    closeCreate() {
      this.createVisible = false;
      if (this.editForm) {
        this.editForm = null;
      }
      this.ruleForm = {
        title: "",
        content: ""
      };
      if (this.imageLarge) {
        this.imageLarge = "";
        this.$refs.imageLarge.clearFiles();
        if (this.imageLargeInfo) {
          var address = this.imageLargeInfo.filename.split("/");
          fetchData("imageDelete", {
            id: address[address.length - 1]
          }).then(data => {
            if (data) {
              this.imageLarge = null;
              this.$refs.imageLarge.clearFiles();
            }
          });
        }
      }
    },
    // 重置表单
    // resetForm() {
    //   this.$refs.ruleForm.resetFields();
    //   if (this.imageLarge) {
    //     this.imageLarge = "";
    //     this.$refs.imageLarge.clearFiles();
    //     if (this.imageLargeInfo) {
    //       var address = this.imageLargeInfo.filename.split("/");
    //       fetchData("imageDelete", {
    //         id: address[address.length - 1]
    //       }).then(data => {
    //         if (data) {
    //           this.imageLarge = null;
    //           this.$refs.imageLarge.clearFiles();
    //         }
    //       });
    //     }
    //   }
    // },
    // 上传PC图片成功
    handleLargeSuccess(res, file) {
      if (!res.code && res.data) {
        this.imageLargeInfo = res.data;
        // this.imageLarge = URL.createObjectURL(file.raw)
        this.imageLarge = res.data.filename;
      } else {
        this.$message(res.message);
      }
    },

    // 移除图片
    handleLargeDelete(file, fileList) {
      if (this.imageLargeInfo) {
        var address = this.imageLargeInfo.filename.split("/");
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
    handleEdit(index, row) {
      this.editForm = row.detail;
      this.ruleForm.title = row.detail.Title;
      this.ruleForm.type = row.detail.AdType;
      this.ruleForm.startTime = new Date(row.detail.BeginTime).getTime();
      this.ruleForm.endTime =
        parseInt(row.detail.EndTime) > 2000
          ? new Date(row.detail.EndTime).getTime()
          : "无限制";
      this.ruleForm.lang = row.detail.Lang;
      this.ruleForm.sort = row.detail.SortType;
      this.ruleForm.link = row.detail.Url;
      this.ruleForm.weight = row.detail.Sort;
      if (row.detail.ImageLarge) {
        this.imageLarge = row.detail.ImageLarge;
        const item = row.detail.ImageLarge.split("/");
        const id = item[item.length - 1].split(".");
        this.imageLargeInfo = {
          id: id[0]
        };
      }
      if (row.detail.ImageSmall) {
        this.imageSmall = row.detail.ImageSmall;
        const item = row.detail.ImageSmall.split("/");
        const id = item[item.length - 1].split(".");
        this.imageSmallInfo = {
          id: id[0]
        };
      }
      this.createVisible = true;
    },

    // 删除
    handleDelete(index, row) {
      this.$confirm("确定删除该活动吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetchData("advertDel", { id: row.detail.Id }).then(data => {
            if (data) {
              this.list.splice(index, 1);
              this.$Notification.success("操作成功");
            }
          });
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


