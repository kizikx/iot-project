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
  },
  modules: {},
};
