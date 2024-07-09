<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>전체 주문 리스트</v-card-title>
                    <v-card-text>
                        <v-table v-if="orderList && orderList.length">
                            <thead>
                                <tr>
                                    <th>주문 번호</th>
                                    <th>주문 사이즈</th>
                                    <th>주문 일자</th>
                                    <th>주문 항목</th>
                                    <th>전체 주문 가격</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in orderList" :key="order.orderId" @click="goToOrderReadPage(order.orderId)" style="cursor: pointer;">
                                    <td>{{ order.orderId }}</td>
                                    <td>{{ order.orderSize }}</td>
                                    <td>{{ order.orderDate }}</td>
                                    <td>{{ truncateOrderName(order.orderName) }}</td>
                                    <td>{{ order.ordersItemTotalPrice }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                        <v-divider></v-divider>
                        <v-pagination
                            v-if="totalPageNumber > 1"
                            v-model:page="currentPageNumber"
                            :length="totalPageNumber"
                            @update:modelValue="onPageChange"/>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="end">
            <v-btn color="green" @click="goToHome">홈으로 돌아가기</v-btn>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

const orderModule = 'orderModule';

export default {
    computed: {
        ...mapGetters(orderModule, ['orderList', 'currentPageNumber', 'totalPageNumber']),
    },
    methods: {
        ...mapActions(orderModule, ['requestOrderListToDjango']),
        ...mapMutations(orderModule, ['SET_CURRENT_PAGE_NUMBER']),
        async fetchOrderList() {
            const accountId = this.$route.params.accountId;
            console.log('currentPageNumber:', this.currentPageNumber);
            await this.requestOrderListToDjango({ accountId, page: this.currentPageNumber });
        },
        async onPageChange(page) {
            console.log("is it operate ? onPageChange():", page);
            this.SET_CURRENT_PAGE_NUMBER(page);
            await this.fetchOrderList();
            this.$router.push({ name: 'OrderListPage', query: { page } });
        },
        goToOrderReadPage(orderId) {
            this.$router.push({ name: 'OrderReadPage', params: { orderId }, query: { page: this.currentPageNumber } });
        },
        goToHome() {
            this.$router.push({ name: 'HomeView' });
        },
        truncateOrderName(orderName) {
            const maxLength = 50;
            return orderName.length > maxLength ? orderName.substring(0, maxLength) + '...' : orderName;
        }
    },
    watch: {
        currentPageNumber: 'fetchOrderList',
    },
    created() {
        const page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
        this.SET_CURRENT_PAGE_NUMBER(page);
        this.fetchOrderList();
    },
};
</script>