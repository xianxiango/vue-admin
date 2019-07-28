<template>
  <div class="public-view">
    <div class="view-header">
      <div class="header-left">
        <!-- 选择周期  -->
        <el-radio-group v-model="period" @change="changePeriod">
          <el-radio-button label="day">日活跃</el-radio-button>
          <el-radio-button label="week">周活跃</el-radio-button>
          <el-radio-button label="month">月活跃</el-radio-button>
        </el-radio-group>
      </div>
      <div class="header-right">
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
import { fetchData } from '@/api'
import { uidCode } from '@/utils/uidCode'
import { userType } from '@/utils/tdexMap'
export default {
  data() {
    return {
      list: [],
      page: 1,
      size: 10,
      total: 0,
      period: 'month',
      loading: false,
      sizeList: [10, 20, 30, 40],
      dynamicTable: [
        { name: 'uidCode', value: true, label: 'UID' },
        { name: 'type', value: true, label: '用户类型' },
        { name: 'phone', value: true, label: '用户手机' },
        { name: 'email', value: true, label: '用户邮箱' },
        { name: 'cTime', value: true, label: '注册时间' },
        { name: 'ip', value: true, label: '注册IP' },
        { name: 'lTime', value: true, label: '最后登录时间' }
      ]
    }
  },
  methods: {
    // 获取活跃用户
    fetchActiveUser(period) {
      fetchData('countsUser', {
        type: period,
        page_no: this.page,
        page_size: this.size
      }).then(data => {
        if (data) {
          this.total = data.total
          this.setActiveData(data.list)
        }
      })
    },
    // 设置活跃数据
    setActiveData(data) {
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
    },
    // 改变大小
    handleSize(val) {
      this.page = 1
      this.size = val
      this.fetchActiveUser(this.period)
    },
    // 改变分页
    handlePage(val) {
      this.page = val
      this.fetchActiveUser(this.period)
    },
    // 改成周期
    changePeriod(period) {
      this.page = 1
      this.fetchActiveUser(period)
    }
  },
  created() {
    this.fetchActiveUser(this.period)
  }
}
</script>

