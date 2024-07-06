<template>
  <v-container>
    <v-icon class="left-arrow" @click="navigateToPrevious">mdi-chevron-left</v-icon>
    <v-card class="main" v-if="community" outlined>
      <v-card-title class="headline">{{ community.title }}</v-card-title>
      <v-card-subtitle
        style="display: flex; justify-content: space-between; align-items: center"
      >
        <div>
          <v-icon small>mdi-account</v-icon>
          {{ community.writer }} |
          <v-icon small>mdi-calendar</v-icon>
          {{ formatDate(community.regDate) }}
        </div>
        <div>
          <v-icon small>mdi-eye</v-icon>
          {{ community.viewCount }}
        </div>
      </v-card-subtitle>
      <v-card-text>
        <v-textarea v-model="community.content" readonly auto-grow filled></v-textarea>
      </v-card-text>
    </v-card>

    <div v-if="isAuthenticated" class="floating-menu-container">
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
        <v-btn class="menu-item" @click="showDeleteDialog = true"> 삭제 </v-btn>
        <v-btn class="menu-item" @click="$router.push({ name: 'CommunityListPage' })">
          돌아가기
        </v-btn>
      </div>
    </div>
    <div v-if="!isAuthenticated" class="floating-menu-container">
      <v-btn class="floating-button" @click="$router.push({ name: 'CommunityListPage' })">
        <v-icon color="white">mdi-undo</v-icon>
      </v-btn>
    </div>
    <v-icon v-if="showNextArrow" class="right-arrow" @click="navigateToNext"
      >mdi-chevron-right</v-icon
    >

    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-text>정말로 삭제하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showDeleteDialog = false">취소</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

const communityModule = "communityModule";
const authenticationModule = "authenticationModule";

export default {
  props: {
    communityId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    menuOpen: false,
    showNextArrow: true,
    showDeleteDialog: false,
  }),
  computed: {
    ...mapState("communityModule", ["community"]),
    ...mapState("authenticationModule", ["isAuthenticated"]),
  },
  methods: {
    ...mapActions("communityModule", [
      "requestCommunityToDjango",
      "requestDeleteCommunityToDjango",
      "incrementCommunityViewCount",
    ]),
    async navigateToPrevious() {
      const previousId = Number(this.communityId) + 1;
      this.$router.push(`/community/read/${previousId}`);
      await this.requestCommunityToDjango(previousId);
      await this.incrementCommunityViewCount(previousId);
      this.showNextArrow = previousId !== 1;
    },
    async navigateToNext() {
      const nextId = Number(this.communityId) - 1;
      this.$router.push(`/community/read/${nextId}`);
      await this.requestCommunityToDjango(nextId);
      await this.incrementCommunityViewCount(nextId);
      this.showNextArrow = nextId !== 1;
    },
    async confirmDelete() {
      await this.onDelete();
      this.showDeleteDialog = false;
    },
    async onDelete() {
      await this.requestDeleteCommunityToDjango(this.communityId);
      this.$router.push({ name: "CommunityListPage" });
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString)
        .toLocaleDateString("ko-KR", options)
        .replace(/\./g, "-")
        .replace(/ /g, "")
        .slice(0, -1);
    },
  },
  async created() {
    await this.requestCommunityToDjango(this.communityId);
    await this.incrementCommunityViewCount(this.communityId);
    this.showNextArrow = Number(this.communityId) !== 1;
  },
  watch: {
    async communityId(newId) {
      const community = await this.requestCommunityToDjango(newId);
      this.showNextArrow = Number(newId) !== 1;
      await this.incrementCommunityViewCount(newId);
    },
  },
};
</script>

<style scoped>
.v-card {
  max-width: 800px;
  margin: auto;
}

.main {
  margin-top: 150px;
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

.v-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.v-icon:hover {
  color: #4caf50;
}
</style>
