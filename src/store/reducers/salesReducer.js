const initState = {

}

const salesReducer = (state = initState, action) => {
    switch (action.type) {
        case 'INPUT_SALES':
            console.log('sales data added', action.sales)
            return state;
        case 'SALES_DOC_EXISTS':
            window.location = '/';
            console.log('doc exists');
            window.alert('ERROR');
            return state;
        case 'INPUT_SALES_ERROR':
            window.location = '/';
            console.log('sales data error', action.err);
            window.alert("ERROR: " + action.err);
            return state;
        default:
            return state;
    }
}

export default salesReducer;
