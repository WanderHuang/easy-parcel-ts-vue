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
    },
    {
      path: '/rx',
      // @ts-ignore
      component: () => import('@/components/rx.vue')
    },
    {
      path: '/calendarCss',
      // @ts-ignore
      component: () => import('@/components/calendarCss.vue')
    },
    {
      path: '/worker',
      // @ts-ignore
      component: () => import('@/components/worker.vue')
    },
    {
      path: '/tfjs',
      // @ts-ignore
      component: () => import('@/components/tfjs.vue')
    },
    {
      path: '/calendar',
      // @ts-ignore
      component: () => import('@/components/calendar.vue')
    },
    {
      path: '/tetris',
      // @ts-ignore
      component: () => import('@/components/tetris.vue')
    }
  ]
});
