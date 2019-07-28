<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createVisible = true">新建</el-button>
        <span class="left-span">
          <span>状态：</span>
          <el-select style="width: 100px;" v-model="filterValue" placeholder="请选择" @change="filterStatus">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="显示" :value="1"></el-option>
            <el-option label="隐藏" :value="0"></el-option>
          </el-select>
        </span>
      </div>
    </div>
    <!-- 表格  -->
    <el-table class="public-table" :data="list" border v-loading="loading" show-summary @selection-change="handleSelectionChange" :summary-method="getSummaries">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column :prop="item.name" v-if="item.value" :key="item.name" v-for="item in dynamicTable" :label="item.label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="item.name === 'Show'">
            <el-tag v-if="!scope.row.Show" type="danger">已隐藏</el-tag>
            <el-tag v-else type="success">已显示</el-tag>
          </span>
          <span v-else-if="item.name === 'Platform'">
            <el-tag style="margin-right:10px" type="info" v-for="child in scope.row[item.name]" :key="child">{{platformType[child]}}</el-tag>
          </span>
          <span v-else>
            <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span><span v-if="scope.row[item.name]==0">-</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="!scope.row.Show" size="mini" type="primary" @click="handleUnEnable(scope.$index, scope.row)">显示</el-button>
          <el-button v-else size="mini" type="danger" @click="handleUnEnable(scope.$index, scope.row)">隐藏</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页  -->
    <el-pagination background @size-change="handleSize" @current-change="handlePage" :current-page="page" :page-sizes="sizeList" :page-size="size" :total="total" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 新建广告  -->
    <el-dialog :close-on-click-modal="false" :visible.sync="createVisible" @close="closeCreate" width="800px" top="30px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" style="padding-right: 55px;">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入活动标题"></el-input>
        </el-form-item>
        <el-form-item label="语言：" prop="lang">
          <el-radio-group v-model="ruleForm.lang">
            <el-radio label="zh-cn">中文</el-radio>
            <el-radio label="en-us">英文</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="涉及客户端：" prop="client">
          <el-checkbox-group v-model="ruleForm.client" @change="changeClient">
            <el-checkbox label="1" name="type">PC</el-checkbox>
            <el-checkbox label="2" name="type">移动WEB</el-checkbox>
            <el-checkbox label="3" name="type">APP</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="PC链接：" prop="linkPC" v-if="ruleForm.client.indexOf('1') !== -1">
          <el-input style="width: 310px" v-model="ruleForm.linkPC" placeholder="请输入PC链接"></el-input>
          <div class="link-right">
            <span>排列序号：</span>
            <el-input style="width: 165px" v-model="ruleForm.indexPC" placeholder="请输入排列序号"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="WEB链接：" prop="linkWEB" v-if="ruleForm.client.indexOf('2') !== -1">
          <el-input style="width: 310px" v-model="ruleForm.linkWEB" placeholder="请输入WEB链接："></el-input>
          <div class="link-right">
            <span>排列序号：</span>
            <el-input style="width: 165px" v-model="ruleForm.indexWEB" placeholder="请输入排列序号"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="APP链接：" prop="linkAPP" v-if="ruleForm.client.indexOf('3') !== -1">
          <el-input style="width: 310px" v-model="ruleForm.linkAPP" placeholder="请输入APP链接"></el-input>
          <div class="link-right">
            <span>排列序号：</span>
            <el-input style="width: 165px" v-model="ruleForm.indexAPP" placeholder="请输入排列序号"></el-input>
          </div>
        </el-form-item>
        <el-form-item ref="images" class="images">
          <upload-images v-for="(item, index) in imagesList" :url="imageUpload" :text="item.text" :index="index" :key="item.text" @success="imageSuccess" :src="item.src" v-if="item.show"></upload-images>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="padding-right: 55px;">
        <el-button @click="closeCreate">取 消</el-button>
        <el-button type="success" @click="resetAdveert">重 置</el-button>
        <el-button type="primary" @click="createAdveert">发 布</el-button>
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
import UploadImages from '@/components/Upload'
export default {
  mixins: [SearchMixin],
  components: {
    UploadImages
  },
  data() {
    return {
      list: [],
      param: { // 请求附带参数
        show: -1
      },
      requestUrl: 'bannerList',
      imageUpload: isDev ? '/api' + url.imageUpload : url.imageUpload,
      dynamicTable: [
        { name: 'Title', value: true, label: '标题' },
        { name: 'Lang', value: true, label: '语言' },
        { name: 'Show', value: true, label: '状态' },
        { name: 'Platform', value: true, label: '涉及客户端' },
        { name: 'Createtime', value: true, label: '创建时间' }
      ],
      filterSummaries: [],
      createVisible: false,
      ruleForm: {
        title: '',
        lang: 'zh-cn',
        client: ['1', '2', '3'],
        linkPC: '',
        linkWEB: '',
        linkAPP: '',
        indexPC: 0,
        indexWEB: 0,
        indexAPP: 0
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        lang: [
          { required: true, message: '请选择语言', trigger: 'change' }
        ],
        client: [
          { required: true, message: '请选择客户端', trigger: 'change' }
        ],
        linkPC: [
          { required: true, message: '请输入PC链接', trigger: 'blur' }
        ],
        linkWEB: [
          { required: true, message: '请输入WEB链接', trigger: 'blur' }
        ],
        linkAPP: [
          { required: true, message: '请输入APP链接', trigger: 'blur' }
        ]
      },
      imagesList: [
        { text: 'PC:1920*504', info: null, src: '', show: true },
        { text: '移动web:750*252', info: null, src: '', show: true },
        { text: 'ios:750*252', info: null, src: '', show: true },
        { text: 'Android:1080*300', info: null, src: '', show: true }
      ],
      platformType: {
        '1': 'PC',
        '2': '移动WEB',
        '3': 'APP'
      },
      editId: null,
      editShow: 0,
      filterValue: -1
    }
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = []
      data.forEach(function(element) {
        const Platform = []
        element.Createtime = Moment(element.Createtime * 1000).format('YYYY-MM-DD HH:mm:ss')
        element.Updatetime = Moment(element.Updatetime * 1000).format('YYYY-MM-DD HH:mm:ss')
        element.TargetPc && Platform.push('1')
        element.TargetApp && Platform.push('3')
        element.TargetMobile && Platform.push('2')
        element.Platform = Platform
        list.push(element)
      }, this)
      this.list = list
    },
    // 创建广告
    createAdveert() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) this.submitAdveert()
      })
      // if (this.imagesList.some(item => item.info !== null)) {
      //   this.$refs.ruleForm.validate(valid => {
      //     if (valid) this.submitAdveert()
      //   })
      // } else {
      //   this.$message.error('请上传图片')
      // }
    },
    // 提交广告
    submitAdveert() {
      if (this.editId) {
        this.submitEdit()
      } else {
        this.submitAdd()
      }
    },
    // 提交编辑
    submitEdit() {
      fetchData('bannerEdit', {
        id: this.editId,
        title: this.ruleForm.title,
        targetpc: this.ruleForm.client.indexOf('1') !== -1 ? this.ruleForm.linkPC : '',
        targetapp: this.ruleForm.client.indexOf('3') !== -1 ? this.ruleForm.linkAPP : '',
        targetmobile: this.ruleForm.client.indexOf('2') !== -1 ? this.ruleForm.linkWEB : '',
        lang: this.ruleForm.lang,
        show: this.editShow,
        sortpc: this.ruleForm.indexPC,
        sortapp: this.ruleForm.indexAPP,
        sortmobile: this.ruleForm.indexWEB,
        imagepc: this.imagesList[0].info ? this.imagesList[0].info.filename : this.imagesList[0].src,
        imageweb: this.imagesList[1].info ? this.imagesList[1].info.filename : this.imagesList[1].src,
        imageios: this.imagesList[2].info ? this.imagesList[2].info.filename : this.imagesList[2].src,
        imageandroid: this.imagesList[3].info ? this.imagesList[3].info.filename : this.imagesList[3].src
      }).then(data => {
        if (data) {
          this.closeCreate()
          this.fetchTableData()
        }
      })
    },
    // 提交新建
    submitAdd() {
      fetchData('bannerAdd', {
        title: this.ruleForm.title,
        targetpc: this.ruleForm.linkPC,
        targetapp: this.ruleForm.linkAPP,
        targetmobile: this.ruleForm.linkWEB,
        lang: this.ruleForm.lang,
        show: 1,
        sortpc: this.ruleForm.indexPC,
        sortapp: this.ruleForm.indexAPP,
        sortmobile: this.ruleForm.indexWEB,
        imagepc: this.imagesList[0].info ? this.imagesList[0].info.filename : '',
        imageweb: this.imagesList[1].info ? this.imagesList[1].info.filename : '',
        imageios: this.imagesList[2].info ? this.imagesList[2].info.filename : '',
        imageandroid: this.imagesList[3].info ? this.imagesList[3].info.filename : ''
      }).then(data => {
        if (data) {
          this.closeCreate()
          this.fetchTableData()
        }
      })
    },
    // 关闭创建
    closeCreate() {
      this.resetAdveert()
      this.editId = null
      this.editShow = 0
      this.createVisible = false
    },
    // 重置表单
    resetAdveert() {
      this.$refs.images.$children.forEach(item => {
        item.clearFiles()
      })
      this.imagesList.map(val => {
        val.info = null
        val.src = ''
      })
      this.ruleForm = {
        title: '',
        lang: 'zh-cn',
        client: ['1', '2', '3'],
        linkPC: '',
        linkWEB: '',
        linkAPP: '',
        indexPC: 0,
        indexWEB: 0,
        indexAPP: 0
      }
    },
    // 编辑
    handleEdit(index, row) {
      this.ruleForm.title = row.Title
      this.ruleForm.lang = row.Lang
      this.ruleForm.linkPC = row.TargetPc
      this.ruleForm.linkWEB = row.TargetMobile
      this.ruleForm.linkAPP = row.TargetApp
      this.ruleForm.indexPC = row.SortPc
      this.ruleForm.indexWEB = row.SortMobile
      this.ruleForm.indexAPP = row.SortApp
      this.ruleForm.client = []
      row.TargetPc && this.ruleForm.client.push('1')
      row.TargetApp && this.ruleForm.client.push('3')
      row.TargetMobile && this.ruleForm.client.push('2')
      row.ImagePc && (this.imagesList[0].src = row.ImagePc)
      row.ImageWeb && (this.imagesList[1].src = row.ImageWeb)
      row.ImageIos && (this.imagesList[2].src = row.ImageIos)
      row.ImageAndroid && (this.imagesList[3].src = row.ImageAndroid)
      this.editId = row.Id
      this.editShow = row.Show
      this.changeClient()
      this.createVisible = true
    },
    // 隐藏或显示
    handleUnEnable(index, row) {
      const item = row
      fetchData('bannerEdit', {
        id: item.Id,
        show: !item.Show ? 1 : 0,
        title: item.Title,
        targetpc: item.TargetPc,
        targetapp: item.TargetApp,
        targetmobile: item.TargetMobile,
        lang: item.Lang,
        sortpc: item.SortPc,
        sortapp: item.SortApp,
        sortmobile: item.SortMobile,
        imagepc: item.ImagePc,
        imageweb: item.ImageWeb,
        imageios: item.ImageIos,
        imageandroid: item.ImageAndroid
      }).then(data => {
        if (data) this.list[index].Show = !item.Show
      })
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm('确定删除该广告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetchData('bannerDel', {
          id: row.Id,
        }).then(data => {
          if (data) this.list.splice(index, 1)
        })
      }).catch(err => console.log(err))
    },
    // 上传成功
    imageSuccess(index, data) {
      this.imagesList[index].info = data
      this.imagesList[index].src = data ? data.filename : ''
    },
    // 筛选
    filterStatus(val) {
      this.param.show = val
      this.fetchTableData()
    },
    // 
    changeClient(val) {
      if (this.ruleForm.client.indexOf('1') !== -1 && this.ruleForm.client.indexOf('2') !== -1 && this.ruleForm.client.indexOf('3') !== -1) {
        this.imagesList.map(item => item.show = true)
      } else if (this.ruleForm.client.indexOf('1') !== -1 && this.ruleForm.client.indexOf('2') !== -1) {
        this.imagesList.map(item => item.show = false)
        this.imagesList[0].show = true
        this.imagesList[1].show = true
      } else if (this.ruleForm.client.indexOf('1') !== -1 && this.ruleForm.client.indexOf('3') !== -1) {
        this.imagesList.map(item => item.show = false)
        this.imagesList[0].show = true
        this.imagesList[2].show = true
        this.imagesList[3].show = true
      } else if (this.ruleForm.client.indexOf('2') !== -1 && this.ruleForm.client.indexOf('3') !== -1) {
        this.imagesList.map(item => item.show = false)
        this.imagesList[1].show = true
        this.imagesList[2].show = true
        this.imagesList[3].show = true
      } else if (this.ruleForm.client.indexOf('1') !== -1) {
        this.imagesList.map(item => item.show = false)
        this.imagesList[0].show = true
      } else if (this.ruleForm.client.indexOf('2') !== -1) {
        this.imagesList.map(item => item.show = false)
        this.imagesList[1].show = true
      } else if (this.ruleForm.client.indexOf('3') !== -1) {
        this.imagesList.map(item => item.show = false)
        this.imagesList[2].show = true
        this.imagesList[3].show = true
      } else {
        this.imagesList.map(item => item.show = false)
      }
    }
  }
}
</script>

<style lang="less">
.demo-ruleForm {
  padding-right: 35px;
  .line {
    padding: 0 5px;
  }
  .link-right {
    width: 240px;
    float: right;
    span {
      font-weight: 600;
      color: #333;
    }
  }
  .images {
    margin-bottom: 0;
    .el-form-item__content {
      overflow: hidden;
      margin-left: 0 !important;
      padding-left: 27px;
      .public-uploader {
        margin: 0;
        &:nth-child(2n) {
          padding-left: 20px;
        }
      }
    }
  }
}
</style>


