const initState = {
    authError: null,
    admin: false,
    moderator: false,
    changer: false
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
            return {
                ...state,
                admin: true
            }

        case 'MOD_ACCESS':
            return {
                ...state,
                moderator: true,
            }
        case 'CHANGER_ACCESS':
            return {
                ...state,
                changer: true
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

        case 'SIGN_OUT_ERROR':
            console.log('signout error');
            return state;

        case 'SIGN_OUT_SUCCESS':
            console.log('signed out');
            window.location = '/signin';
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
        case 'MY_ERROR':
            console.log('list not loaded', action.err.message);
            return {
                ...state,
                authError: action.err.message,
            }
        case 'LIST_ERROR':
            console.log('list error', action.all);
            return {
                ...state,
                authError: action.err.message,
            }
        case 'LIST_ACCESS':
            return {
                ...state,
                users: action.data,
            }

        default:
            return state;
    }
}

export default authReducer
