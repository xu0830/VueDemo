export default{
    sliderDragable(state, status){
        state.sliderDragable = status;
    },
    sliderDragDistance(state, distance){
        state.sliderDragDistance = distance - state.sliderInitX;
    },
    sliderInitX(state, distance){
        state.sliderInitX = distance;
    }
}