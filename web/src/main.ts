import { createApp } from 'vue'
import { createPinia } from 'pinia'
import websocket from '@/utils/socket.io';
import App from './App.vue'
import router from './router'
import service from './utils/axios';


import './assets/main.css'

const app = createApp(App)

// app.config.globalProperties.$socket = websocket;
app.config.globalProperties.$axios = service;  //配置axios的全局引用

// 注册全局组件
// app.component('Card', Card); 

app.use(createPinia())
app.use(router)

app.mount('#app');

