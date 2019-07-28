<template>
  <div class="public-view">
    <el-row :gutter="40">
      <el-col :span="6">
        <el-card class="box-card">
          <div class="counts-header counts1">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="chart"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>
                <vue-count :startVal="0" :endVal="rechargeTotal" :duration="3000"></vue-count>
              </h2>
              <p>USDT充值总数</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="counts-header counts2">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="theme"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>{{rechargeRate}}%</h2>
              <p>USDT充值率</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="counts-header counts3">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="peoples"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>
                <vue-count :startVal="0" :endVal="rechargeUsers" :duration="3000"></vue-count>
              </h2>
              <p>USDT充值人数</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="counts-header counts4">
            <div class="counts-header-left">
              <svg-icon class="counts-header-svg" icon-class="example"></svg-icon>
            </div>
            <div class="counts-header-right">
              <h2>{{rechargeCounts}}%</h2>
              <p>USDT充值活跃率</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="box-card recharge-rank">
      <div slot="header" class="clearfix">
        <span>用户USDT充值排名榜</span>
      </div>
      <ul class="rank-list">
        <li><span>排名</span><span>UID</span><span>金额</span></li>
        <li v-for="(item, index) in rechargeRank" :key="index"><span>{{index+1}}</span><span>{{item.Uid}}</span><span>{{item.Amount}}</span></li>
      </ul>
    </el-card>
  </div>
</template>

<script>
import { fetchData } from '@/api'
import VueCount from 'vue-count-to'
export default {
  components: {
    VueCount
  },
  data() {
    return {
      rechargeTotal: 0,
      rechargeRate: 0,
      rechargeUsers: 0,
      rechargeCounts: 0,
      rechargeRank: []
    }
  },
  methods: {
    fetchCountsUsdt() {
      fetchData('countsUsdt').then(data => {
        if (data) {
          this.rechargeTotal = data.recharge_total
          this.rechargeRate = data.user_total ? (data.recharge_users / data.user_total).toFixed(2) : 0
          this.rechargeUsers = data.recharge_users
          this.rechargeCounts = data.active_total ? (data.recharge_users / data.active_total).toFixed(2) : 0
          this.rechargeRank = data.rank
        }
      })
    }
  },
  created() {
    this.fetchCountsUsdt()
  }
}
</script>

<style lang="less" scoped>
.counts-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  &-left {
    flex: 0.4;
  }
  &-right {
    flex: 0.6;
    p {
      color: #C8C8C8;
    }
  }
  &-svg {
    width: 4rem!important;
    height: 4rem!important;
  }
}

.counts1 {
  color: rgb(45, 140, 240);
}

.counts2 {
  color: rgb(100, 213, 114);
}

.counts3 {
  color: rgb(255, 213, 114);
}

.counts4 {
  color: rgb(242, 94, 67);
}

.recharge-rank {
  margin: 30px 0;
  .rank-list {
    li {
      line-height: 36px;
      border-left: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      border-top: 1px solid #ebeef5;
      list-style: none;
      overflow: hidden;
      &:last-child {
        border-bottom: 1px solid #ebeef5;
      }
      span {
        float: left;
        width: 33.33%;
        padding-left: 20px;
        box-sizing: border-box;
      }
    }
  }
}
</style>

