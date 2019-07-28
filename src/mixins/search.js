import { fetchData } from '@/api'
import { uidCode } from '@/utils/uidCode'
import { currencyNumber, userType } from '@/utils/tdexMap'
import { string62to10 } from "@/utils/uidCode";

export default {
  computed: {
    labelList: {
      get() {
        return this.$store.state.labelList
      },
      set(list) {
        this.$store.commit('UPDATE_LABEL_LIST', list)
      }
    },
    watchlabel: function () {
      return JSON.stringify(this.labelList)
    }
  },
  watch: {
    watchlabel(newVal, oldVal) {
      const newV = JSON.parse(newVal)
      const oldV = JSON.parse(oldVal)
      if (!newV.length && oldV.length && this.isSearch) {
        this.page = 1
        this.size = 10
        this.fetchTableData()
      }
    }
  },
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      isSearch: false,
      inputText: '',
      sizeList: [10, 20, 30, 40, 100, 1000, 10000],
      multipleSelection: [],
      downloadLoading: false,

    }
  },
  methods: {},

  created() {

  },



  directives: {// 初始化指令
    clickOutside: {
      bind(el, binding, vnode) {
        function clickHandler(e) {
          // 这里判断点击的元素是否是本身，是本身，则返回
          if (el.contains(e.target)) {
            return false;
          }
          // 判断指令中是否绑定了函数
          if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法

            binding.value(e);
          }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = clickHandler;
        document.addEventListener('click', clickHandler);
      },
      update() { },
      unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
      },
    },
  }
}
