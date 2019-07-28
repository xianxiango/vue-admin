<template>
  <div class="public-view">
    <el-date-picker unlink-panels type="daterange" value-format="timestamp" range-separator="至" :start-placeholder="defaultStart" :end-placeholder="defaultEnd" @change="changeTime" v-model="activeTime">
    </el-date-picker>
    <!-- 图表  -->
    <schart class="vue-chart" canvasId="myCanvas" type="bar" :data="list" :options="options"></schart>
    <h4 class="activated">{{title}} 总数：<span>{{activated}}</span></h4>
  </div>
</template>

<script>
import Moment from 'moment'
import Schart from 'vue-schart'
import { fetchData } from '@/api'
export default {
  components: {
    Schart
  },
  data() {
    return {
      list: [],
      title: '',
      activated: 0,
      activeTime: '',
      defaultEnd: '',  // 
      defaultStart: '',
      options: {
        padding: 50,                   // canvas 内边距
        bgColor: '#FFFFFF',            // 默认背景颜色
        title: '',// 图表标题
        titleColor: '#000000',         // 图表标题颜色
        titlePosition: 'top',      // 图表标题位置: top / bottom
        yEqual: 5,                     // y轴分成5等分
        fillColor: '#1E9FFF',          // 默认填充颜色
        contentColor: '#eeeeee',       // 内容横线颜色
        axisColor: '#666666',          // 坐标轴颜色
      }
    }
  },
  methods: {
    // 改变时间
    changeTime(value) {
      fetchData('countsActive', {
        start_time: parseInt(value[0] / 1000),
        end_time: parseInt(value[1] / 1000)
      }).then(data => {
        if (data && data.list.length) {
          const start = Moment(value[0]).format('YYYY-MM-DD')
          const end = Moment(value[1]).format('YYYY-MM-DD')
          this.options.title = `${start}~${end}活跃统计`
          this.title = `${start}~${end}`
          this.setChartData(data.list)
          this.activated = data.activated
        } else {
          this.$message.info('该周期暂无数据')
        }
      })
    },
    // 设置图表数据
    setChartData(data) {
      const list = []
      data.forEach(function(element) {
        if (data.length > 32) {
          list.push({ name: String(element.D).substring(4), value: element.Count })
        } else {
          list.push({ name: element.D, value: element.Count })
        }
      }, this)
      this.list = list
    },
    // 获取活跃统计
    fetchCountsActive() {
      const start = new Date()
      const end = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      fetchData('countsActive', {
        start_time: parseInt(start / 1000),
        end_time: parseInt(end.getTime() / 1000)
      }).then(data => {
        if (data && data.list.length) {
          const s = Moment(start).format('YYYY-MM-DD')
          const e = Moment(end.getTime()).format('YYYY-MM-DD')
          this.defaultStart = s
          this.defaultEnd = e
          this.options.title = `${s}~${e}活跃统计`
          this.title = `${s}~${e}`
          this.setChartData(data.list)
          this.activated = data.activated
        }
      })
    }
  },
  created() {
    this.fetchCountsActive()
  }
}
</script>

<style lang="less" scoped>
.vue-chart {
  height: 400px;
  width: 100%;
  margin-top: 30px;
}
.activated {
  padding-left: 30px;
  span {
    font-size: 24px;
    color: #f56c6c;
  }
}
</style>

