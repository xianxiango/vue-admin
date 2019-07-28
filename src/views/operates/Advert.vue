<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createVisible = true">新建</el-button>
      </div>
    </div>
    <!-- 表格  -->
    <el-table class="public-table" :data="list" border v-loading="loading" show-summary @selection-change="handleSelectionChange" :summary-method="getSummaries">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column :prop="item.name" v-if="item.value" :key="item.name" v-for="item in dynamicTable" :label="item.label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="item.name === 'state'">
            <el-tag v-if="!scope.row.detail.Show" type="danger">已隐藏</el-tag>
            <el-tag v-else type="success">已显示</el-tag>
          </span>
          <span v-else>
            <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span><span v-if="scope.row[item.name]==0">-</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="!scope.row.detail.Show" size="mini" type="primary" @click="handleUnEnable(scope.$index, scope.row)">显示</el-button>
          <el-button v-else size="mini" type="danger" @click="handleUnEnable(scope.$index, scope.row)">隐藏</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页  -->
    <el-pagination background @size-change="handleSize" @current-change="handlePage" :current-page="page" :page-sizes="sizeList" :page-size="size" :total="total" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 新建活动  -->
    <el-dialog :close-on-click-modal="false" :visible.sync="createVisible" @close="closeCreate" width="707px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入活动标题"></el-input>
        </el-form-item>
        <!-- <el-form-item label="类型" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择活动类型">
                <el-option label="活动中心" :value="1"></el-option>
              </el-select>
            </el-form-item> -->
        <el-form-item label="时间" prop="startTime">
          <el-date-picker v-model="ruleForm.startTime" value-format="timestamp" type="date" placeholder="开始日期">
          </el-date-picker>
          <span class="line">至</span>
          <el-date-picker @change="watchEndTime" v-model="ruleForm.endTime" value-format="timestamp" type="date" placeholder="结束日期(默认无限制)">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="语言" prop="lang">
          <el-select v-model="ruleForm.lang" placeholder="请选择活动语言">
            <el-option label="中文" value="zh-cn"></el-option>
            <el-option label="英文" value="en-us"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式" prop="sort">
          <el-select v-model="ruleForm.sort" placeholder="请选择排序方式">
            <el-option label="按活动状态排序" :value="0"></el-option>
            <el-option label="按权重状态排序" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重数值" prop="weight" v-if="ruleForm.sort">
          <el-input v-model="ruleForm.weight" placeholder="请输入权重值（数值越大优先级越高）"></el-input>
        </el-form-item>
        <el-form-item label="活动链接" prop="link">
          <el-input v-model="ruleForm.link" placeholder="请输入活动链接"></el-input>
        </el-form-item>
      </el-form>
      <el-upload class="avatar-uploader" ref="imageLarge" :show-file-list="false" :limit="1" :on-exceed="handleExceed" :action="imageUpload" :on-success="handleLargeSuccess">
        <div v-if="imageLarge">
          <div class="avatar">
            <img :src="imageLarge">
          </div>
          <i class="delete el-icon-close" @click.stop="handleLargeDelete"></i>
        </div>
        <i v-else class="el-icon-plus avatar-uploader-icon"> PC图片640*320</i>
      </el-upload>
      <el-upload class="avatar-uploader" ref="imageSmall" :show-file-list="false" :limit="1" :on-exceed="handleExceed" :action="imageUpload" :on-success="handleSmallSuccess">
        <div v-if="imageSmall">
          <div class="avatar">
            <img :src="imageSmall">
          </div>
          <i class="delete el-icon-close" @click.stop="handleSmallDelete"></i>
        </div>
        <i v-else class="el-icon-plus avatar-uploader-icon"> WEB图片300*320</i>
      </el-upload>
      <span slot="footer" class="dialog-footer" style="padding-right: 35px;">
        <el-button @click="closeCreate">取 消</el-button>
        <el-button type="success" @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="createActivity">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import url from '@/api/url'
import Moment from 'moment'
import { fetchData } from '@/api'
import SearchMixin from '@/mixins/search'
const isDev = process.env.NODE_ENV === 'development'
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: '', // 搜索时间周期
      requestUrl: 'advertList',
      imageLarge: '',
      imageSmall: '',
      imageLargeInfo: '',
      imageSmallInfo: '',
      imageUpload: isDev ? '/api' + url.imageUpload : url.imageUpload,
      dynamicTable: [
        // { name: 'type', value: true, label: '类型' },
        { name: 'title', value: true, label: '标题' },
        { name: 'lang', value: true, label: '语言' },
        { name: 'sort', value: true, label: '排序' },
        { name: 'weight', value: true, label: '权重值' },
        { name: 'state', value: true, label: '状态' },
        { name: 'beginTime', value: true, label: '开始时间' },
        { name: 'endTime', value: true, label: '结束时间' },
        { name: 'createTime', value: true, label: '创建时间' }
      ],
      filterSummaries: [],
      createVisible: false,
      ruleForm: {
        title: '',
        type: '',
        startTime: '',
        endTime: '',
        lang: '',
        sort: '',
        link: '',
        weight: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入活动标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择活动类型', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择活动时间', trigger: 'blur' }
        ],
        lang: [
          { required: true, message: '请选择活动语言', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请选择排序方式', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入活动链接', trigger: 'blur' }
        ]
      },
      typeMap: {
        '1': '活动中心'
      },
      sortMap: {
        '0': '按活动状态排序',
        '1': '按权重状态排序'
      },
      editForm: null
    }
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = []
      data.forEach(function(element) {
        list.push({
          type: this.typeMap[element.AdType],
          state: element.Show,
          title: element.Title,
          lang: element.Lang,
          sort: this.sortMap[element.SortType],
          weight: element.Sort,
          beginTime: element.BeginTime.replace('T', ' ').substring(0, 10),
          endTime: parseInt(element.EndTime) > 2000 ? element.EndTime.replace('T', ' ').substring(0, 10) : '无限制',
          createTime: element.Crtime.replace('T', ' ').substring(0, 10),
          detail: element
        })
      }, this)
      this.list = list
    },
    // 观察结束时间
    watchEndTime(val) {
      if (this.ruleForm.startTime) {
        if (this.ruleForm.startTime > val) {
          this.ruleForm.endTime = ''
          this.$message('结束日期不能小于开始日期')
        }
      } else {
        this.ruleForm.endTime = ''
        this.$message('请先选择开始日期')
      }
    },
    // 创建活动
    createActivity() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) this.submitActivity()
      })
    },
    // 提交活动
    submitActivity() {
      if (!this.imageLarge && !this.imageSmall) {
        this.$message('请上传图片')
        return false
      }
      // 活动状态: 0 未开始, 1 已结束, 2 已取消, 3 进行中
      const params = {
        title: this.ruleForm.title, // 标题
        adtype: this.ruleForm.type, // 活动类型
        sort_type: this.ruleForm.sort, // 排序方式
        sort: this.ruleForm.weight ? this.ruleForm.weight : '',  // 权重值
        lang: this.ruleForm.lang, // 语言
        image_small: this.imageSmallInfo ? this.imageSmallInfo.filename : '', // WEB图片
        image_large: this.imageLargeInfo ? this.imageLargeInfo.filename : '', // PC图片
        begin_time: parseInt(this.ruleForm.startTime / 1000), // 开始时间
        end_time: this.ruleForm.endTime ? parseInt(this.ruleForm.endTime / 1000) : 0, // 结束时间
        show: 1, // 是否显示
        url: this.ruleForm.link
      }
      if (this.editForm) {
        params.id = this.editForm.Id
        params.image_small = this.imageSmall
        params.image_large = this.imageLarge
        params.show = this.editForm.Show
        fetchData('advertEdit', params).then(data => {
          if (data) {
            this.resetForm()
            this.closeCreate()
            this.fetchTableData()
            this.$Notification.success('编辑成功')
          }
        })
      } else {
        fetchData('advertAdd', params).then(data => {
          if (data) {
            this.resetForm()
            this.closeCreate()
            this.fetchTableData()
            this.$Notification.success('发布成功')
          }
        })
      }

    },
    // 关闭创建
    closeCreate() {
      this.createVisible = false
      if (this.editForm) {
        this.editForm = null
        this.ruleForm = {
          title: '',
          type: '',
          startTime: '',
          endTime: '',
          lang: '',
          sort: '',
          link: '',
          weight: ''
        }
        if (this.imageLarge) {
          this.imageLarge = ''
          this.$refs.imageLarge.clearFiles()
        }
        if (this.imageSmall) {
          this.imageSmall = ''
          this.$refs.imageSmall.clearFiles()
        }
      }
    },
    // 重置表单
    resetForm() {
      this.$refs.ruleForm.resetFields()
      if (this.imageLarge) {
        this.imageLarge = ''
        this.$refs.imageLarge.clearFiles()
      }
      if (this.imageSmall) {
        this.imageSmall = ''
        this.$refs.imageSmall.clearFiles()
      }
    },
    // 上传PC图片成功
    handleLargeSuccess(res, file) {
      if (!res.code && res.data) {
        this.imageLargeInfo = res.data
        // this.imageLarge = URL.createObjectURL(file.raw)
        this.imageLarge = res.data.filename
      } else {
        this.$message(res.message)
      }
    },
    // 上传WEB图片
    handleSmallSuccess(res, file) {
      if (!res.code && res.data) {
        this.imageSmallInfo = res.data
        // this.imageSmall = URL.createObjectURL(file.raw)
        this.imageSmall = res.data.filename
      } else {
        this.$message(res.message)
      }
    },
    // 移除PC图片
    handleLargeDelete(file, fileList) {
      if (this.imageLargeInfo) {
        fetchData('imageDelete', {
          id: this.imageLargeInfo.id
        }).then(data => {
          if (data) {
            this.imageLarge = null
            this.$refs.imageLarge.clearFiles()
          }
        })
      }
    },
    // 移除WEB图片
    handleSmallDelete(file, fileList) {
      if (this.imageSmallInfo) {
        fetchData('imageDelete', {
          id: this.imageSmallInfo.id
        }).then(data => {
          if (data) {
            this.imageSmall = null
            this.$refs.imageSmall.clearFiles()
          }
        })
      }
    },
    // 超过限制
    handleExceed(file, fileList) {
      this.$message('当前已选中文件')
    },
    // 编辑
    handleEdit(index, row) {
      this.editForm = row.detail
      this.ruleForm.title = row.detail.Title
      this.ruleForm.type = row.detail.AdType
      this.ruleForm.startTime = new Date(row.detail.BeginTime).getTime()
      this.ruleForm.endTime = parseInt(row.detail.EndTime) > 2000 ? new Date(row.detail.EndTime).getTime() : '无限制'
      this.ruleForm.lang = row.detail.Lang
      this.ruleForm.sort = row.detail.SortType
      this.ruleForm.link = row.detail.Url
      this.ruleForm.weight = row.detail.Sort
      if (row.detail.ImageLarge) {
        this.imageLarge = row.detail.ImageLarge
        const item = row.detail.ImageLarge.split('/')
        const id = item[item.length - 1].split('.')
        this.imageLargeInfo = {
          id: id[0]
        }
      }
      if (row.detail.ImageSmall) {
        this.imageSmall = row.detail.ImageSmall
        const item = row.detail.ImageSmall.split('/')
        const id = item[item.length - 1].split('.')
        this.imageSmallInfo = {
          id: id[0]
        }
      }
      this.createVisible = true
    },
    // 隐藏或显示
    handleUnEnable(index, row) {
      const params = {
        id: row.detail.Id,
        title: row.detail.Title, // 标题
        adtype: row.detail.AdType, // 活动类型
        sort_type: row.detail.SortType, // 排序方式
        sort: row.detail.Sort,  // 权重值
        lang: row.detail.Lang, // 语言
        image_small: row.detail.ImageSmall, // WEB图片
        image_large: row.detail.ImageLarge, // PC图片
        begin_time: parseInt(new Date(row.detail.BeginTime).getTime() / 1000), // 开始时间
        end_time: parseInt(new Date(row.detail.EndTime).getTime() / 1000), // 结束时间
        show: row.detail.Show ? 0 : 1, // 是否显示
        url: row.detail.Url
      }
      fetchData('advertEdit', params).then(data => {
        if (data) {
          this.$Notification.success('操作成功')
          this.list[index].detail.Show = !row.detail.Show
        }
      })
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm('确定删除该活动吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetchData('advertDel', { id: row.detail.Id }).then(data => {
          if (data) {
            this.list.splice(index, 1)
            this.$Notification.success('操作成功')
          }
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less">
.avatar-uploader {
  text-align: center;
  float: left;
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
      border-color: #409EFF;
      .delete {
        display: block;
      }
    }
  }
  .avatar-uploader-icon {
    font-size: 18px;
    color: #8c939d;
    width: 300px;
    height: 160px;
    line-height: 160px;
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


