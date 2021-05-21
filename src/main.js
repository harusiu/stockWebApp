import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import "./includes/firebase";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { DatePicker } from 'ant-design-vue';

Vue.config.productionTip = false;

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'ant-design-vue/dist/antd.css'; // or 'ant-design-vue/dist/antd.less
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(DatePicker);


new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
