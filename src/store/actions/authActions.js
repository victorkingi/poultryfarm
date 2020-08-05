import React from "react";

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

export const listUsers = () => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const email = user.email;

        /*firestore.collection('users').get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
            })
        }).catch((err) => {
            dispatch({type: 'MY_ERROR', err});
        });*/

        firestore.collection('users')
            .where("email", ">", email).get()
            .then(function (query) {
                query.forEach(function (doc) {
                    const id = doc.id;
                    dispatch({type: 'LIST_ACCESS', id});
                })
            })
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
            dispatch({ type: 'SIGNOUT_SUCCESS'})
        }).catch((err) => {
            dispatch({ type: 'SIGNOUT_ERROR', err })
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

