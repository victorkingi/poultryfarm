
export const inputEggs = (eggs) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const month = date.getMonth() + 1;
        const collect = () => {
            firestore.collection('eggs').doc('Month ' + month + ' Date ' + date.getDate()).get().then(function (doc) {
                if (doc.exists) {
                    dispatch({type: 'EGGS_DOC_EXISTS'});
                } else {
                    firestore.collection('eggs').doc('Month ' + month + ' Date ' + date.getDate()).set({
                        ...eggs,
                        submittedBy: profile.firstName + ' ' + profile.lastName,
                        submittedOn: firestore.FieldValue.serverTimestamp()

                    }).then(() => {
                        if (user.uid) {
                            const a1 = parseInt(eggs['A 1']);
                            const a2 = parseInt(eggs['A 2']);
                            const b1 = parseInt(eggs['B 1']);
                            const b2 = parseInt(eggs['B 2']);
                            const c1 = parseInt(eggs['C 1']);
                            const c2 = parseInt(eggs['C 2']);
                            const total = a1 + a2 + b1 + b2 + c1 + c2;

                            firestore.collection('userLogs').doc(user.uid).set({dummy: 'dummy'});

                            firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                event: 'eggs collected',
                                total: total,
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            });

                        }
                    })
                        .then(() => {
                            dispatch({type: 'INPUT_EGGS', eggs});
                        }).catch((err) => {
                        dispatch({ type: 'INPUT_EGGS_ERROR', err });
                    });
                }
            });
        }
        collect();

    }
};