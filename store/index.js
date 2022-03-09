/*
 * @Description: 
 * @Author: lz
 * @Date: 2022-03-09 10:56:16
 * @LastEditTime: 2022-03-09 10:58:57
 * @LastEditors: lz
 */
import user from '@/store/modules/user.js'

// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	modules: {
		user
	},
	strict: true
})
// #endif

// #ifdef VUE3
import {createStore} from 'vuex'
const store = createStore({
	modules: {
		user
	}
})
// #endif

export default store