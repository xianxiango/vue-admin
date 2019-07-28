<template>
  <el-upload
    class="public-uploader"
    ref="image"
    :show-file-list="false"
    :limit="1"
    :on-exceed="handleExceed"
    :action="url"
    :on-success="handleSuccess"
  >
    <div v-if="image">
      <div class="avatar">
        <img :src="image">
      </div>
      <i class="delete el-icon-close" @click.stop="handleDelete"></i>
    </div>
    <i v-else class="el-icon-plus public-uploader-icon">{{text}}</i>
  </el-upload>
</template>

<script>
import { fetchData } from "@/api";
export default {
  props: {
    url: {
      type: String
    },
    text: {
      type: String
    },
    src: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      info: null,
      image: null
    };
  },
  watch: {
    src(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.image = this.src;
      }
    }
  },
  methods: {
    // 清除文件
    clearFiles() {
      this.info = null;
      this.image = null;
      this.$refs.image.clearFiles();
      this.$emit("success", this.index, null);
    },
    // 超过限制
    handleExceed(file, fileList) {
      this.$message("当前已选中文件");
    },
    // 上传成功
    handleSuccess(res, file) {
      if (!res.code && res.data) {
        this.info = res.data;
        let _this = this;
        var timeout = setTimeout(function() {
          _this.image = res.data.filename;
          _this.$emit("success", _this.index, res.data);
          if (timeout != "") {
            clearTimeout(timeout);
          }
        }, 1000);
      } else {
        this.$message(res.message);
      }
    },
    // 删除文件
    handleDelete() {
      if (!this.info && !this.image) return;
      let id;
      if (this.info && this.image) {
        const list = this.info.filename.split("/");
        const item = list[list.length - 1];
        id = item;
      } else if (this.image && !this.info) {
        const list = this.image.split("/");
        const item = list[list.length - 1];
        id = item;
      }
      fetchData("imageDelete", {
        id: id
      }).then(data => {
        if (data) {
          this.info = null;
          this.image = null;
          this.$refs.image.clearFiles();
          this.$emit("success", this.index, null);
        }
      });
    }
  },
  created() {
    if (this.src) {
      this.image = this.src;
    }
  }
};
</script>

<style lang="less">
.public-uploader {
  text-align: center;
  float: left;
  margin: 5px 9px 5px;
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
  .public-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    width: 326px;
    height: 160px;
    line-height: 160px;
    text-align: center;
  }
  .avatar {
    width: 326px;
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
</style>

