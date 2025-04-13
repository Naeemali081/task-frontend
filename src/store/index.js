// src/store/index.js
import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    clearUser(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  },
  actions: {
    async fetchUser({ commit }) {
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        commit('setUser', data);  // Commit user data to state
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    async updateUser({ commit }, formData) {
      try {
        const response = await axios.post('http://localhost:8000/api/user/update', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        commit('setUser', response.data);

        return response.data;  
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;  
      }
    },
    login({ commit }, userData) {
      commit('setUser', userData.user)
      commit('setToken', userData.token)
    },
    logout({ commit }) {
      commit('clearUser')
    }
  },
  getters: {
    isLoggedIn(state) {
      return !!state.user
    },
    getUser(state) {
      return state.user
    }
  }
})
