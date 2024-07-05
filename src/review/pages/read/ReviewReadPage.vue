<template>
  <v-container>
    <div class="navigation-container">
      <v-icon class="left-arrow" @click="navigateToPrevious">mdi-chevron-left</v-icon>
      <v-card v-if="review" class="question-card">
        <v-card-title class="title-section">
          {{ review.title }}
        </v-card-title>
        <v-card-subtitle class="subtitle-section">
          {{ review.writer }}
        </v-card-subtitle>
        <v-img
          :src="getReviewImageUrl(review.reviewImage)"
          aspect-ratio="1"
          class="image-placeholder"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-row>
          </template>
        </v-img>
        <v-card-text class="content-section">
          {{ review.content }}
        </v-card-text>
      </v-card>
      <v-icon class="share" @click="copyUrlToClipboard">mdi-share-variant</v-icon>
      <v-icon v-if="showNextArrow" class="right-arrow" @click="navigateToNext"
        >mdi-chevron-right</v-icon
      >
    </div>
    <router-link class="floating-button" :to="{ name: 'ReviewListPage' }">
      <v-icon color="white">mdi-undo</v-icon>
    </router-link>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import "@mdi/font/css/materialdesignicons.css";

const reviewModule = "reviewModule";

export default {
  props: {
    reviewId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showNextArrow: true,
    };
  },
  computed: {
    ...mapState(reviewModule, ["review"]),
  },
  methods: {
    ...mapActions(reviewModule, [
      "requestReviewToDjango",
      "incrementReviewViewCount",
    ]),
    navigateToPrevious() {
      const previousId = Number(this.reviewId) + 1;
      if (previousId > 0) {
        this.$router.push(`/review/read/${previousId}`);
      }
    },
    async navigateToNext() {
      const nextId = Number(this.reviewId) - 1;
      if (nextId <= 0) {
        this.showNextArrow = false;
        return;
      }
      const review = await this.requestReviewToDjango(nextId);
      if (!review || !review.reviewImage) {
        this.showNextArrow = false;
        this.$router.push(`/review/read/${this.reviewId - 1}`);
      } else {
        this.showNextArrow = true;
        this.$router.push(`/review/read/${nextId + 1}`);
      }
    },
    getReviewImageUrl(imageName) {
      console.log("imageName:", imageName);
      if (imageName) {
        return require(`@/assets/images/reviewImages/${imageName}`);
      }
      return null;
    },
    copyUrlToClipboard() {
      const url = window.location.href;
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        alert("주소가 복사되었습니다.");
      } catch (err) {
        alert("주소 복사 실패");
        console.error("Failed to copy: ", err);
      }
      document.body.removeChild(textarea);
    },
  },
  async created() {
    const review = await this.requestReviewToDjango(this.reviewId);
    if (this.reviewId == 1) {
      this.showNextArrow = false;
    } else {
      this.showNextArrow = true;
    }
    await this.incrementReviewViewCount(this.reviewId);
  },
  watch: {
    async reviewId(newId) {
      const review = await this.requestReviewToDjango(newId);
      if (newId == 1) {
        this.showNextArrow = false;
      } else {
        this.showNextArrow = true;
      }
    },
  },
};
</script>

<style scoped>
.navigation-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 40px auto;
}

.question-card {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.image-placeholder {
  height: 300px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
}

.title-section {
  padding: 16px;
  font-weight: bold;
  font-size: 1.5rem;
  text-align: left;
  background-color: #fafafa;
  border-bottom: 1px solid #eeeeee;
}

.subtitle-section {
  padding: 8px 16px;
  color: #000000;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  background-color: #fafafa;
  border-bottom: 1px solid #eeeeee;
}

.content-section {
  padding: 16px;
  color: #333333;
  font-size: 1rem;
  line-height: 1.5;
  background-color: #ffffff;
  text-align: left;
}

.left-arrow,
.right-arrow {
  font-size: 3rem;
  cursor: pointer;
  color: #000000;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.left-arrow {
  left: 100px;
}

.right-arrow {
  right: 100px;
}

.left-arrow:hover,
.right-arrow:hover {
  color: #4caf50;
}

.share {
  color: #000000;
  cursor: pointer;
  position: absolute;
  margin-top: 590px;
  right: 310px;
}

.floating-button {
  position: fixed;
  bottom: 20px;
  right: 80px; /* 아이콘과 간격 조절 */
  background-color: #000000;
  color: #ffffff;
  padding: 10px;
  border-radius: 50%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}

.floating-button:hover {
  background-color: #333333;
}

.mdi-icon-white {
  color: #ffffff;
}

.question-card:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}
</style>
