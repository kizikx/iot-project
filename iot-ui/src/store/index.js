import Vue from 'vue';
import Vuex from 'vuex';

import navigator from './navigator.module';
import splitter from './splitter.module';
import tabbar from './tabbar.module';
import alert from './alert.module';
import users from './users.module';
import esps from './esps.module';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    navigator,
    splitter,
    tabbar,
    alert,
    users,
    esps,
  },
});
