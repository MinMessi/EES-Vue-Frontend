<template>
    <v-card class="mt-6 pa-6">
        <v-row>
            <v-col cols="12" md="4">
                <v-card class="pa-4" outlined>
                    <v-icon size="48" color="primary" class="mb-4">mdi-calendar</v-icon>
                    <h2 class="subtitle-1 font-weight-bold mb-4">날짜 데이터를 통한 이탈 정보 예측</h2>
                    <v-text-field v-model.number="nDays" label="예측할 일 수 (오늘부터)" type="number" outlined dense
                        append-outer-icon="mdi-calendar-range"></v-text-field>
                    <v-divider class="my-4"></v-divider>
                    <v-btn block color="primary" @click="trainModel" :loading="loading">
                        <v-icon left>mdi-brain</v-icon>
                        모델 학습
                    </v-btn>
                    <v-btn block color="success" class="mt-2" @click="predictTotalUser" :loading="loading">
                        <v-icon left>mdi-account-group</v-icon>
                        총 사용자 예측
                    </v-btn>
                    <v-btn block color="warning" class="mt-2" @click="predictProfit" :loading="loading">
                        <v-icon left>mdi-cash</v-icon>
                        수익 예측
                    </v-btn>
                </v-card>
            </v-col>
            <v-col cols="12" md="8">
                <v-card class="pa-4" outlined>
                    <div v-if="trainResult || result || error">
                        <h3 class="subtitle-1 font-weight-bold mb-2">결과:</h3>
                        <v-alert v-if="trainResult" type="info" dense outlined>{{ trainResult }}</v-alert>
                        <v-alert v-if="error" type="error" dense outlined>{{ error }}</v-alert>
                        <div v-if="result" ref="chart" class="chart-container"></div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
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
            this.executePostRequest("/train-date-info");
        },
        async predictTotalUser() {
            const data = { n_days: this.nDays };
            this.executePostRequest("/predict-total-user", data, "predicted_total_user");
        },
        async predictProfit() {
            const data = { n_days: this.nDays };
            this.executePostRequest("/predict-profit", data, "predicted_profit");
        },
        async executePostRequest(url, data = {}, resultKey = null) {
            this.resetState();
            this.loading = true;
            try {
                const response = await axiosInstance.fastapiAxiosInst.post(url, data, {
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
            if (!this.result) {
                this.error = "Invalid data format received";
                return;
            }

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

            const today = new Date();

            // Create an array of dates starting from today
            const dates = this.result.map((d, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000));
            const formatDate = d3.timeFormat("%Y-%m-%d");

            const x = d3.scaleBand()
                .range([0, width])
                .domain(dates);

            const y = d3.scaleLinear().range([height, 0]);

            const line = d3
                .line()
                .x((d, i) => x(dates[i]))
                .y((d) => y(d));

            y.domain([d3.min(this.result) - (d3.max(this.result) - d3.min(this.result)) * 0.1, d3.max(this.result)]);

            // Calculate the indices for ticks at every 20% of the length of data
            const tickIndices = [];
            const numTicks = 5; // 20% increments (100% / 20% = 5 ticks)
            for (let i = 0; i <= numTicks; i++) {
                tickIndices.push(Math.round((i * (dates.length - 1)) / numTicks));
            }

            // Format the x-axis ticks
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x)
                    .tickValues(tickIndices.map(i => dates[i]))
                    .tickFormat(d => formatDate(d))
                )
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            svg.append("g").call(d3.axisLeft(y));

            svg
                .append("path")
                .datum(this.result)
                .attr("fill", "none")
                .attr("stroke", "#038C7F")
                .attr("stroke-width", 2)
                .attr("d", line);

            // Add points and labels only at tick positions
            tickIndices.forEach(i => {
                svg
                    .append("circle")
                    .attr("class", "dot")
                    .attr("cx", x(dates[i]))
                    .attr("cy", y(this.result[i]))
                    .attr("r", 5)
                    .attr("fill", "green");

                svg
                    .append("text")
                    .attr("class", "label")
                    .attr("x", x(dates[i]))
                    .attr("y", y(this.result[i]) - 10)
                    .attr("text-anchor", "middle")
                    .attr("fill", "green")
                    .text(this.result[i]);
            });
        },
    },
};
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 400px;
}

.v-card {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.v-btn {
    border-radius: 8px;
}

.v-alert {
    margin-bottom: 1rem;
}
</style>