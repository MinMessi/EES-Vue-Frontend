<template>
  <v-container>
    <div class="title-section">
      <text>회원 이탈 예측</text>
    </div>

    <div><h1>🗓️</h1></div>

    <div>
      <h3>날짜 데이터를 통한 이탈 정보 예측</h3>
      
      <div>
        <label for="days">예측할 일 수 : (오늘부터) </label>
        <input v-model.number="nDays" id="days" type="number" style="background-color:lightgrey; border: 2px solid black;"/>일
      </div>

      <div class="button-container">
        <button class="btn train" @click="trainModel">모델 학습</button>
        <button class="btn predict" @click="predictTotalUser">총 사용자 예측</button>
        <button class="btn profit" @click="predictProfit">수익 예측</button>
      </div>

      <h3>모델학습 결과 : </h3>
      <div v-if="trainResult">        
        <p>{{ trainResult }}</p>
      </div>

      <h3>예측 결과 : </h3>
      <div v-if="result">        
        <p>{{ result }}</p>
      </div>

      <h3>오류 : </h3>  
      <div v-if="error">
        <p>{{ error }}</p>
      </div>
    </div>
  </v-container>
</template>

<script>
import axiosInstance from "@/utility/axiosInstance";

export default {
  data() {
    return {
      nDays: 0,
      result: null,
      trainResult: null,
      error: null,
    };
  },
  methods: {
    async trainModel() {
      this.trainResult = null;
      this.error = null;
      try {
        const response = await axiosInstance.fastapiAxiosInst.post('/train-date-info', {}, {
          timeout: 60000,
        });
        this.trainResult = response.data.message;
      } catch (err) {
        this.error = err.response ? err.response.data.error : err.message;
      }
    },
    async predictTotalUser() {
      this.result = null;
      this.error = null;
      if (this.nDays > 0) {
        try {
          const params = new URLSearchParams();
          params.append('n_days', this.nDays);
          const response = await axiosInstance.fastapiAxiosInst.get(`/predict-total-user?${params.toString()}`, {
            timeout: 60000,
          });
          this.result = response.data.predicted_total_user;
        } catch (err) {
          this.error = err.response ? err.response.data.error : err.message;
        }
      } else {
        this.error = "올바른 일 수를 입력하세요.";
      }
    },
    async predictProfit() {
      this.result = null;
      this.error = null;
      if (this.nDays > 0) {
        try {
          const params = new URLSearchParams();
          params.append('n_days', this.nDays);
          const response = await axiosInstance.fastapiAxiosInst.get(`/predict-profit?${params.toString()}`, {
            timeout: 60000,
          });
          this.result = response.data.predicted_profit;
        } catch (err) {
          this.error = err.response ? err.response.data.error : err.message;
        }
      } else {
        this.error = "올바른 일 수를 입력하세요.";
      }
    },
  },
};
</script>

<style>
.title-section {
  padding: 16px;
  font-weight: bold;
  font-size: 1.5rem;
  text-align: left;
  background-color: #fafafa;
  border-bottom: 1px solid #eeeeee;
}

.button-container {
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  margin: 5px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn.train {
  background-color: #007bff;
}

.btn.train:hover {
  background-color: #0056b3;
}

.btn.predict {
  background-color: #28a745;
}

.btn.predict:hover {
  background-color: #218838;
}

.btn.profit {
  background-color: #ffc107;
}

.btn.profit:hover {
  background-color: #e0a800;
}
</style>
