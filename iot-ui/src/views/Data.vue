<template>
  <v-ons-page id="data">
    <v-ons-row>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
      <v-ons-col>
        <Chart :chart-data="data"></Chart>
      </v-ons-col>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
    </v-ons-row>
  </v-ons-page>
</template>

<script>
import Chart from '../components/Chart.vue';

export default {
  components: {
    Chart,
  },
  data() {
    return {
      data: {
        labels: ['January', 'February'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 20],
          },
        ],
      },
    };
  },
  created() {
    setTimeout(() => {
      this.data.labels[0] = 'March';
      this.data.datasets[0].label = 'Data Two';
      this.data.datasets[0].data[0] = 10;
      this.data.datasets[0].data[1] = 15;
    }, 6000);
  },
};
</script>

<style scoped>
</style>
