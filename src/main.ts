import { createApp } from 'vue';
import './style.css';
import { createRouter, createWebHashHistory } from 'vue-router';
import Main from './Main.vue';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-dark-cyan/theme.css';
import {createPinia} from "pinia";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/me',
    },
    {
      name: 'Me',
      path: '/me',
      component: () => import('./pages/MePage.vue'),
    },
  ],
});
const pinia = createPinia();
createApp(Main).use(router)
    .use(PrimeVue)
    .use(pinia)
    .mount('#app');
