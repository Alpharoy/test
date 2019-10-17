import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules,
    getters: _.mapValues(modules, (value, key) => {
        return state => state[key];
    }),
});

export default store;