import Vue from 'vue';

// @ts-ignore
import app from '@/App.vue';
import router from '@/config/router';
import store from '@/config/store';

new Vue({
  router,
  store,
  render: (h) => h(app)
}).$mount('#app');
