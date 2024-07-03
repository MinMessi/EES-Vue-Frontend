<template>
  <v-app-bar color="black" app dark height="64">
    <v-toolbar-title class="navbar-title">
      <v-btn text @click="goToHome" class="navbar-title-btn">
        <v-icon class="mdi-icon" left>mdi-shoe-sneaker</v-icon>
        <span> IT, SHOE</span>
      </v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>    

    <v-btn text @click="goToProductList" class="btn-text">      
      <!-- <span class="mdi mdi-shoe-formal"></span> -->
      <span>👟PRODUCTS</span>
    </v-btn>

    <v-btn text @click="goToCommunityList" class="btn-text">
      <!-- <span class="mdi mdi-account-group-outline"></span> -->
      <span>👨‍👩‍👧‍👦COMMUNITY</span>
    </v-btn>

    <v-btn text @click="goToReviewList" class="btn-text">
      <!-- <span class="mdi mdi-star-box"></span> -->
      <span>⭐REVIEW</span>
    </v-btn> 

    <v-btn v-if="isAuthenticated" text @click="goToCart" class="btn-text">
      <!-- <span class="mdi mdi-cart-outline"></span> -->
      <span>🛒Cart</span>
    </v-btn>

    <v-btn v-if="isAuthenticated" text @click="goToOrder" class="btn-text">
      <!-- <v-icon left>mdi-receipt</v-icon> -->
      <span>💵Order</span>
    </v-btn>
    
    <v-menu close-on-content-click>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="btn-text">
                <!-- <span class="mdi mdi-file-chart"></span> -->
                <b>📊Report</b>
            </v-btn>
        </template>
        <v-list>
            <v-list-item v-for="(item, index) in reportItems"
                          :key="index" @click="item.action">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>   

    <v-menu v-if="isAuthenticated" close-on-content-click>
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="btn-text">
                    <v-icon left>mdi-account</v-icon>
                    <b>My Page</b>
                </v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(item, index) in myPageItems"
                             :key="index" @click="item.action">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

    <v-btn v-if="!isAuthenticated" text @click="signIn" class="btn-text">
      <v-icon left>mdi-login</v-icon>
      <span>LOGIN</span>
    </v-btn>

  </v-app-bar>
</template>

<script>
import "@mdi/font/css/materialdesignicons.css";
import router from "@/router";
import { mapActions, mapState } from 'vuex'
const authenticationModule = 'authenticationModule'

export default {
  data() {
    return {
      reportItems: [
                { title: '구매 동향 분석', action: () => { this.goToHome() } },
                { title: '회원 이탈 예측', action: () => { this.goToHome() } },
      ],
      myPageItems: [
                { title: '👤MY PAGE', action: () => { this.goToMyPage() } },
                { title: '🔚LOGOUT', action: () => { this.signOut() } },
            ]
    }
  },
  computed: {
    ...mapState(authenticationModule, ['isAuthenticated'])
  },
  methods: {
    ...mapActions(authenticationModule, ['requestLogoutToDjango']),
    goToHome() {
      router.push("/");
    },
    goToReport() {
      router.push("/report");
    },
    goToProductList() {
      router.push("/product/list");
    },
    goToCommunityList() {
      router.push("/community/list");
    },
    goToReviewList() {
      router.push("/review/list");
    },    
    signIn() {
      router.push("/account/login");
    },
    signOut() {
      this.requestLogoutToDjango()
      router.push('/')
    },
    goToCart () {
      router.push('/cart/list')
    },
    goToOrder () {
        router.push('/order')
    },
    goToMyPage () {
        router.push('/account/mypage')
    },
  },
  mounted() {
    console.log('navigation bar mounted()')
    const userToken = localStorage.getItem("userToken")
    if (userToken) {
      console.log('You already has a userToken!')
      this.$store.state.authenticationModule.isAuthenticated = true
    }
  }
};
</script>

<style scoped>
.navbar-title {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.navbar-title-btn {
  color: white;
}

.mdi-icon {
  font-size: 32px;
  /* 아이콘 크기 설정 */
  margin-right: 8px;
}

.btn-text {
  font-size: 14px;
  margin-right: 16px;
  color: rgb(83, 83, 83);
}

.v-btn {
  text-transform: uppercase;
}

.v-btn:hover {
  background-color: rgba(170, 255, 0, 0.233); /* 마우스오버시 hover 효과 */
}

.v-btn:hover .btn-text {
  color: white; 
}

.v-btn:focus {
  background-color: rgba(170, 255, 0, 0.233); /* 클릭해서 선택되었을시 표시 */
  color: white
}

.v-btn:focus .btn-text {
  color: white
}

/* 드롭다운 메뉴 스타일 */
.v-menu > .v-overlay__content > .v-card, .v-menu > .v-overlay__content > .v-sheet, .v-menu > .v-overlay__content > .v-list {
  background-color: #0000008a; /* 투명한 검은색 배경 */
  color: white;
}



.v-list-item:hover {
  background-color: rgba(170, 255, 0, 0.233);; /* 마우스오버시 배경 색상 */
}
</style>
