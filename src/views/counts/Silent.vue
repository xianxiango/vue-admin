<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-button type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
        <el-dropdown>
          <el-button type="primary">
            筛选
            <i class="el-icon-menu el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in dynamicTable" :key="item.name">
              <el-checkbox v-model="item.value">{{item.label}}</el-checkbox>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 表格  -->
    <el-table class="public-table" :data="list" border v-loading="loading">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="uid" label="UID" width="100"></el-table-column>
      <el-table-column v-if="item.value" :key='item.name' v-for='item in dynamicTable' :label="item.label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span><span v-if="scope.row[item.name]==0">-</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页  -->
    <el-pagination background @size-change="handleSize" @current-change="handlePage" :current-page="page" :page-sizes="sizeList" :page-size="size" :total="total" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import SearchMixin from '@/mixins/search'
import { uidCode } from '@/utils/uidCode'
import { userType } from '@/utils/tdexMap'
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      param: {
        type: 'slient'
      },
      period: '', // 搜索时间周期
      isCodeUid: true,  // 用户uid需要编码
      requestUrl: 'countsSilent',
      dynamicTable: [
        {name: 'uidCode', value: true, label: 'UID'},
        {name: 'type', value: true, label: '用户类型'},
        {name: 'phone', value: true, label: '用户手机'},
        {name: 'email', value: true, label: '用户邮箱'},
        {name: 'cTime', value: true, label: '注册时间'},
        {name: 'ip', value: true, label: '注册IP'},
        {name: 'lTime', value: true, label: '最后登录时间'}
      ]
    }
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = []
      data.forEach(function(element) {
        list.push({
          uid: element.Uid,
          uidCode: uidCode(element.Uid),
          type: userType[element.Type],
          phone: element.Mobile.substring(6),
          email: element.Email,
          cTime: element.CreateTime.replace('T', ' ').substring(0, 19),
          ip: element.CreateIP,
          lTime: element.LastLoginTime.replace('T', ' ').substring(0, 19),
          detail: element
        })
      }, this)
      this.list = list
    }
  }
}
</script>

