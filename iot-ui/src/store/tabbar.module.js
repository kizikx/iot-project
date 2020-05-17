export default {
  strict: true,
  namespaced: true,
  state: {
    index: 0,
  },
  getters: {},
  mutations: {
    set(state, index) {
      state.index = index;
    },
  },
  actions: {},
  modules: {},
};
