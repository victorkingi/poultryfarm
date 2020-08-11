const initState = {

}

const buyReducer = (state = initState, action) => {
    switch (action.type) {
        case 'INPUT_BUYING':
            console.log('buying data added', action.buys);
            window.alert('Data submitted');
            return state;
        case 'BAGS_CHANGE':
            console.log('bags reduced');
            return state;
        case 'INPUT_BUYING_ERROR':
            console.log('buying data error', action.err);
            window.alert('ERROR: ' + action.err);
            return state;
        case 'BUYS_DOC_EXISTS':
            console.log('doc exists');
            window.alert('ERROR');
            return state;
        default:
            return state;
    }
}

export default buyReducer;
