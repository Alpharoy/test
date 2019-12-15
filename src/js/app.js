/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');


import Vue from 'vue';

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// 样式重置
import 'normalize.css';


// Vuex & VueRouter
import VueRouter from 'vue-router';
import Vuex from 'vuex';

Vue.use(VueRouter);
Vue.use(Vuex);


// Element
import ElementUI from 'element-ui';
import '../sass/element-variables.scss';

Vue.use(ElementUI);


// FontAwesome
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

library.add(fas);
Vue.component('fa-icon', FontAwesomeIcon);

// Printer
import Printer from './plugins/printer';

Vue.use(Printer);


// register global filters
import filters from './extends/filters';

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});


export default Vue;