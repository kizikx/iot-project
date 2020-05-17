// https://www.reddit.com/r/vuejs/comments/dfbv35/vuex_toast_notification_queue/f32bwfc/

/*
Use with :

this.$store.dispatch('pushToast', {
  message: 'The message',
})
*/

const TOAST_DURATION = 3000;
const toastTimeout = (callback) => setTimeout(callback, TOAST_DURATION);

export default {
  strict: true,
  namespaced: true,
  state: {
    queue: [],
    active: undefined,
    timeoutId: undefined,
  },
  getters: {
    visible: (state) => !!state.active,
  },
  mutations: {
    enqueue(state, { toast }) {
      state.queue.push(toast);
    },
    dequeue(state, { timeoutId }) {
      const active = state.queue.shift();

      state.active = active;
      state.timeoutId = timeoutId;
    },
    reset(state) {
      const { timeoutId } = state;
      if (timeoutId) clearTimeout(timeoutId);

      state.active = undefined;
      state.timeoutId = undefined;
    },
  },
  actions: {
    pushToast({ state, commit, dispatch }, toast) {
      commit('enqueue', { toast });
      if (!state.active) dispatch('processQueue');
    },
    processQueue({ state, commit, dispatch }) {
      if (!state.queue.length && !state.active) return null;
      if (!state.queue.length && state.active) {
        return toastTimeout(() => commit('reset'));
      }

      const timeoutId = toastTimeout(() => dispatch('processQueue'));

      commit('dequeue', { timeoutId });
      return null;
    },
  },
  modules: {},
};
