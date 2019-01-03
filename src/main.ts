import Vue from 'vue';
import VueRx from 'vue-rx';

// @ts-ignore
import app from '@/App.vue';
import router from '@/config/router';
import store from '@/config/store';
import 'normalize.css';

// set plugin
Vue.use(VueRx);

new Vue({
  router,
  store,
  render: (h) => h(app)
}).$mount('#app');
