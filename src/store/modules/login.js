const loginModule = {
    namespaced: true,
    state: {
        sliderDragable: false,
        sliderInitX: 0,
        sliderDragDistance: 0,
        sliderValidation: 0,
        randomPoint: {
            x: 0,
            y: 0
        },
        token: ""
    },
    mutations: {
        sliderDragable(state, status){
            state.sliderDragable = status;
        },
        sliderDragDistance(state, currentX){
            let distance = currentX - state.sliderInitX;
            state.sliderDragDistance = distance < 0 ? 0 : distance > 208 ?  208 : distance;
        },
        sliderInitX(state, distance){
            state.sliderInitX = distance;
        },
        sliderValidation(state, type){
            state.sliderValidation = type;
        },
        randomPoint(state, point){
            state.randomPoint.x = point.x;
            state.randomPoint.y = point.y;
        },
        token(state, token){
            state.token = token;
        }
    },
    actions: {
    }
};

export default loginModule;