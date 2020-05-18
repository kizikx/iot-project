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
        <line-chart
          v-if="loaded"
          :chartdata="chartData"
          :options="options"
          style="width: 95%"
        ></line-chart>
        <line-chart
          v-if="loaded"
          :chartdata="chartData"
          :options="options"
          style="width: 95%"
        ></line-chart>
        <line-chart
          v-if="loaded"
          :chartdata="chartData"
          :options="options"
          style="width: 95%"
        ></line-chart>
      </v-ons-col>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
    </v-ons-row>
  </v-ons-page>
</template>

<script>
import LineChart from '@/components/LineChart.vue';

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      loaded: true,
      chartData: {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
          {
            backgroundColor: '#f87979',
            data: [40, 20, 35, 12],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
      },
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
