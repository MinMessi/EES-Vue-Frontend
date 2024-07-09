<template>
  <v-container v-if="product">
    <v-row>
      <v-col cols="12" md="7">
        <v-carousel v-if="hasProductImages" hide-delimiters height="500">
          <v-carousel-item v-for="(image, i) in productImages" :key="i">
            <!-- <v-img :src="getProductImageUrl(image)" height="500" contain> -->
            <v-img 
            :src="getProductImageUrl(product.productImage)" 
            height="500" contain />
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
            <!-- </v-img> -->
          </v-carousel-item>
        </v-carousel>
        <!-- <v-img v-else src="@/assets/images/uploadImages/image.png" height="500" contain/> -->
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5" />
          </v-row>
        </template>
        <!-- </v-img> -->
        <v-row v-if="hasProductImages" class="mt-2">
          <v-col v-for="(image, i) in productImages" :key="i" cols="2">
            <!-- <v-img :src="getProductImageUrl(image)" height="50" contain @click="selectImage(i)"></v-img> -->
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="5">
        <h1 class="text-h4 font-weight-bold mb-2">{{ product.productName }}</h1>
        <p class="text-subtitle-1 mb-2">{{ product.productDescription }}</p>
        <p class="text-h5 font-weight-bold mb-4">
          {{ product.productPrice.toLocaleString() }} 원
        </p>

        <v-alert type="warning" class="mb-4" dense text icon="mdi-clock-fast">
          품절임박! 서둘러 주문하세요.
        </v-alert>

        <v-row class="mb-4">
          <v-col cols="6">
            <h3 class="text-subtitle-1 mb-2">사이즈 선택</h3>
          </v-col>
          <v-col cols="6" class="text-right">
            <span class="text-caption">사이즈 가이드</span>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col v-for="size in sizes" :key="size" cols="3" sm="2">
            <v-btn
              outlined
              :color="selectedSize === size ? 'primary' : ''"
              @click="selectSize(size)"
              block
              class="size-btn"
            >
              {{ size }}
            </v-btn>
          </v-col>
        </v-row>

        <v-btn
          block
          x-large
          color="black"
          class="white--text mt-6"
          @click="onAddToCart"
          height="50"
        >
          장바구니
        </v-btn>

        <v-btn block x-large outlined class="mt-4" @click="onAddToCart" height="50">
          위시리스트 <v-icon right>mdi-heart-outline</v-icon>
        </v-btn>

        <v-expansion-panels class="mt-6" flat>
          <v-expansion-panel>
            <v-expansion-panel-header>무료 픽업</v-expansion-panel-header>
            <v-expansion-panel-content>
              무료 픽업 관련 정보...
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>매장 찾기</v-expansion-panel-header>
            <v-expansion-panel-content>
              매장 찾기 관련 정보...
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-alert type="info"> 상품 정보를 불러오는 중입니다... </v-alert>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

const productModule = "productModule";
const cartModule = "cartModule";

export default {
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedSize: null,
      sizes: [
        "220",
        "225",
        "230",
        "235",
        "240",
        "245",
        "250",
        "255",
        "260",
        "265",
        "270",
        "275",
        "280",
        "285",
        "290",
      ],
      //   productImages: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'], // 예시 이미지 배열
    };
  },
  computed: {
    ...mapState(productModule, ["product"]),
    hasProductImages() {
      return (
        this.product && this.product.productImage && this.product.productImage.length > 0
      );
    },
    productImages() {
      return this.hasProductImages ? this.product.productImage : [];
    },
  },
  methods: {
    ...mapActions(productModule, ["requestProductToDjango", "incrementProductViewCount"]),
    ...mapActions(cartModule, ["requestAddCartToDjango"]),
    async onPurchase() {
      console.log("장바구니 버튼 눌렀음");
    },
    async onAddToCart() {
      console.log("장바구니에 추가 버튼 눌렀음");
      try {
        const cartData = {
          productId: this.product.productId,
          productName: this.product.productName,
          productPrice: this.product.productPrice,
          quantity: 1,
          productSize: this.selectedSize,
        };
        await this.requestAddCartToDjango(cartData);
        this.$router.push({ name: "CartListPage" });
      } catch (error) {
        console.log("장바구니 추가 과정에서 에러 발생:", error);
      }
    },
    getProductImageUrl(imageName) {
      console.log("imageName:", imageName);
      if (imageName) {
        return require(`@/assets/images/uploadImages/${imageName}`);
      }
      return null;
    },
    selectSize(size) {
      this.selectedSize = size;
    },
  },
  async created() {
    await this.requestProductToDjango(this.productId);
    await this.incrementProductViewCount(this.productId);
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
.size-btn {
  min-width: 0;
  width: 100%;
  height: 40px;
}
</style>
