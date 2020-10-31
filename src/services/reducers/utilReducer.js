export const initialState = {
    hide: false
}

const utilReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'HIDE_BARS':
            return {
                hide: true
            }
        default:
            return state;
    }
}

export default utilReducer;