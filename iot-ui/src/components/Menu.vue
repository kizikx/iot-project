<template>
  <v-ons-page id="menu">
    <v-ons-toolbar modifier="transparent"></v-ons-toolbar>

    <v-ons-list>
      <v-ons-list-item
        v-for="(item, index) in links"
        :key="index"
        :modifier="md ? 'nodivider' : ''"
        @click="loadView(index)"
      >
        <div class="left">
          <v-ons-icon
            fixed-width
            class="list-item__icon"
            :icon="item.icon"
          ></v-ons-icon>
        </div>
        <div class="center">
          {{ item.title }}
        </div>
      </v-ons-list-item>
      <div class="disconnect-container w-100 center">
        <v-ons-button
          modifier="cta"
          @click="logout"
        >
          Déconnexion
        </v-ons-button>
      </div>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      links: [
        {
          title: 'Tableau de bord',
          icon: 'ion-ios-options, material:md-view-dashboard',
        },
        {
          title: 'Données',
          icon: 'ion-ios-stats, material:md-trending-up',
        },
        {
          title: 'Appareils',
          icon: 'ion-ios-calculator, material:md-router',
        },
        {
          title: 'Utilisateurs',
          icon: 'ion-ios-people, material:md-accounts',
        },
      ],
    };
  },
  methods: {
    ...mapActions('users', ['logout']),
    loadView(index) {
      this.$store.commit('tabbar/set', index);
      this.$store.commit('splitter/toggle');
    },
  },
};
</script>

<style scoped>
ons-list-item {
  cursor: pointer;
}

.disconnect-container {
  position: fixed;
  bottom: 10px;
}

.center {
  text-align: center;
}

.w-100 {
  width: 100%;
}
</style>
