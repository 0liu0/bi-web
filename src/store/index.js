import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: JSON.parse(sessionStorage.getItem('user') || JSON.parse(localStorage.getItem('user')) || '{}')
  },
  getters: {
    getUser: (state) => {
      return state.user;
    },
  },
  mutations: {
    setUserToSessionStorage(state,user) {
      console.log("store user：", user);
      state.user = user
      sessionStorage.setItem('user',JSON.stringify(user))
    },
    setUserToLocalStorage(state, user) {
      console.log("store user：", user);
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    }
  },
  actions: {
  },
  modules: {
  }
})
export default store;