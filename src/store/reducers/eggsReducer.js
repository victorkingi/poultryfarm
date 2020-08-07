const initState = {

}

const eggsReducer = (state = initState, action) => {
    switch (action.type) {
        case 'INPUT_EGGS':
            console.log('eggs data added', action.eggs);
            window.alert("Data submitted");
            return state;
        case 'EGGS_DOC_EXISTS':
            console.log("egg doc exists");
            window.alert("ERROR");
            return state;
        case 'TRAY_DOC_EXISTS':
            console.log("Tray doc exists");
            window.alert("ERROR");
            return state;
        case 'INPUT_EGGS_ERROR':
            console.log('eggs data error', action.err);
            window.alert("ERROR: " + action.err);
            return state;
        default:
            return state;
    }
}

export default eggsReducer;
