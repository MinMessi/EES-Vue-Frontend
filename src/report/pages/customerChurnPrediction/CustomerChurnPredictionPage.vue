<template>
  <v-container class="membership-prediction">
    <h1 class="title">회원 이탈 예측</h1>
    <DatePredictionCard />
    <UserWithdrawalPredictionCard />
  </v-container>
</template>

<script>
import DatePredictionCard from "@/report/pages/customerChurnPrediction/DateInfoPrediction.vue";
import UserWithdrawalPredictionCard from "@/report/pages/customerChurnPrediction/UserInfoPrediction.vue";

export default {
  components: {
    DatePredictionCard,
    UserWithdrawalPredictionCard,
  },
};
</script>

<style scoped>
.membership-prediction {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}
</style>