import { createRouter, createWebHistory } from 'vue-router';

import MovementHistoryView from '@/views/MovementHistoryView.vue';
import FinancialAndInvestmentEvaluationView from '@/views/FinancialAndInvestmentEvaluationView.vue';
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
    path: '/financial-and-investmentEvaluation',
    name: 'financial-and-investmentEvaluation',
    component: FinancialAndInvestmentEvaluationView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
