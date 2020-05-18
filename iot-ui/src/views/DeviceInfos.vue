<template>
  <v-ons-page id="device-infos">
    <custom-toolbar v-bind="toolbarInfo">
    </custom-toolbar>
    <v-ons-row>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
      <v-ons-col>
        <v-ons-card>
          <h2 v-if="data.name">
            {{ data.name }}
          </h2>
          <h5>Adresse mac</h5>
          <p>{{ data.who }}</p>
          <h5>Première connexion</h5>
          <p>{{ subscribeDate }}</p>
        </v-ons-card>
      </v-ons-col>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
    </v-ons-row>
  </v-ons-page>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  computed: {
    subscribeDate() {
      const date = new Date(this.data.subscribeDate);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },
  },
  created() {
    this.$store.dispatch('data/getDataByESP', {
      // eslint-disable-next-line no-underscore-dangle
      id: this.data._id,
      topic: 'temp',
    });
  },
};
</script>

<style scoped>
.center {
  text-align: center;
}
</style>
