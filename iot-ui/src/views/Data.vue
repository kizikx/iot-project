<template>
  <v-ons-page id="data">
    <v-ons-row>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
      <v-ons-col>
        <h1 class="center">Températures</h1>
        <line-chart
          v-if="tempLoaded && show"
          style="width:95%"
          :chartdata="tempData"
          :options="options"
        ></line-chart>
        <h1 class="center">Luminosités</h1>
        <line-chart
          v-if="lightLoaded && show"
          style="width:95%"
          :chartdata="lightData"
          :options="options"
        ></line-chart>
        <h1 class="center">WiFi</h1>
        <line-chart
          v-if="wifiLoaded && show"
          style="width:95%"
          :chartdata="wifiData"
          :options="options"
        ></line-chart>
      </v-ons-col>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
    </v-ons-row>
  </v-ons-page>
</template>

<script>
import { mapGetters } from 'vuex';
import LineChart from '@/components/LineChart.vue';

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      show: true,
      tempLoaded: false,
      lightLoaded: false,
      wifiLoaded: false,
      tempdata: {},
      lightData: {},
      wifiData: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        xAxes: [{
          type: 'time',
          ticks: {
            autoSkip: false,
            maxTicksLimit: 5,
          },
        }],
      },
    };
  },
  computed: {
    ...mapGetters('esps', ['nameFromMAC']),
  },
  methods: {
    rerender() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    randomColor() {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return `rgb(${r},${g},${b})`;
    },
    filter(data) {
      const listeData = [];
      const dates = [];
      data.forEach((element) => {
        const date = (new Date(element.date)).toLocaleDateString('fr-FR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        if (!listeData[element.who]) {
          listeData[element.who] = [];
        }
        listeData[element.who].push(element.value);
        if (dates.indexOf(date) === -1) {
          dates.push(date);
        }
      });
      const datasets = [];
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const esp in listeData) {
        datasets.push({
          label: this.nameFromMAC(esp),
          backgroundColor: this.randomColor(),
          data: listeData[esp],
          fill: false,
        });
      }
      return [dates, datasets];
    },
    getData() {
      const tempPromise = this.$store.dispatch('data/getDataByTopic', 'temp').then((data) => {
        const [labels, datasets] = this.filter(data);
        this.tempData = {
          labels,
          datasets,
        };
        this.tempLoaded = true;
      });
      const lightPromise = this.$store.dispatch('data/getDataByTopic', 'light').then((data) => {
        const [labels, datasets] = this.filter(data);
        this.lightData = {
          labels,
          datasets,
        };
        this.lightLoaded = true;
      });
      const wifiPromise = this.$store.dispatch('data/getDataByTopic', 'wifi').then((data) => {
        const [labels, datasets] = this.filter(data);
        this.wifiData = {
          labels,
          datasets,
        };
        this.wifiLoaded = true;
      });
      return Promise.all([tempPromise, lightPromise, wifiPromise]);
    },
  },
  created() {
    this.getData();
    setInterval(() => {
      this.getData().then(() => {
        this.rerender();
      });
    }, 10000);
  },
};
</script>

<style scoped>
.center {
  text-align: center;
}
</style>
