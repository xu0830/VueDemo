export default{
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
}