import { createRouter, createWebHashHistory } from 'vue-router';
import WorkInfoForm from '../components/WorkInfoForm.vue';
import SalaryTimer from '../components/SalaryTimer.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: WorkInfoForm
  },
  {
    path: '/timer',
    name: 'Timer',
    component: SalaryTimer
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;