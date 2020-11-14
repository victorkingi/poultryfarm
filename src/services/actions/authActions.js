import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";

export const signIn = function(user, err) {
    return function(dispatch) {
        if (user === null) {
            dispatch({type: 'LOGIN_ERROR', err})
        } else {
            const _user = user?.user?.email;
            dispatch({type: 'LOGIN_SUCCESS', _user})
        }
    }
}

export const checkClaims = function() {
    return function(dispatch, getState, {getFirebase}) {
        setPerformanceStart();
        const firebase = getFirebase();

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {

                user.getIdTokenResult().then(function(idToken) {

                    if (idToken.claims.admin) {
                        dispatch({type: 'ADMIN_ACCESS'})
                    } else if (idToken.claims.moderator) {
                        dispatch({type: 'MOD_ACCESS'})
                    } else if (idToken.claims.changer) {
                        dispatch({type: 'CHANGER_ACCESS'})
                    } else {
                        dispatch({type: 'ADMIN_DENIED'})
                    }
                }).catch(function(err){
                    dispatch({type: 'ADMIN_ERROR', err})
                })
            }
        });

        setPerformanceEnd('CHECK_CLAIMS_TIME');
    }
}


export const signOut = function(){
    return function(dispatch, getState, {getFirebase}) {
        setPerformanceStart();
        const firebase = getFirebase();

        firebase.auth().signOut()
            .then(function() {
                dispatch({type: 'SIGN_OUT_SUCCESS'})
            }).catch(function(err) {
            dispatch({type: 'SIGN_OUT_ERROR', err})
        });

        setPerformanceEnd('LOGOUT_TIME');
    }
}

export const signUp = function(newUser) {
    return function(dispatch, getState, {getFirebase, getFirestore}){
        setPerformanceStart();
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(function(resp) {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        if (!user.displayName) {
                            user.updateProfile({
                                displayName: `${newUser.firstName} ${newUser.lastName}`
                            });
                        }
                    }
                });

                return firestore.collection('users').doc(resp.user.uid).set({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    initials: newUser.firstName[0] + newUser.lastName[0],
                    email: newUser.email
                })
            }).then((user) => {
            const _user = user.user.email;
            dispatch({type: 'SIGNUP_SUCCESS', _user})
        })
            .catch(err => {
                dispatch({type: 'SIGNUP_ERROR', err})
            });

        setPerformanceEnd('SIGNUP_TIME');
    }
}

