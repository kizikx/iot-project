import Vue from 'vue';
import Vuex from 'vuex';

import navigator from '@/store/navigator.module';
import splitter from '@/store/splitter.module';
import tabbar from '@/store/tabbar.module';
import alert from '@/store/alert.module';
import users from '@/store/users.module';
import esps from '@/store/esps.module';
import data from '@/store/data.module';

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
    data,
  },
});
