<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createAdmin">新建</el-button>
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
        </el-dropdown> -->
      </div>
    </div>
    <!-- 表格  -->
    <el-table class="public-table" :data="list" border v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column :prop="item.name" v-if="item.value" :key='item.name' v-for='item in dynamicTable' :label="item.label" :width="item.width" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span><span v-if="scope.row[item.name]==0">-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页  -->
    <el-pagination background @size-change="handleSize" @current-change="handlePage" :current-page="page" :page-sizes="sizeList" :page-size="size" :total="total" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :visible.sync="isEdit" :close-on-click-modal="false" class="admin-edit" width="400px" center>
      <el-form label-position="top">
        <el-form-item label="修改密码">
          <el-input v-model="newPassword" :disabled="inputPassword"></el-input>
        </el-form-item>
        <el-form-item label="分配权限组">
          <el-select v-model="selectGroup" placeholder="请选择权限组" style="width: 100%">
            <el-option v-for="item in permitGroup" :key="item.groupid" :label="item.name" :value="item.groupid"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEdit = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'md5'
import Cookies from 'js-cookie'
import { fetchData } from '@/api'
import SearchMixin from '@/mixins/search'
import { adminAction } from '@/utils/tdexMap'
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: '', // 搜索时间周期
      requestUrl: 'adminList',
      dynamicTable: [
        { name: 'id', value: true, label: '编号' },
        { name: 'name', value: true, label: '管理员账号' },
        { name: 'group', value: true, label: '所属权限组' },
        { name: 'ip', value: true, label: '登录地址' },
        { name: 'time', value: true, label: '创建时间' }
      ],
      filterSummaries: [],  // 需要统计的字段
      permitGroup: [],  // 权限组
      isEdit: false,
      newPassword: '',
      selectGroup: '',
      baseGroup: '',
      currentId: '',
      username: Cookies.get('username'),
      inputPassword: false
    }
  },
  methods: {
    // 设置表格数据
    async setTableData(data) {
      if (!this.permitGroup.length) {
        const group = await fetchData('adminPermitGroup')
        this.permitGroup = group
      }
      const list = []
      data.forEach(function(element) {
        const currentGroup = this.permitGroup.find(item => item.groupid === element.permit_groupid)
        list.push({
          id: element.uid,
          name: element.username,
          group: currentGroup ? currentGroup.name : '未分配',
          ip: element.last_login_ip,
          time: element.crtime,
          detail: element
        })
      }, this)
      this.list = list
    },
    // 创建管理员
    createAdmin() {
      this.$prompt('请输入创建账号', '创建管理员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value) {
          fetchData('adminCreate', {
            username: value
          }).then(data => {
            if (data) {
              this.fetchTableData()
              this.$Notification.success({
                title: `账户：${data.username}`,
                message: `密码：${data.password}`,
                duration: 0
              })
            }
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 编辑
    handleEdit(index, row) {
      if (row.name === this.username) {
        this.inputPassword = true
      } else {
        this.inputPassword = false
      }
      this.baseGroup = row.detail.permit_groupid
      this.selectGroup = row.detail.permit_groupid
      this.currentId = row.detail.uid
      this.isEdit = true
    },
    // 提交编辑
    submitEdit() {
      // 修改密码
      if (this.newPassword) {
        fetchData('adminPassword', {
          id: this.currentId,
          old_psw: 'no',
          new_psw: md5(this.newPassword)
        }).then(data => {
          if (data) this.$Notification.success('密码更改成功')
        })
      }
      // 修改权限组
      if (this.selectGroup !== this.baseGroup) {
        fetchData('adminSetGroup', {
          uid: this.currentId,
          groupid: this.selectGroup
        }).then(data => {
          if (data) this.$Notification.success('权限组更改成功')
          this.fetchTableData()
        })
      }
      this.isEdit = false
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm('确定删除该管理员账号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetchData('adminRemove', { id: row.id }).then(data => {
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

