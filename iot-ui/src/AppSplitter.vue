<template>
  <v-ons-page id="app-splitter">
    <v-ons-splitter>
      <v-ons-splitter-side
        swipeable
        side="left"
        collapse=""
        width="80%" :animation="md ? 'overlay' : 'reveal'"
        :swipe-target-width="md && 25"
        :open.sync="isOpen"
      >
        <Menu></Menu>
      </v-ons-splitter-side>

      <v-ons-splitter-content>
        <App-Tabbar></App-Tabbar>
      </v-ons-splitter-content>
    </v-ons-splitter>
  </v-ons-page>
</template>

<script>
import AppTabbar from './AppTabbar.vue';
import Menu from './components/Menu.vue';

export default {
  data() {
    return {
      page: 0,
    };
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.splitter.open;
      },
      set(newValue) {
        this.$store.commit('splitter/toggle', newValue);
      },
    },
  },
  components: {
    AppTabbar,
    Menu,
  },
};
</script>

<style scoped>
ons-splitter-side[animation=overlay] {
  border-left: 1px solid #bbb;
}
</style>
