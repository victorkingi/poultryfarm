export const hideBars = () => {
    return (dispatch) => {
        dispatch({type: 'HIDE_BARS'});
    }
}