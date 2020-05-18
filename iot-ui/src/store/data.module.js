import dataService from '@/services/data.service';

export default {
  strict: true,
  namespaced: true,
  state: {
    status: {},
    data: [],
  },
  getters: {},
  mutations: {
    dataRequest(state) {
      state.status = {
        fetching: true,
      };
    },
    dataSuccess(state, data) {
      state.status = {
        fetched: true,
      };
      state.data = data;
    },
    dataFailure(state) {
      state.status = {};
      state.data = [];
    },
  },
  actions: {
    getDataByTopic({ dispatch, commit }, topic) {
      commit('dataRequest');

      return new Promise((resolve, reject) => {
        dataService.getDataByTopic(topic)
          .then((response) => {
            setTimeout(() => {
              commit('dataSuccess', response);
              resolve(response);
            }, 500);
          }, () => {
            commit('dataFailure');
            dispatch('alert/pushToast', {
              message: `Erreur lors de la récupération des données pour le topic ${topic}`,
            }, { root: true });
            reject();
          });
      });
    },
    getDataByESP({ dispatch, commit }, { id, topic }) {
      commit('dataRequest');

      return new Promise((resolve, reject) => {
        dataService.getDataByESP(id, topic)
          .then((response) => {
            setTimeout(() => {
              commit('dataSuccess', response);
              resolve(response);
            }, 500);
          }, () => {
            commit('dataFailure');
            dispatch('alert/pushToast', {
              message: `Erreur lors de la récupération des données pour le topic ${topic}`,
            }, { root: true });
            reject();
          });
      });
    },
  },
  modules: {},
};
