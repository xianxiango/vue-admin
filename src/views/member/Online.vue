<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-button type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
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
    <el-table class="public-table" :data="list" border v-loading="loading"
      show-summary @selection-change="handleSelectionChange" :summary-method="getSummaries">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column prop="uid" label="UID" width="100">
        <template slot-scope="scope">
          <router-link target="_blank" :to="{ name: 'memberDetail', query: { uid: scope.row.uid } }" class="jump-detail">
            {{scope.row.uid}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :prop="item.name" v-if="item.value" :key='item.name' v-for='item in dynamicTable' :label="item.label" :show-overflow-tooltip="true">
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
import Moment from 'moment'
import SearchMixin from '@/mixins/search'
import { uidCode } from '@/utils/uidCode'
import { userType } from '@/utils/tdexMap'
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      period: '', // 搜索时间周期
      isCodeUid: true,  // 用户uid需要编码
      requestUrl: 'userOnline',
      searchUrl: 'userOnlineSearch',
      dynamicTable: [
        // {name: 'uidCode', value: true, label: 'UID'},
        {name: 'type', value: true, label: '类型'},
        {name: 'ip', value: true, label: 'IP'},
        {name: 'browser', value: true, label: '浏览器'},
        {name: 'system', value: true, label: '操作系统'},
        {name: 'updateTime', value: true, label: '更新时间'}
      ],
      filterSummaries: []  // 需要统计的字段
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
          ip: element.IP,
          browser: element.Browser,
          system: element.System,
          updateTime: Moment(element.UpdateTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
          detail: element
        })
      }, this)
      this.list = list
    }
  }
}
</script>

