<template>
  <div class="home-container">
    <img :src="imageSrc" alt="Home Image" class="home-image" />

    <div class="text-container">
      <p class="subtitle">나이키 페가수스 41</p>
      <h2 class="title">에너지를 낭비하지 마세요</h2>
      <p class="description">
        페가수스를 신고 달려 보세요.<br />에어 줌이 선사하는 탁월한 에너지 반환력과 완전히
        새롭게 태어난 리액트X 폼을 직접 느껴 보세요.
      </p>
      <div class="buttons">
        <button class="goToProduct-button" @click="goToProductList">
          러닝화 상품 구경하기
        </button>
        <button class="goToCommunity-button" @click="goToCommunityList">
          커뮤니티 이동하기
        </button>
        <button class="goToReview-button" @click="goToReviewList">
          별점 리뷰 달기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import imageSrc from "@/assets/images/homeImages/image1.jpg";
import * as d3 from "d3";

import router from "@/router";
import { mapActions, mapState } from "vuex";
const authenticationModule = "authenticationModule";

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      imageSrc,
    };
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
  },
  methods: {
    ...mapActions(authenticationModule, ["requestLogoutToDjango"]),

    goToProductList() {
      router.push("/product/list");
    },
    goToCommunityList() {
      router.push("/community/list");
    },
    goToReviewList() {
      router.push("/review/list");
    },
  },
});
</script>

<style scoped>
.home-container {
  text-align: center;
}

.home-image {
  width: 100%;
  height: auto;
  margin: auto;
  display: block;
  object-fit: cover;
}

.text-container {
  margin-top: 20px;
}

.subtitle {
  font-size: 18px;
  color: #555;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin: 10px 0;
}

.description {
  font-size: 18px;
  color: #777;
}

.buttons {
  margin-top: 20px;
}

.goToProduct-button,
.goToCommunity-button,
.goToReview-button {
  background-color: black;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 20px;
  cursor: pointer;
  border-radius: 10px;
  font-size: 20px;
  width: 300px;
}

.goToProduct-button:hover,
.goToCommunity-button:hover,
.goToReview-button:hover {
  background-color: rgba(191, 255, 0, 0.781);
}

/* .charts-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 300px 20px 300px;  
  background-color: rgba(109, 109, 109, 0.091);
  border-radius: 10px;
}

.chart {
  margin: 0 10px;
  font: white;
} */
</style>
