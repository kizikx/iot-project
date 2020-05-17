<template>
  <v-ons-page id="app-tabbar">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-toolbar-button @click="$store.commit('splitter/toggle')">
          <v-ons-icon icon="ion-ios-menu, material:md-menu"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
      <div class="center">{{ }}</div>
    </v-ons-toolbar>

    <v-ons-tabbar position="auto"
      :tabs="tabs"
      :index.sync="index"
      :visible="false">
    </v-ons-tabbar>
  </v-ons-page>
</template>

<script>
import Dashboard from './views/Dashboard.vue';
import Data from './views/Data.vue';
import Devices from './views/Devices.vue';
import Users from './views/Users.vue';

export default {
  data() {
    return {
      tabs: [
        {
          page: Dashboard,
        },
        {
          page: Data,
        },
        {
          page: Devices,
        },
        {
          page: Users,
        },
      ],
    };
  },
  computed: {
    index: {
      get() {
        return this.$store.state.tabbar.index;
      },
      set(newValue) {
        this.$store.commit('tabbar/set', newValue);
      },
    },
  },
};
</script>

<style scoped>
</style>
