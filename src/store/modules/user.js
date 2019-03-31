const userModule = {
    namespaced: true,
    state: {
        user: {
            id: 0
        }
    },
    mutations: {
        setUser(state, userId){
            state.user.id = userId;

        }
    },
    actions: {
    }
};

export default userModule;