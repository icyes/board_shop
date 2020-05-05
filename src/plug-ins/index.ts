import Vue from "vue";
import "./vant";
import "./better-scroll";
import apis from "@/apis";
Vue.prototype.$apis = apis;

Vue.prototype.$sleep = async function f(time = 100) {
  return new Promise(resolve => {
    var timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, time);
  });
};
