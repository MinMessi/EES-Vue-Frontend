<template>
    <v-container class="chart-container">
        <div class="title-section">
        <text>상품 구매 동향 분석</text>
        </div>
        
        <div style="margin-top: 20px;">        
            <timeseries-chart></timeseries-chart>
            <regression-chart></regression-chart>
        </div>
    </v-container>
</template>

<script>
import TimeseriesChart from '@/report/components/TimeseriesChart.vue';
import RegressionChart from '@/report/components/RegressionChart.vue';

export default {
components: {
    TimeseriesChart,
    RegressionChart
}
};
</script>

<style scoped>
h1 {
text-align: center;
margin-bottom: 20px;
}
</style>

<style>
.title-section {
    padding: 16px;
    font-weight: bold;
    font-size: 1.5rem;
    text-align: left;
    background-color: #fafafa;
    border-bottom: 1px solid #eeeeee;
}
</style>
  