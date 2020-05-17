<template>
  <div id="app">
    <router-view></router-view>
    <v-ons-toast
      modifier="success"
      :visible.sync="visible">
      {{ visible ? active.message : '' }}
    </v-ons-toast>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('alert', ['visible']),
    ...mapState('alert', ['active']),
  },
};
</script>

<style>
@media (min-width: 992px) {
  .toast--success {
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }
}
</style>
