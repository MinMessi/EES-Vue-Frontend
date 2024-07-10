<template>
  <v-container class="membership-prediction">
    <h1 class="title">회원 이탈 예측</h1>

    <v-card class="mt-6 pa-6">
      <v-icon size="48" color="primary" class="mb-4">mdi-calendar</v-icon>

      <h2 class="subtitle-1 font-weight-bold mb-4">날짜 데이터를 통한 이탈 정보 예측</h2>

      <v-text-field
        v-model.number="nDays"
        label="예측할 일 수 (오늘부터)"
        type="number"
        outlined
        dense
        append-outer-icon="mdi-calendar-range"
      ></v-text-field>

      <v-row class="mt-4">
        <v-col cols="12" sm="4">
          <v-btn block color="primary" @click="trainModel" :loading="loading">
            <v-icon left>mdi-brain</v-icon>
            모델 학습
          </v-btn>
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn block color="success" @click="predictTotalUser" :loading="loading">
            <v-icon left>mdi-account-group</v-icon>
            총 사용자 예측
          </v-btn>
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn block color="warning" @click="predictProfit" :loading="loading">
            <v-icon left>mdi-cash</v-icon>
            수익 예측
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <div v-if="trainResult || result || error">
        <h3 class="subtitle-1 font-weight-bold mb-2">결과:</h3>
        <v-alert v-if="trainResult" type="info" dense outlined>{{ trainResult }}</v-alert>
        <v-alert v-if="error" type="error" dense outlined>{{ error }}</v-alert>
        <div v-if="result" ref="chart" class="chart-container"></div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import axiosInstance from "@/utility/axiosInstance";
import * as d3 from "d3";

export default {
  data() {
    return {
      nDays: 0,
      result: null,
      trainResult: null,
      error: null,
      loading: false,
    };
  },
  methods: {
    async trainModel() {
      this.executeRequest("/train-date-info");
    },
    async predictTotalUser() {
      this.executeRequest(
        `/predict-total-user?n_days=${this.nDays}`,
        "predicted_total_user"
      );
    },
    async predictProfit() {
      this.executeRequest(`/predict-profit?n_days=${this.nDays}`, "predicted_profit");
    },
    async executeRequest(url, resultKey = null) {
      this.resetState();
      if (this.nDays <= 0 && resultKey) {
        this.error = "올바른 일 수를 입력하세요.";
        return;
      }
      this.loading = true;
      try {
        const response = await axiosInstance.fastapiAxiosInst.get(url, {
          timeout: 60000,
        });
        if (resultKey) {
          this.result = response.data[resultKey];
          this.$nextTick(() => this.drawChart());
        } else {
          this.trainResult = response.data.message;
        }
      } catch (err) {
        this.error = err.response ? err.response.data.error : err.message;
      } finally {
        this.loading = false;
      }
    },
    resetState() {
      this.result = null;
      this.trainResult = null;
      this.error = null;
    },
    drawChart() {
      const margin = { top: 30, right: 30, bottom: 40, left: 50 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Clear previous chart
      d3.select(this.$refs.chart).selectAll("*").remove();

      const svg = d3
        .select(this.$refs.chart)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().range([0, width]);
      const y = d3.scaleLinear().range([height, 0]);

      const line = d3
        .line()
        .x((d, i) => x(i))
        .y((d) => y(d));

      x.domain([0, this.result.length - 1]);
      y.domain([0, d3.max(this.result)]);

      svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

      svg.append("g").call(d3.axisLeft(y));

      svg
        .append("path")
        .datum(this.result)
        .attr("fill", "none")
        .attr("stroke", "#038C7F")
        .attr("stroke-width", 2)
        .attr("d", line);

      svg
        .selectAll(".dot")
        .data(this.result)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d, i) => x(i))
        .attr("cy", (d) => y(d))
        .attr("r", 5)
        .attr("fill", "green");

      svg
        .selectAll(".label")
        .data(this.result)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d, i) => x(i))
        .attr("y", (d) => y(d) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "green")
        .text((d) => d);
    },
  },
};
</script>

<style scoped>
.membership-prediction {
  max-width: 800px;
  margin: 0 auto;
}
.title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
