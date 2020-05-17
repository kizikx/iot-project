import espsService from '@/services/esps.service';

export default {
  strict: true,
  namespaced: true,
  state: {
    status: {},
    esps: [],
  },
  getters: {},
  mutations: {
    espsRequest(state) {
      state.status = {
        fetching: true,
      };
    },
    espsSuccess(state, esps) {
      state.status = {
        fetched: true,
      };
      state.esps = esps;
    },
    espsFailure(state) {
      state.status = {};
      state.esps = [];
    },
    updateRequest(state) {
      state.status = {
        updating: true,
      };
    },
    updateSuccess(state) {
      state.status = {
        updated: true,
      };
    },
    updateFailure(state) {
      state.status = {};
    },
  },
  actions: {
    getESPs({ dispatch, commit }) {
      commit('espsRequest');

      return new Promise((resolve, reject) => {
        espsService.getESPs()
          .then((response) => {
            setTimeout(() => {
              commit('espsSuccess', response);
              resolve();
            }, 500);
          }, () => {
            commit('espsFailure');
            dispatch('alert/pushToast', {
              message: 'Erreur lors de la récupération des ESPs',
            }, { root: true });
            reject();
          });
      });
    },
    updateESP({ dispatch, commit }, { id, data }) {
      commit('updateRequest');

      return espsService.updateESP(id, data)
        .then(() => {
          commit('updateSuccess');
        }, () => {
          commit('updateFailure');
          dispatch('alert/pushToast', {
            message: 'Erreur lors de la mise à jour de l\'ESP',
          }, { root: true });
        });
    },
  },
  modules: {},
};
