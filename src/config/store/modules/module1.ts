export default {
  namespaced: true,
  state: {
    status: 0
  },
  getters: {
    getStatus: (state: any) => state.status
  },
  mutations: {
    updateStatus(state: any, status: number) {
      console.log('module1 status updated', status);
      state.status = status;
    }
  },
  actions: {
    updateStatus({commit, state}, status: number) {
      console.log('module1 dispathed', state.status, status);
      commit('updateStatus', status);
    }
  }
};
