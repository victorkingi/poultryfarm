const initState = {}

const moneyReducer = (state = initState, action) => {
    switch (action.type) {
        case 'MONEY_SENT':
            console.log('money sent ', action.money);
            window.alert("money sent");
            return state;

        case 'UPDATE':
            console.log('updated');
            return state;

        case 'BORROW_SUCCESS':
            console.log('money borrowed');
            console.log('Money borrowed successfully');
            return state;

        case 'BORROW_FAIL':
            console.log('borrowing failed');
            window.alert('ERROR: ', action.err);
            return state;

        case 'LATE_REPAID':
            console.log('payment successful');
            window.alert("payment successful");
            return state;
        case 'LATE_ERROR':
            console.log('error with payment');
            window.alert("error with payment");
            return state;
        case 'MONEY_ERROR':
            console.log('error sending money', action.err);
            window.alert("ERROR: " + action.err);
            return state;
        default:
            return state;
    }
}

export default moneyReducer;
