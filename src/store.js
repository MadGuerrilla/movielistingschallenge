import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiConfigUrl: 'https://api.themoviedb.org/3/configuration?api_key=',
    apiGenresUrl: 'https://api.themoviedb.org/3/genre/movie/list?api_key=',
    apiV3: 'bb62415b490284e1e4762acce83f91a8',
    apiLang: 'en-US'
  },
  mutations: {

  },
  actions: {

  }
})
