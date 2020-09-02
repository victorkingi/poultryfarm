export const signIn = (credentials) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            dispatch({type: 'LOGIN_SUCCESS'})
        }).catch((err) => {
            dispatch({type: 'LOGIN_ERROR', err})
        });

    }
}

export const checkClaims = () => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                user.getIdTokenResult().then(idToken => {
                    if (idToken.claims.admin) {
                        dispatch({type: 'ADMIN_ACCESS'})
                    } else {
                        dispatch({type: 'ADMIN_DENIED'})
                    }
                }).catch(err => {
                    dispatch({type: 'ADMIN_ERROR', err})
                })
            }
        });
    }
}


export const signOut = () => {
    return (dispatch, getState, { getFirebase}) => {
        const firebase = getFirebase();

        firebase.auth().signOut(

        ).then(() => {
            dispatch({type: 'SIGN_OUT_SUCCESS'})
        }).catch((err) => {
            dispatch({type: 'SIGN_OUT_ERROR', err})
        });
    }
}

export const signUp = (newUser) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
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
            dispatch({ type: 'SIGNUP_SUCCESS' })
        })
            .catch(err => {
                dispatch({ type: 'SIGNUP_ERROR', err })
            });
    }
}

