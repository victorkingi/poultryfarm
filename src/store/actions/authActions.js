import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";

export const signIn = (credentials) => {
    return (dispatch, getState, {getFirebase}) => {
        setPerformanceStart();
        const firebase = getFirebase();

        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {

            dispatch({type: 'LOGIN_SUCCESS'})
        }).catch((err) => {
            dispatch({type: 'LOGIN_ERROR', err})
        });

        setPerformanceEnd('LOGIN_TIME');
    }
}

export const checkClaims = () => {
    return (dispatch, getState, {getFirebase}) => {
        setPerformanceStart();
        const firebase = getFirebase();

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                user.getIdTokenResult().then(idToken => {

                    if (idToken.claims.admin) {
                        dispatch({type: 'ADMIN_ACCESS'})
                    } else if (idToken.claims.moderator) {
                        dispatch({type: 'MOD_ACCESS'})
                    } else if (idToken.claims.changer) {
                        dispatch({type: 'CHANGER_ACCESS'})
                    } else {
                        dispatch({type: 'ADMIN_DENIED'})
                    }
                }).catch(err => {
                    dispatch({type: 'ADMIN_ERROR', err})
                })
            }
        });

        setPerformanceEnd('CHECK_CLAIMS_TIME');
    }
}


export const signOut = () => {
    return (dispatch, getState, { getFirebase}) => {
        setPerformanceStart();
        const firebase = getFirebase();

        firebase.auth().signOut(

        ).then(() => {
            dispatch({type: 'SIGN_OUT_SUCCESS'})
        }).catch((err) => {
            dispatch({type: 'SIGN_OUT_ERROR', err})
        });

        setPerformanceEnd('LOGOUT_TIME');
    }
}

export const signUp = (newUser) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        setPerformanceStart();
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then((resp) => {
                return firestore.collection('users').doc(resp.user.uid).set({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    initials: newUser.firstName[0] + newUser.lastName[0],
                    email: newUser.email
                })
            }).then(() => {
            dispatch({type: 'SIGNUP_SUCCESS'})
        })
            .catch(err => {
                dispatch({type: 'SIGNUP_ERROR', err})
            });

        setPerformanceEnd('SIGNUP_TIME');
    }
}

