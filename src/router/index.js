import { createRouter, createWebHistory } from 'vue-router';

import InvestmentAnalysisView from '@/views/InvestmentAnalysisView.vue';
import MovementHistoryView from '@/views/MovementHistoryView.vue';
import CurrentStatusAnalysisView from '@/views/CurrentStatusAnalysis.vue';
import LoginView from '../views/LoginView.vue';
import BuyingAndSellingView from '../views/BuyingAndSellingView.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/buying-and-selling',
    name: 'buying-and-selling',
    component: BuyingAndSellingView,
  },
  {
    path: '/movement-history',
    name: 'movement-hisory',
    component: MovementHistoryView,
  },
  {
    path: '/current-status-analysis',
    name: 'current-status-analysis',
    component: CurrentStatusAnalysisView,
  },
  {
    path: '/investment-analysis',
    name: 'investment-analysis',
    component: InvestmentAnalysisView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
