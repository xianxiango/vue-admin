<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createNewNotice">新建</el-button>
      </div>
    </div>
    <!-- 表格  -->
    <el-table class="public-table" :data="list" border v-loading="loading" show-summary @selection-change="handleSelectionChange" :summary-method="getSummaries">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column :prop="item.name" v-if="item.value" :key="item.name" v-for="item in dynamicTable" :label="item.label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="item.name === 'state'">
            <el-tag v-if="scope.row.detail.Invalid" type="danger">已停用</el-tag>
            <el-tag v-else type="success">已启用</el-tag>
          </span>
          <span v-else>
            <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span><span v-if="scope.row[item.name]==0">-</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.detail.Invalid" size="mini" type="primary" @click="handleEnable(scope.$index, scope.row)">启用</el-button>
          <el-button v-else size="mini" type="danger" @click="handleUnEnable(scope.$index, scope.row)">停用</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页  -->
    <el-pagination background @size-change="handleSize" @current-change="handlePage" :current-page="page" :page-sizes="sizeList" :page-size="size" :total="total" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 编辑 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="editVisible" center @close="closeEdit">
      <el-form :model="editNotice" label-width="80px" class="edit-form" ref="ruleForm">
        <el-form-item label="标题">
          <el-input v-model="editNotice.title"></el-input>
        </el-form-item>
        <el-form-item label="语言">
          <el-select v-model="editNotice.lang" placeholder="请选择公告语言">
            <el-option label="中文" value="zh-cn"></el-option>
            <el-option label="英文" value="en-us"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker value-format="timestamp" v-model="editNotice.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :start-placeholder="defaultStart" :end-placeholder="defaultEnd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="editNotice.invalid"></el-switch>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="editNotice.type">
            <el-radio :label="1">普通</el-radio>
            <el-radio :label="2">弹框</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容" v-if="editNotice.type === 2">
          <el-input autosize type="textarea" v-model="editNotice.content2"></el-input>
        </el-form-item>
      </el-form>
      <tinymce v-if="editNotice.type === 1" :height="200" v-model="editNotice.content1"></tinymce>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="issueNotice">发 布</el-button>
      </span>
    </el-dialog>
    <!-- 新建  -->
    <el-dialog :close-on-click-modal="false" :visible.sync="createVisible" center @close="closeCreate">
      <el-form :model="createNotice" label-width="80px" class="edit-form" ref="ruleForm">
        <el-form-item label="标题">
          <el-input v-model="createNotice.title"></el-input>
        </el-form-item>
        <el-form-item label="语言">
          <el-select v-model="createNotice.lang" placeholder="请选择公告语言">
            <el-option label="中文" value="zh-cn"></el-option>
            <el-option label="英文" value="en-us"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker value-format="timestamp" v-model="createNotice.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :start-placeholder="defaultStart" :end-placeholder="defaultEnd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="url1">
          <el-input v-model="createNotice.url1"></el-input>
        </el-form-item>
        <el-form-item label="url2">
          <el-input v-model="createNotice.url2"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="createNotice.type">
            <el-radio :label="1">普通</el-radio>
            <el-radio :label="2">弹框</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容" v-if="createNotice.type === 2">
          <el-input autosize type="textarea" v-model="createNotice.content2"></el-input>
        </el-form-item>
      </el-form>
      <tinymce v-if="createNotice.type === 1" :height="200" v-model="createNotice.content1"></tinymce>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCreate">取 消</el-button>
        <el-button type="primary" @click="createIssueNotice">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Moment from 'moment'
import { fetchData } from '@/api'
import SearchMixin from '@/mixins/search'
import { uidCode } from '@/utils/uidCode'
import { noticeType } from '@/utils/tdexMap'
import Tinymce from '@/components/Tinymce'
export default {
  mixins: [SearchMixin],
  components: {
    Tinymce
  },
  data() {
    return {
      list: [],
      period: '', // 搜索时间周期
      requestUrl: 'noticeList',
      defaultEnd: '',  // 
      defaultStart: '',
      dynamicTable: [
        { name: 'type', value: true, label: '类型' },
        { name: 'state', value: true, label: '状态' },
        { name: 'title', value: true, label: '标题' },
        { name: 'lang', value: true, label: '语言' },
        { name: 'content', value: true, label: '内容' },
        { name: 'beginTime', value: true, label: '开始时间' },
        { name: 'endTime', value: true, label: '结束时间' },
        { name: 'createTime', value: true, label: '创建时间' }
      ],
      filterSummaries: [],  // 需要统计的字段
      editVisible: false,
      editNotice: {
        title: '',
        lang: '',
        date: '',
        invalid: false,
        type: 1,
        content1: '',
        content2: ''
      },
      noticeId: null,
      createVisible: false,
      createNotice: {
        title: '',
        lang: '',
        date: '',
        type: 1,
        content1: '',
        content2: '',
        url1:'',
        url2:'',
      }
    }
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = []
      data.forEach(function(element) {
        list.push({
          type: noticeType[element.Type],
          state: element.Invalid ? '已停用' : '已启用',
          title: element.Title,
          lang: element.Lang,
          content: element.Content,
          beginTime: element.BeginTime.replace('T', ' ').substring(0, 19),
          endTime: element.EndTime.replace('T', ' ').substring(0, 19),
          createTime: element.CreateTime.replace('T', ' ').substring(0, 19),
          detail: element
        })
      }, this)
      this.list = list
    },
    // 编辑表格
    handleEdit(index, row) {
      this.editNotice.title = row.title
      this.editNotice.lang = row.lang
      this.editNotice.type = row.detail.Type
      this.editNotice.invalid = !row.detail.Invalid
      this.editNotice.content1 = row.detail.Type === 1 ? row.content : row.content
      this.editNotice.content2 = row.detail.Type === 1 ? row.content.replace(/<[^>]*>|<\/[^>]*>/gm, '') : row.content
      this.noticeId = row.detail.Id
      this.defaultTime([row.beginTime, row.endTime])
      this.editVisible = true
    },
    // 默认时间
    defaultTime(time) {
      if (time) {
        this.defaultStart = time[0].substring(0, 10)
        this.defaultEnd = time[1].substring(0, 10)
      } else {
        const start = new Date()
        const end = new Date()
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 1)
        const s = Moment(start.getTime()).format('YYYY-MM-DD')
        const e = Moment(end).format('YYYY-MM-DD')
        this.defaultStart = s
        this.defaultEnd = e
      }
    },
    // 发布编辑公告
    issueNotice() {
      fetchData('noticeEdit', {
        id: this.noticeId,
        type: this.editNotice.type,
        land: this.editNotice.lang,
        title: this.editNotice.title,
        content: this.editNotice.type === 1 ? this.editNotice.content1 : this.editNotice.content2,
        begin_time: this.editNotice.date ? parseInt(this.editNotice.date[0] / 1000) : parseInt(new Date(this.defaultStart).getTime() / 1000),
        end_time: this.editNotice.date ? parseInt(this.editNotice.date[1] / 1000) : parseInt(new Date(this.defaultEnd).getTime() / 1000),
        invalid: this.editNotice.invalid ? 0 : 1
      }).then(data => {
        if (data) {
          this.closeEdit()
          this.fetchTableData()
          this.$Notification.success('发布成功')
        }
      })
    },
    // 关闭编辑
    closeEdit() {
      this.editVisible = false
    },
    // 新建公告
    createNewNotice() {
      this.defaultTime()
      this.createVisible = true
    },
    // 关闭新建
    closeCreate() {
      this.createVisible = false
    },
    // 提交新建
    createIssueNotice() {
      if (!this.createNotice.title) {
        this.$message.info('请输入标题')
        return false
      }
      if (!this.createNotice.lang) {
        this.$message.info('请选择语言')
        return false
      }
      if (!this.createNotice.type) {
        this.$message.info('请选择类型')
        return false
      }
      fetchData('noticeAdd', {
        url1:this.createNotice.url1,
        url2:this.createNotice.url2,
        type: this.createNotice.type,
        land: this.createNotice.lang,
        title: this.createNotice.title,
        content: this.createNotice.type === 1 ? this.createNotice.content1 : this.createNotice.content2,
        begin_time: this.createNotice.date ? parseInt(this.createNotice.date[0] / 1000) : parseInt(new Date(this.defaultStart).getTime() / 1000),
        end_time: this.createNotice.date ? parseInt(this.createNotice.date[1] / 1000) : parseInt(new Date(this.defaultEnd).getTime() / 1000),
      }).then(data => {
        if (data) {
          this.closeEdit()
          this.fetchTableData()
          this.$Notification.success('发布成功')
          this.createVisible = false
          this.createNotice.type = 1
          this.createNotice.lang = ''
          this.createNotice.title = ''
          this.createNotice.date = ''
          this.createNotice.content1 = ''
          this.createNotice.content2 = ''
        }
      })
    },
    // 启用
    handleEnable(index, row) {
      fetchData('noticeEdit', {
        id: row.detail.Id,
        invalid: 0
      }).then(data => {
        if (data) {
          this.fetchTableData()
          this.$Notification.success('操作成功')
        }
      })
    },
    // 停用
    handleUnEnable(index, row) {
      fetchData('noticeEdit', {
        id: row.detail.Id,
        invalid: 1
      }).then(data => {
        if (data) {
          this.fetchTableData()
          this.$Notification.success('操作成功')
        }
      })
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm('确定删除该公告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetchData('noticeDel', { id: row.detail.Id }).then(data => {
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

<style lang="less" scoped>
.edit-form {
  padding-right: 40px;
}
</style>


