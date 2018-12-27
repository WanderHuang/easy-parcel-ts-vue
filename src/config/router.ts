import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/route1',
      // @ts-ignore
      component: () => import('@/components/route1.vue')
    },
    {
      path: '/route2',
      // @ts-ignore
      component: () => import('@/components/route2.vue')
    }
  ]
});