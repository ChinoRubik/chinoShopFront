import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import config from '../services/config'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    }
  },
  actions: {
    login({commit}, user) {
      axios.post(config.api_route+'auth/login',
        user , {
          headers: {'Content-Type': 'application/json'}
        }
      ).then((res) => {
        if(res.status === 200) {
          commit('setToken', res.data.data.token)
          localStorage.setItem('token', res.data.data.token)
          router.push({name:'Home'})
          
        }
      }).catch((err) => {
        console.log(err.response)
      })
    },

    register({commit}, user) {
      const userLog= {
        email : user.email,
        password : user.password  
      }
      axios.post(config.api_route+'auth/register',
        user , {
          headers: {'Content-Type': 'application/json'}
        }
      ).then(() => {
        
        axios.post(config.api_route+'auth/login',
        userLog , {
          headers: {'Content-Type': 'application/json'}
        }
      ).then((res) => {
        if(res.status === 200) {
          commit('setToken', res.data.data.token)
          localStorage.setItem('token', res.data.data.token)
          router.push({name:'Home'})
        }
      }).catch((err) => {
        console.log(err.response)
      })


      }).catch((err) => {
        console.log(err.response)
      })
    },

    readToken({commit}) {
      if(localStorage.getItem('token')) {
        commit('setToken', localStorage.getItem('token'))

      }else{
        commit('setToken', null)
      }
    },

    logout({commit}) {
      localStorage.removeItem('token');
      commit('setToken', null);
      router.push({name:'Login'})
    }
  },
  modules: {
  }
})
