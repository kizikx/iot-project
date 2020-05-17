import usersService from '@/services/users.service';
import router from '@/router';

const tokenData = localStorage.getItem('token');

export default {
  strict: true,
  namespaced: true,
  state: tokenData ? { status: { loggedIn: true }, token: tokenData }
    : { status: {}, token: null },
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
  },
  modules: {},
};
