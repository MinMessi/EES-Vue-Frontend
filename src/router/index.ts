import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import HomeRoutes from '@/home/router/HomeRoutes'
import ReviewRoutes from '@/review/router/ReviewRoutes'
import AccountRoutes from '@/account/router/AccountRoutes'
import AuthenticationRoutes from '@/authentication/router/AuthenticationRoutes'
import ProductRoutes from '@/product/router/ProductRoutes';
import CommunityRoutes from '@/community/router/CommunityRoutes'
import CartRoutes from "@/cart/router/CartRoutes"


const routes: Array<RouteRecordRaw> = [
  ...HomeRoutes,
  ...ReviewRoutes,
  ...AccountRoutes,
  ...AuthenticationRoutes,
  ...ProductRoutes,
  ...CommunityRoutes,
  ...CartRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router