import App from './App.vue';
import Vue from './app';
import router from './router/supplier';
import store from './store';

const app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
});

// 定义全局组件尺寸
app.$ELEMENT.size = 'small';