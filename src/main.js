import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import "./includes/firebase";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import 'v2-datepicker/lib/index.css';   // v2 need to improt css
import V2Datepicker from 'v2-datepicker';

Vue.config.productionTip = false;

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(V2Datepicker)

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
