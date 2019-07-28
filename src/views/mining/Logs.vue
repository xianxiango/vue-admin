<template>
  <div class="public-view">
    <!-- 头部  -->
    <div class="view-header">
      <div class="header-left">
        <el-date-picker value-format="timestamp" @change="changePeriod" v-model="logsPeriod" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <!-- 表格  -->
    <el-table class="public-table" :data="list" border v-loading="loading">
      <el-table-column align="center" :prop="item.name" v-if="item.value" :key='item.name' v-for='item in dynamicTable' :label="item.label" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row[item.name]!=0">{{scope.row[item.name]}}</span><span v-if="scope.row[item.name]==0">-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
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
export default {
  mixins: [SearchMixin],
  data() {
    return {
      list: [],
      param: { // 请求附带参数
        starttime: parseInt(Date.now() / 1000) - (86400 * 7),
        endtime: parseInt(Date.now() / 1000)
      },
      logsPeriod: '',
      requestUrl: 'mineList',
      dynamicTable: [
        { name: 'minePeriod', value: true, label: '挖矿周期' },
        { name: 'mineNumber', value: true, label: '挖矿产出' },
        { name: 'minePeople', value: true, label: '参与人数' },
        { name: 'mineState', value: true, label: '状态' },
        { name: 'distribute', value: true, label: '分发时间' }
      ],
      filterSummaries: []  // 需要统计的字段
    }
  },
  methods: {
    // 设置表格数据
    setTableData(data) {
      const list = []
      data.forEach(function(element) {
        const createTime = new Date(element.crtime).getTime()
        const distribute = createTime + element.max_period * 5 * 60000
        list.push({
          minePeriod: element.crtime,
          mineNumber: parseInt(element.volumn),
          minePeople: element.pep_num,
          mineState: '',
          distribute: Moment(distribute).format('YYYY-MM-DD HH:mm:ss'),
          detail: element
        })
      }, this)
      this.list = list
    },
    // 改变周期
    changePeriod(val) {
      if (val === null) {
        this.param = {
          starttime: parseInt(Date.now() / 1000) - 86400 * 7,
          endtime: parseInt(Date.now() / 1000)
        }
      } else {
        this.param = {
          starttime: parseInt(val[0] / 1000),
          endtime: parseInt(val[1] / 1000)
        }
      }
      this.fetchTableData()
    },
    // 查看详情
    handleDetail(index, row) {
      this.$router.push({ name: 'mineDetail', query: { uid: row.detail.period } })
    }
  }
}
</script>

