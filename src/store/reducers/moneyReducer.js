const initState = {}

const moneyReducer = (state = initState, action) => {
    switch (action.type) {
        case 'MONEY_SENT':
            console.log('money sent ', action.money);
            return state;

        case 'REPAID':
            console.log('borrow cleared ');
            window.alert("borrow balance cleared");
            return state;

        case 'OWE_OTHERS':
            console.log('balance ', action.details);
            window.alert("balance " + action.details);
            return state;

        case 'REPAID_ERROR':
            window.location = '/';
            console.log('borrow clearing error', action.error);
            window.alert("ERROR: ", action.error);
            return state;

        case 'BORROW_SUCCESS':
            console.log('money borrowed');
            return state;

        case 'BORROW_FAILED':
            window.location = '/';
            console.log('borrowing failed');
            window.alert('ERROR: ', action.err);
            return state;

        case 'LATE_REPAID':
            console.log('payment successful');
            return state;

        case 'LATE_ERROR':
            window.location = '/';
            console.log('error with payment');
            window.alert("error with payment");
            return state;
        case 'MONEY_ERROR':
            window.location = '/';
            console.log('error sending money', action.err);
            window.alert("ERROR: " + action.err);
            return state;
        case 'CLEAR_ERROR':
            window.location = '/';
            console.log('ERROR: Insufficient funds');
            window.alert("ERROR: Insufficient funds");
            return state;
        default:
            return state;
    }
}

export default moneyReducer;
