<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="isCreate = true">新建</el-button>
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
    <!-- 创建权限组  -->
    <el-dialog :visible.sync="isCreate" :close-on-click-modal="false" width="400px" center>
      <el-form label-position="top">
        <el-form-item label="权限组名称：">
          <el-input placeholder="请输入名称" v-model="createName" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="权限组描述：">
          <el-input placeholder="请输入描述" v-model="createDesc" clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isCreate = false">取 消</el-button>
        <el-button type="primary" @click="createPermitGroup">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑权限组模块  -->
    <el-dialog :visible.sync="isEdit" :close-on-click-modal="false" width="600px" @close="closeEdit">
      <el-form label-width="120px">
        <el-form-item label="当前权限组：">
          <el-tag type="danger">{{ currentGroupName }}</el-tag>
        </el-form-item>
        <el-form-item label="权限组菜单：">
          <el-tree :data="treeList" show-checkbox ref="tree" node-key="only" accordion @check="checkTree">
            <span slot-scope="{ node, data }">
              <span v-if="data.two && data.one">
                <i class="el-icon-document" style="color: #409eff"></i>{{ data.name }}</span>
              <span v-else-if="data.one">
                <i class="el-icon-document" style="color: #e6a23c"></i>{{ data.name }}</span>
              <span v-else>
                <i class="el-icon-document" style="color: #f56c6c"></i>{{ data.name }}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchData } from '@/api'
import SearchMixin from '@/mixins/search'
import { modulesMap } from '@/utils/tdexMap'
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: '', // 搜索时间周期
      requestUrl: 'allPermitGroup',
      dynamicTable: [
        { name: 'groupid', value: true, label: '权限组编号' },
        { name: 'name', value: true, label: '权限组名称' },
        { name: 'desc', value: true, label: '权限组描述' },
        { name: 'crtime', value: true, label: '创建时间' },
        { name: 'uptime', value: true, label: '更新时间' }
      ],
      filterSummaries: [],  // 需要统计的字段
      isCreate: false,
      createName: '',
      createDesc: '',
      treeList: [],
      isEdit: false,
      oldKeys: [],
      newKeys: [],
      currentGroupId: '',
      currentGroupName: ''
    }
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      this.list = data
    },
    // 获取所有模块
    fetchAllModules() {
      fetchData('allModules').then(data => {
        if (data) this.treeList = this.setTreeStructure(data).list
      })
    },
    // 设置树状结构
    setTreeStructure(data) {
      const list = []
      const onlyList = []  // 唯一字段
      for (let one in data) {
        if (one) {
          const oneChildren = []
          const oneObject = {
            only: 'one' + one,
            name: modulesMap[one],
            label: one
          }
          if (data[one]) {
            for (let two in data[one]) {
              if (two) {
                const twoChildren = []
                const twoObject = {
                  one: one,
                  only: one + two,
                  name: modulesMap[two],
                  label: two
                }
                if (data[one][two] && data[one][two].length) {
                  data[one][two].forEach(function(element) {
                    if (element.Action && element.Name) {
                      twoChildren.push({
                        one: one,
                        two: two,
                        only: two + '#' + element.Action,
                        name: element.Name,
                        label: element.Action
                      })
                      onlyList.push(two + '#' + element.Action)
                    }
                  }, this)
                }
                twoObject.children = twoChildren
                oneChildren.push(twoObject)
              }
            }
            oneObject.children = oneChildren
          }
          list.push(oneObject)
        }
      }
      return {
        list: list,
        only: onlyList
      }
    },
    // 创建权限组
    createPermitGroup() {
      if (!this.createName) {
        this.$message('请输入权限组名称')
        return false
      }
      fetchData('newPermitGroup', {
        name: this.createName,
        desc: this.createDesc
      }).then(data => {
        if (data) {
          this.isCreate = false
          this.createName = ''
          this.createDesc = ''
          this.list.push(data)
          this.$Notification.success('操作成功')
        }
      })
    },
    // 编辑
    handleEdit(index, row) {
      this.isEdit = true
      fetchData('currentPermitModules', {
        groupid: row.groupid
      }).then(data => {
        if (data) {
          this.currentGroupId = row.groupid
          this.currentGroupName = row.name
          this.oldKeys = this.setTreeStructure(data).only
          this.$refs.tree.setCheckedKeys(this.oldKeys)
        }
      })
    },
    // 选中节点
    checkTree(data, check) {
      this.newKeys = check.checkedKeys
    },
    // 关闭编辑
    closeEdit() {
      this.newKeys = []
      this.oldKeys = []
      this.isEdit = false
      this.currentGroupId = ''
      this.currentGroupName = ''
    },
    // 提交编辑
    submitEdit() {
      if (!this.newKeys.length) {
        this.isEdit = false
        return failNum
      }
      let add = 0
      let remove = 0
      const modulesData = {}
      // 添加
      this.newKeys.forEach(item => {
        if (item.indexOf('#') !== -1 && !this.oldKeys.find(val => val === item)) {
          add++
          const data = item.split('#')
          if (modulesData[data[0]]) {
            modulesData[data[0]].push(data[1])
          } else {
            modulesData[data[0]] = [data[1]]
          }
          // 找出同级的
          this.oldKeys.forEach(child => {
            if (child.indexOf(data[0] + '#') !== -1 && child !== item) {
              const children = child.split('#')
              if (modulesData[children[0]]) {
                modulesData[children[0]].push(children[1])
              } else {
                modulesData[children[0]] = [children[1]]
              }
            }
          })
        }
      })
      // 移除
      this.oldKeys.forEach(item => {
        if (item.indexOf('#') !== -1 && !this.newKeys.find(val => val === item)) {
          remove++
          const data = item.split('#')
          // 找出同级的
          this.oldKeys.forEach(child => {
            if (child.indexOf(data[0] + '#') !== -1 && child !== item) {
              const children = child.split('#')
              // 当前是否选中
              if (this.newKeys.find(val => val === child)) {
                if (modulesData[children[0]]) {
                  modulesData[children[0]].push(children[1])
                } else {
                  modulesData[children[0]] = [children[1]]
                }
              } else {
                modulesData[children[0]] = []
              }
            }
          })
        }
      })
      // console.log(modulesData)
      // 提交
      for (let key in modulesData) {
        if (modulesData[key]) {
          fetchData('addPermitModule', {
            groupid: this.currentGroupId,
            module: key,
            actions: modulesData[key].length ? modulesData[key].join(',') : ''
          })
        }
      }
      this.isEdit = false
      this.$Notification.success({
        title: '操作成功',
        message: `添加${add}模块，移除${remove}模块`
      })
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm('确定删除该权限组吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetchData('removePermitGroup', { groupid: row.groupid }).then(data => {
          if (data) {
            this.list.splice(index, 1)
            this.$Notification.success('操作成功')
          }
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  created() {
    this.fetchAllModules()
  }
}
</script>

