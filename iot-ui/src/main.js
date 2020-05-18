// Webpack CSS import
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

import Vue from 'vue';
import VueOnsen from 'vue-onsenui';
import axios from 'axios';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import CustomToolbar from '@/components/CustomToolbar.vue';

Vue.config.productionTip = false;

Vue.use(VueOnsen);

Vue.component('custom-toolbar', CustomToolbar);

axios.defaults.baseURL = 'http://62.210.139.84:3000';
axios.defaults.withCredentials = true;

axios.interceptors.response.use((response) => response, (error) => {
  /* If the session has expired, we redirect the user
  to the login page */
  if (error.response.status === 401) {
    localStorage.setItem('token', '');
    router.push('/login');
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
  beforeCreate() {
    // Shortcut for Material Design
    Vue.prototype.md = this.$ons.platform.isAndroid();
  },
}).$mount('#app');
