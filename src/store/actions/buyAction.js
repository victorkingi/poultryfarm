export const inputBuys = (buys) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const month = date.getMonth() + 1;
        const section = buys.section;

        const collect = () => {
            firestore.collection('buys').doc('Month ' + month + ' Date '
                + date.getDate() + ' ' + section).get().then(function (doc) {
                if (doc.exists) {
                    dispatch({type: 'BUYS_DOC_EXISTS'});
                } else {
                    const total = parseInt(buys.objectNo) * parseInt(buys.objectPrice);

                    if (user.uid) {
                        firestore.collection('current').doc(user.uid).get()
                            .then(function (doc) {
                                if (doc.exists) {
                                    const data = doc.data();
                                    const myTotal = parseInt(data.balance) - total;
                                    const final = parseInt(myTotal);
                                    const err = "Insufficient funds";

                                    if (final < 0 && user.email !== "jeffkarue@gmail.com") {
                                        dispatch({type: 'INPUT_BUYING_ERROR', err});
                                    } else if (final < 0 && user.email === "jeffkarue@gmail.com") {
                                        firestore.collection('current').where("fullName", "==", "admin vicz").get().then(function (query) {
                                            query.forEach(function (doc) {
                                                const id = doc.id;
                                                const myBalance = parseInt(doc.data().balance);
                                                const myFinal = myBalance - total;

                                                if (myFinal < 0) {
                                                    dispatch({type: 'INPUT_BUYING_ERROR', err});
                                                } else {
                                                    firestore.collection('current').doc(id).set({
                                                        balance: myFinal,
                                                        fullName: "admin vicz",
                                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                                        submittedOn: firestore.FieldValue.serverTimestamp()

                                                    }).then(() => {
                                                        firestore.collection('buys').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).set({
                                                            ...buys,
                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()

                                                        })

                                                    }).then(() => {
                                                        firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                                            event: 'purchase used bank balance ' + buys.section,
                                                            spent: total,
                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });
                                                    }).then(() => {
                                                        dispatch({type: 'INPUT_BUYING', buys});
                                                    });
                                                }
                                            })
                                        }).catch((err) => {
                                            dispatch({type: 'INPUT_BUYING_ERROR', err});
                                        });
                                    } else {
                                        firestore.collection('buys').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).set({
                                            ...buys,
                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()

                                        }).then(() => {
                                            firestore.collection('current').doc(user.uid).set({
                                                balance: final,
                                                fullName: profile.firstName + ' ' + profile.lastName,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()

                                            });
                                        }).then(() => {
                                            firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                                event: 'purchase ' + buys.section,
                                                spent: total,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            });
                                        }).then(() => {
                                            dispatch({type: 'INPUT_BUYING', buys});

                                        }).catch((err) => {
                                            dispatch({type: 'INPUT_BUYING_ERROR', err});
                                        });
                                    }
                                }
                            });
                    }
                }
            });
        }
        collect();
    }
};