import usersService from '@/services/users.service';
import router from '@/router';

const tokenData = localStorage.getItem('token');

export default {
  strict: true,
  namespaced: true,
  state: tokenData ? { status: { loggedIn: true }, token: tokenData, users: [] }
    : { status: {}, token: null, users: [] },
  getters: {},
  mutations: {
    loginRequest(state) {
      state.status = {
        loggingIn: true,
      };
    },
    loginSuccess(state, token) {
      state.status = {
        loggedIn: true,
      };
      localStorage.setItem('token', token);
    },
    loginFailure(state) {
      state.status = {};
    },
    logout(state) {
      state.status = {};
    },
    usersRequest(state) {
      state.status = {
        fetching: true,
      };
    },
    usersSuccess(state, users) {
      state.status = {
        fetched: true,
      };
      state.users = users;
    },
    usersFailure(state) {
      state.status = {};
    },
    addRequest(state) {
      state.status = {
        adding: true,
      };
    },
    addSuccess(state) {
      state.status = {
        added: true,
      };
    },
    addFailure(state) {
      state.status = {};
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
    deleteRequest(state) {
      state.status = {
        deleting: true,
      };
    },
    deleteSuccess(state) {
      state.status = {
        deleted: true,
      };
    },
    deleteFailure(state) {
      state.status = {};
    },
  },
  actions: {
    login({ dispatch, commit }, { username, password }) {
      commit('loginRequest', { username });

      usersService.login(username, password)
        .then((response) => {
          if (response.status === 200) {
            commit('loginSuccess', response.data.token);
            router.push('/');
          } else {
            commit('loginFailure');
            dispatch('alert/pushToast', {
              message: response.data.message,
            }, { root: true });
          }
        }).catch((error) => {
          commit('loginFailure');
          console.error(error);
        });
    },
    logout({ commit }) {
      usersService.logout();
      commit('tabbar/set', 0, { root: true });
      commit('splitter/toggle', false, { root: true });
      commit('logout');
      router.push('/login');
    },
    getUsers({ dispatch, commit }) {
      commit('usersRequest');

      return new Promise((resolve, reject) => {
        usersService.getUsers()
          .then((response) => {
            setTimeout(() => {
              commit('usersSuccess', response);
              resolve();
            }, 500);
          }, () => {
            commit('usersFailure');
            dispatch('alert/pushToast', {
              message: 'Erreur lors de la récupération des utilisateurs',
            }, { root: true });
            reject();
          });
      });
    },
    addUser({ dispatch, commit }, data) {
      commit('addRequest');

      return usersService.addUser(data)
        .then(() => {
          commit('addSuccess');
        }, () => {
          commit('addFailure');
          dispatch('alert/pushToast', {
            message: 'Erreur lors de la création de l\'utilisateur',
          }, { root: true });
        });
    },
    updateUser({ dispatch, commit }, { username, data }) {
      commit('updateRequest');

      return usersService.updateUser(username, data)
        .then(() => {
          commit('updateSuccess');
        }, () => {
          commit('updateFailure');
          dispatch('alert/pushToast', {
            message: 'Erreur lors de la mise à jour de l\'utilisateur',
          }, { root: true });
        });
    },
    deleteUser({ dispatch, commit }, username) {
      commit('deleteRequest');

      return usersService.deleteUser(username)
        .then(() => {
          commit('deleteSuccess');
        }, () => {
          commit('deleteFailure');
          dispatch('alert/pushToast', {
            message: 'Erreur lors de la suppression de l\'utilisateur',
          }, { root: true });
        });
    },
  },
  modules: {},
};
