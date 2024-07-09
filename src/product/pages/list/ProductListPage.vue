<template lang="">
    <v-container>
        <h2>Running Shoes Product List</h2>
        <div style="text-align: left; margin: 10px;">
            <router-link :to="{ name: 'ProductRegisterPage' }">
            <v-btn @click="goToProductRegisterPage" style="width: 100%; font-size: 16px; font-color: black; border: 3px solid #aaff00; background: linear-gradient(to top, yellow, lightGreen);">
                <span class="mdi mdi-arrow-down-thin-circle-outline" style="font-size: 25px;"></span>
                상품 등록                
            </v-btn>
            </router-link>
        </div>
        <v-row v-if="productList.length > 0">
            <v-col v-for="(product, index) in productList" :key=index cols="12" sm="6" md="4" lg="3">
                <v-card @click="goToProductReadPage(product.productId)">
                    <v-img :src="getProductImageUrl(product.productImage)" class="grey lighten-2">
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey lighten-5"/>
                            </v-row>
                        </template>
                    </v-img>
                    <v-card-title>{{ product.productName }}</v-card-title>
                    <v-card-subtitle>{{ product.productPrice }}원</v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12" class="text-center">
                <v-alert type="info">등록된 상품이 없습니다!</v-alert>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="text-center">
                <v-img src="@/assets/images/fixed/runner.png" class="grey lighten-2">
                    <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="grey lighten-5"/>
                        </v-row>
                    </template>
                </v-img>
            </v-col>
        </v-row>
        <div v-if="isAuthenticated" class="floating-menu-container">
            <v-btn class="floating-button" :class="{ bounce: isBouncing }" @click="goToCart">
            <v-icon color="white">mdi-cart</v-icon>
            <v-badge
                v-if="totalQuantity > 0"
                :content="totalQuantity.toString()"
                color="red"
                overlap
                offset-x="-7"
                offset-y="-23"
            ></v-badge>
            </v-btn>
        </div>
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
const authenticationModule = "authenticationModule";
const productModule = 'productModule'
const cartModule = "cartModule";

export default {
    components: {
        // RouterLink
    },
    computed: {
        ...mapState(productModule, ['productList']),
        ...mapState(authenticationModule, ["isAuthenticated"]),
        ...mapState(cartModule, ["cartItemList"]),
        pagedItems () {
            const startIdx = (this.pagination.page - 1) * this.perPage
            const endIdx = startIdx + this.perPage
            return this.productList.slice(startIdx, endIdx)
        },
        isAuthor() {
        if (!this.product || !this.product.writer) {
            return false;
        }
        return this.product.writer === this.currentUserNickname;
        },
    },
    mounted () {
        this.requestProductListToDjango()
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
        console.log("You already has a userToken!");
        this.$store.state.authenticationModule.isAuthenticated = true;
        }
    },
    async created() {
        await this.loadCartItems();
    },
    methods: {
        ...mapActions(productModule, ['requestProductListToDjango']),
        ...mapActions(authenticationModule, ["requestLogoutToDjango"]),
        ...mapActions(cartModule, [ "requestCartListToDjango"]),
        getProductImageUrl (imageName) {
            return require('@/assets/images/uploadImages/' + imageName)
        },
        goToProductReadPage (productId) {
            this.$router.push({
                name: 'ProductReadPage',
                params: { productId: productId }
            })
        },
        goToCart() {
      this.$router.push({ name: "CartListPage" });
        },
        async loadCartItems() {
            try {
                const response = await this.requestCartListToDjango();
                let totalQuantity = 0;
                response.forEach((item, index) => {
                console.log(`Item ${index} quantity:`, item.quantity);
                totalQuantity += item.quantity;
                });
                this.totalQuantity = totalQuantity;
                console.log("Sum of all quantities:", totalQuantity);
            } catch (error) {
                console.error("Error loading cart items:", error);
            }
        },
    },
    data () {
        return {
            headerTitle: [
                {
                    title: 'No',
                    align: 'start',
                    sortable: true,
                    key: 'productId',
                },
                { title: '상품명', align: 'end', key: 'productName' },
                { title: '상품 가격', align: 'end', key: 'productPrice' },
            ],
            perPage: 5,
            pagination: {
                page: 1,
            },
            totalQuantity: 0,
        };
    }
}
</script>

<style scoped>
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
  margin-right: 13px;
}

.floating-button:hover {
  background-color: #333;
}

.floating-menu {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
</style>