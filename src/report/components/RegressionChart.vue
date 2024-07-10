<template>
<div>
    <h3>회귀 분석 결과</h3>
    <button @click="trainModel" style="background-color:lightgrey; border: 2px solid black; margin-right: 10px;">회귀 모델 훈련</button>
    <button @click="getRegressionData" style="background-color:lightgrey; border: 2px solid black;">그래프 그리기</button>
    <div id="bar-chart"></div>
</div>
</template>

<script>
import axiosInstance from '@/utility/axiosInstance';
import * as d3 from 'd3';

export default {
data() {
    return {
    chartData: null
    };
},
methods: {
    async trainModel() {
    try {
        await axiosInstance.fastapiAxiosInst.post('/train-regression');
        alert('회귀 모델 훈련이 완료되었습니다.');
    } catch (error) {
        console.error('Error training regression model:', error);
        alert('모델 훈련 중 오류가 발생했습니다.');
    }
    },
    async getRegressionData() {
    try {
        const requestData = [
        { user_age: 30, user_gender: 1, date_info: 10 },
        { user_age: 25, user_gender: 0, date_info: 5 }
        ];
        const response = await axiosInstance.fastapiAxiosInst.post('/regression-predict', requestData);
        this.chartData = response.data.predictions;
        this.renderChart();
    } catch (error) {
        console.error('Error fetching regression data:', error);
    }
    },
    renderChart() {
    const data = this.chartData;
    const svg = d3.select("#bar-chart").append("svg")
        .attr("width", 600)
        .attr("height", 400);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(data.map((d, i) => i));

    const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, d => d)]);

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y));

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d))
        .attr("fill", "steelblue");
    }
}
};
</script>

<style scoped>
#bar-chart {
width: 100%;
height: 400px;
}
.bar {
fill: steelblue;
}
.bar:hover {
fill: orange;
}
</style>
  