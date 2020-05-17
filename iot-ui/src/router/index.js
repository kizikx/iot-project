import Vue from 'vue';
import VueRouter from 'vue-router';

import AppNavigator from '../AppNavigator.vue';

import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: AppNavigator,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, _from, next) => {
  const publicPages = [
    '/login',
  ];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  if (loggedIn && !authRequired) {
    return next('/');
  }

  return next();
});

export default router;
