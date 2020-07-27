const initState = {
    authError: null,
    admin: false
}



const authReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOGIN_ERROR':
            console.log('login error')
            return {
                ...state,
                authError: 'Login failed'
            }
        case 'LOGIN_SUCCESS':
            console.log('login success');
            return {
                ...state,
                authError: null
            }

        case 'ADMIN_ACCESS':
            console.log("you are admin")
            return {
                ...state,
                admin: true
            }
        case 'ADMIN_DENIED':
            return {
                ...state,
                authError: null,
                admin: false
            }

        case 'ADMIN_ERROR':
            console.log('admin error', action.err.message);
            return {
                ...state,
                authError: action.err.message,
                admin: false
            }

        case 'SIGNOUT_ERROR':
            console.log('signout error');
            return state;

        case 'SIGNUP_SUCCESS':
            console.log('signup success');
            return state;

        case 'SIGNUP_ERROR':
            console.log('signup error', action.err.message);
            return {
                ...state,
                authError: action.err.message,
            }

        default:
            return state;
    }
}

export default authReducer
