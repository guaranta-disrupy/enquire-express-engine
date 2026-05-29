import { createStore } from 'vuex'

export default createStore({
  state: () => {
    return {
      ide: process.env.VUE_APP_HOST
    }  
  },
  getters: {
    getState: (state) => (keys = []) => {
        return keys.reduce( function (prev, cur) {
          
            return prev[cur];
        }, state);
    }
  },
  mutations: {
    pushValue (state, payload) {
      var value = {
          state: "state"
      }
      payload.keys.forEach(key => {
          value.state += "['"+ key +"']";
      });
      eval(value.state).push(payload.value)
    },
    updateState (state, payload) {
        payload.keys.reduce((prev, cur, index) => {
            if (payload.keys.length == (index + 1)) {
                prev[cur] = payload.value;
            }
            return prev[cur];
        }, state);
    }
  },
  actions: {
  },
  modules: {
  }
})
