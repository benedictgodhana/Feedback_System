<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Pie } from 'vue-chartjs';
  
  export default {
    extends: Pie,
    props: {
      data: {
        type: Object,
        required: true,
      },
      options: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      this.renderChart(this.data, this.options);
    },
  };
  </script>
  