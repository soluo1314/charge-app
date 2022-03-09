/*
 * @Description: 
 * @Author: lz
 * @Date: 2022-03-08 15:28:34
 * @LastEditTime: 2022-03-09 14:48:16
 * @LastEditors: lz
 */
import App from "./App";
import store from "./store";
import i18n from './lang/i18n'
import Request from './common/request.js'
// #ifndef VUE3
import Vue from "vue";
Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$Request = Request;
console.log(store)
App.mpType = "app";
const app = new Vue({
  i18n,
  store,
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  app.use(i18n)
  app.use(store)
  return {
    app,
  };
}
// #endif
