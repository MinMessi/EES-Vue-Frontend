<template>
  <v-container>
    <v-icon class="left-arrow" @click="navigateToPrevious">mdi-chevron-left</v-icon>
    <v-card class="main" v-if="community" outlined>
      <v-card-title class="headline">{{ community.title }}</v-card-title>
      <v-card-subtitle>
        <v-icon small>mdi-account</v-icon>
        {{ community.writer }} |
        <v-icon small>mdi-calendar</v-icon>
        {{ community.regDate }} |
        <v-icon small>mdi-eye</v-icon>
        Views: {{ community.viewCount }}
      </v-card-subtitle>
      <v-card-text>
        <v-textarea v-model="community.content" readonly auto-grow filled></v-textarea>
      </v-card-text>
    </v-card>

    <div class="floating-menu-container">
      <v-btn class="floating-button" @click="toggleMenu">
        <v-icon>{{ menuOpen ? "mdi-close" : "mdi-menu" }}</v-icon>
      </v-btn>
      <div v-if="menuOpen" class="floating-menu">
        <v-btn
          class="menu-item"
          @click="$router.push({ name: 'CommunityModifyPage', params: { communityId } })"
        >
          수정
        </v-btn>
        <v-btn class="menu-item" @click="onDelete"> 삭제 </v-btn>
        <v-btn class="menu-item" @click="$router.push({ name: 'CommunityListPage' })">
          돌아가기
        </v-btn>
      </div>
    </div>
    <v-icon v-if="showNextArrow" class="right-arrow" @click="navigateToNext">mdi-chevron-right</v-icon>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

const communityModule = "communityModule";

export default {
  props: {
    communityId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    menuOpen: false,
  }),
  computed: {
    ...mapState(communityModule, ["community"]),
  },
  methods: {
    ...mapActions(communityModule, [
      "requestCommunityToDjango",
      "requestDeleteCommunityToDjango",
      "incrementCommunityViewCount",
    ]),
    navigateToPrevious() {
      const previousId = Number(this.communityId) + 1;
      if (previousId > 0) {
        this.$router.push(`/community/read/${previousId}`);
      }
    },
    async navigateToNext() {
      const nextId = Number(this.communityId) - 1;
      if (nextId <= 0) {
        this.showNextArrow = false;
        return;
      }
      const community = await this.requestCommunityToDjango(nextId);
      if (!community || !community.communityImage) {
        this.showNextArrow = false;
        this.$router.push(`/community/read/${this.communityId - 1}`);
      } else {
        this.showNextArrow = true;
        this.$router.push(`/community/read/${nextId + 1}`);
      }
    },
    async onDelete() {
      await this.requestDeleteCommunityToDjango(this.communityId);
      this.$router.push({ name: "CommunityListPage" });
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
  async created() {
    await this.requestCommunityToDjango(this.communityId);
    await this.incrementCommunityViewCount(this.communityId);
  },
};
</script>

<style scoped>
.v-card {
  max-width: 800px;
  margin: auto;
}

.main {
  margin-top: 80px;
}
.floating-menu-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
}

.floating-button {
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
}

.floating-button:hover {
  background-color: #333;
}

.floating-menu {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.menu-item {
  margin-bottom: 10px;
  background-color: #000;
  color: #fff;
}
.menu-item:hover {
  background-color: #333;
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
</style>
