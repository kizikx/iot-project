<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  props: [
    'chartData',
  ],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    chartData() {
      console.log('before update');
      // eslint-disable-next-line no-underscore-dangle
      this.$data._chart.update();
      console.log('updated');
    },
  },
};
</script>

<style scoped>
</style>
