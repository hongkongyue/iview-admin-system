import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import common from './modules/common'
import order from './modules/order'
import quickRepeatOrder from './modules/quickRepeatOrder'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {},
  modules: {
    app,
    user,
    common,
    order,
    quickRepeatOrder
  }
});

export default store;
