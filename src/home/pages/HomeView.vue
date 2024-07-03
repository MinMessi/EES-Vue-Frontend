<template>
  <div class="home-container">
    <!-- <div class="charts-container">
      <div class="chart" ref="chart1"></div>
      <div class="chart" ref="chart2"></div>
      <div class="chart" ref="chart3"></div>
    </div> -->

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
          👟 러닝화 상품 구경하기
        </button>
        <button class="goToCommunity-button" @click="goToCommunityList">
          👨‍👩‍👧‍👦 커뮤니티 이동하기
        </button>
        <button class="goToReview-button" @click="goToReviewList">
          ⭐ 별점 리뷰 달기
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

    // drawDonutChart(container, data, title) {
    //   const width = 200;
    //   const height = 200;
    //   const radius = Math.min(width, height) / 2;
    //   const color = d3.scaleOrdinal(['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#2ecc71', '#e74c3c']);

    //   const svg = d3.select(container)
    //     .append('svg')
    //     .attr('width', width)
    //     .attr('height', height)
    //     .append('g')
    //     .attr('transform', `translate(${width / 2}, ${height / 2})`);

    //   const arc = d3.arc()
    //     .innerRadius(radius - 50)
    //     .outerRadius(radius);

    //   const pie = d3.pie()
    //     .value(d => d.value);

    //   const path = svg.selectAll('path')
    //     .data(pie(data))
    //     .enter()
    //     .append('path')
    //     .attr('d', arc)
    //     .attr('fill', (d, i) => color(i));

    //   // 제목 추가
    //   svg.append('text')
    //     .attr('text-anchor', 'middle')
    //     .attr('dy', '0.35em')
    //     .style('font-size', '14px')
    //     .style('font-weight', 'bold')
    //     .style('fill', '#fff') // 폰트 색상 설정
    //     .text(title);
    // }
  },
  // mounted() {
  //   const data1 = [
  //     { name: 'A', value: 30 },
  //     { name: 'B', value: 70 }
  //   ];

  //   const data2 = [
  //     { name: 'C', value: 40 },
  //     { name: 'D', value: 60 }
  //   ];

  //   const data3 = [
  //     { name: 'E', value: 50 },
  //     { name: 'F', value: 50 }
  //   ];

  //   this.drawDonutChart(this.$refs.chart1, data1, '차트 1');
  //   this.drawDonutChart(this.$refs.chart2, data2, '차트 2');
  //   this.drawDonutChart(this.$refs.chart3, data3, '차트 3');
  // }
});
</script>

<style scoped>
.home-container {
  margin-top: 20px; /* 네비게이션 바와의 여유 공간 */
  text-align: center;
}

.home-image {
  width: 100%;
  max-width: 1200px; /* 적절한 크기로 설정 */
  height: auto;
  margin: auto;
  display: block;
  border-radius: 10px;
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
