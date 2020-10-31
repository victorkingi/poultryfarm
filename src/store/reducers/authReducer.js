export const initState = {
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
            try {
                localStorage.setItem('user', action._user);
            } catch (e) {
                console.log(e)
            }
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
            localStorage.clear();
            window.location.reload();
            return state;

        case 'SIGNUP_SUCCESS':
            console.log('signup success');
            window.alert("Your request will be reviewed and you will get a notification when complete." +
                "\nNB:- It might take upto 2 days");
            try {
                localStorage.setItem('user', action._user);
            } catch (e) {
                console.log(e)
            }
            return {
                ...state,
                authError: null
            };

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
