<template>
  <div class="public-view mine-detail">
    <h2>挖矿参数</h2>
    <div class="detail-header" v-if="detail">
      <el-row class="header-list">
        <el-col :span="4">
          <div class="header-item item-left">
            挖矿周期：
          </div>
        </el-col>
        <el-col :span="8">
          <div class="header-item">
            {{detail.crtime}}
          </div>
        </el-col>
        <el-col :span="4">
          <div class="header-item item-left">
            状态：
          </div>
        </el-col>
        <el-col :span="8">
          <div class="header-item">
            --
          </div>
        </el-col>
      </el-row>
      <el-row class="header-list">
        <el-col :span="4">
          <div class="header-item item-left">
            挖矿产出：
          </div>
        </el-col>
        <el-col :span="8">
          <div class="header-item">
            {{detail.volumn}}
          </div>
        </el-col>
        <el-col :span="4">
          <div class="header-item item-left">
            参与人数：
          </div>
        </el-col>
        <el-col :span="8">
          <div class="header-item">
            {{detail.total}}
          </div>
        </el-col>
      </el-row>
      <el-row class="header-list">
        <el-col :span="4">
          <div class="header-item item-left">
            周期平台累计交易手续费：
          </div>
        </el-col>
        <el-col :span="8">
          <div class="header-item">
            {{detail.fees}}
          </div>
        </el-col>
        <el-col :span="4">
          <div class="header-item item-left">
            周期TD现货均价：
          </div>
        </el-col>
        <el-col :span="8">
          <div class="header-item">
            {{detail.tdPrice}}
          </div>
        </el-col>
      </el-row>
      <el-row class="header-list">
        <el-col :span="4">
          <div class="header-item item-left">
            区块生命值：
          </div>
        </el-col>
        <el-col :span="8">
          <div class="header-item">
            {{detail.health}}
          </div>
        </el-col>
        <el-col :span="4">
          <div class="header-item item-left">
            分发时间：
          </div>
        </el-col>
        <el-col :span="8">
          <div class="header-item">
            {{detail.distribute}}
          </div>
        </el-col>
      </el-row>
    </div>
    <h2 style="margin-top: 20px;">分配详情</h2>
    <div class="detail-table">
      <el-table :data="tableData" border>
        <el-table-column prop="uid" label="UID" align="center">
          <template slot-scope="scope">
            <router-link target="_blank":to="{ name: 'memberDetail', query: { uid: scope.row.uid } }" class="jump-detail">
              {{scope.row.uid}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status ? '推荐挖矿' : '交易挖矿'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fees" label="个人交易手续费" align="center">
        </el-table-column>
        <el-table-column prop="total_volumn" label="挖矿收入" align="center">
        </el-table-column>
      </el-table>
      <el-pagination class="detail-page" background @size-change="handleSize" @current-change="handlePage" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Moment from 'moment'
import { fetchData } from '@/api'
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      size: 10,
      total: 0,
      detail: null
    }
  },
  methods: {
    // 切换大小
    handleSize(val) {
      this.size = val
      this.fetchTableData(this.$route.query.uid)
    },
    // 切换分页
    handlePage(val) {
      this.page = val
      this.fetchTableData(this.$route.query.uid)
    },
    // 获取表格数据
    fetchTableData(uid) {
      fetchData('mineDeatil', {
        period: uid,
        page_no: this.page,
        page_size: this.size
      }).then(data => {
        if (data) {
          const createTime = new Date(data.detail.crtime).getTime()
          const distribute = createTime + data.detail.health * 5 * 60000
          this.detail = data.detail
          this.detail.crtime = this.detail.crtime.replace('T', ' ').substring(0, 19)
          this.detail.total = data.total
          this.detail.tdPrice = data.exchange.tdusdt
          this.detail.distribute = Moment(distribute).format('YYYY-MM-DD HH:mm:ss')
          this.tableData = data.list
          this.total = data.total
        }
      })
    }
  },
  created() {
    if (this.$route.query.uid) {
      this.fetchTableData(this.$route.query.uid)
    }
  }
}
</script>


<style lang="less" scoped>
.mine-detail {
  h2 {
    font-size: 18px;
    line-height: 48px;
  }
  .header-list {
    border-left: 1px solid #eee;
    &:first-child {
      border-top: 1px solid #eee;
    }
    .header-item {
      line-height: 36px;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      color: #666;
      padding-left: 10px;
      font-size: 14px;
    }
    .item-left {
      text-align: right;
    }
  }
  .detail-page {
    margin-top: 40px;
  }
}
</style>
