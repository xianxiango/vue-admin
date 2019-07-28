import Vue from 'vue'
import SvgIcon from './Icons.vue'// svg组件

const data = {
	state: {
		iconsMap: []
	},
	generate(iconsMap) {
		this.state.iconsMap = iconsMap
	}
}
// register globally
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/icons', false, /\.svg$/)
const iconMap = requireAll(req)


data.generate(iconMap) 
