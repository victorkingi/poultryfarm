function leapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}


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
        var prevMonth = month;
        var prevDate = date.getDate() - 1;

        if (prevDate === 0) {
            if (month === 2 || month === 4 || month === 6 || month === 8 || month === 9 || month === 11 || month === 1) {
                prevDate = 31;
                if (month === 1) {
                    prevMonth = 12;
                } else {
                    prevMonth = month - 1;
                }
            } else if (month === 3) {
                if (leapYear(new Date().getFullYear())) {
                    prevDate = 29;
                } else {
                    prevDate = 28;
                }
                prevMonth = 2;
            } else {
                prevDate = 30;
                if (month === 1) {
                    prevMonth = 12;
                } else {
                    prevMonth = month - 1;
                }
            }
        }

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

                                        firestore.collection('current').where("fullName", "==", "Bank Account").get().then(function (query) {
                                            query.forEach(function (doc) {
                                                const id = doc.id;
                                                const myBalance = parseInt(doc.data().balance);
                                                const myFinal = myBalance - total;

                                                if (myFinal < 0) {
                                                    firestore.collection('oweJeff').doc("Month " + month).get().then((doc) => {
                                                        if (doc.exists) {
                                                            const balance = parseInt(doc.data().balance);
                                                            const myInt = total + balance;

                                                            firestore.collection('oweJeff').doc("Month " + month).set({
                                                                balance: myInt,
                                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            }).then(() => {
                                                                firestore.collection('buys').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).set({
                                                                    ...buys,
                                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                    submittedOn: firestore.FieldValue.serverTimestamp()

                                                                }).then(() => {
                                                                    if (buys.section === "Feeds") {
                                                                        firestore.collection('bags').doc('Month ' + prevMonth + ' Date ' + prevDate).get().then(
                                                                            function (doc) {
                                                                                if (doc.exists) {

                                                                                    firestore.collection('bags').doc('Month ' + month + ' Date ' + date.getDate()).set({
                                                                                        number: buys.objectNo,
                                                                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                                                                    });

                                                                                    doc.ref.delete().then(() => console.log("bag doc deleted"));
                                                                                } else {
                                                                                    firestore.collection('bags').doc('Month ' + month + ' Date ' + date.getDate()).set({
                                                                                        number: buys.objectNo,
                                                                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                                                                    });
                                                                                }
                                                                            }
                                                                        )
                                                                    }
                                                                });
                                                            }).then(() => {

                                                                firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                                                    event: 'purchase owe Jeff ' + buys.section,
                                                                    spent: total,
                                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                                });
                                                            }).catch((err) => {
                                                                dispatch({type: 'INPUT_BUYING_ERROR', err});
                                                            });


                                                        } else {

                                                            firestore.collection('oweJeff').doc("Month " + month).set({
                                                                balance: total,
                                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            }).then(() => {

                                                                firestore.collection('buys').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).set({
                                                                    ...buys,
                                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                    submittedOn: firestore.FieldValue.serverTimestamp()

                                                                }).catch((err) => {
                                                                    dispatch({type: 'INPUT_BUYING_ERROR', err});
                                                                });


                                                            }).then(() => {


                                                                firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                                                    event: 'purchase owe Jeff ' + buys.section,
                                                                    spent: total,
                                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                                }).catch((err) => {
                                                                    dispatch({type: 'INPUT_BUYING_ERROR', err});
                                                                });


                                                            }).then(() => {
                                                                dispatch({type: 'INPUT_BUYING', buys});
                                                            }).catch((err) => {
                                                                dispatch({type: 'INPUT_BUYING_ERROR', err});
                                                            });
                                                        }
                                                    }).catch((err) => {
                                                        dispatch({type: 'INPUT_BUYING_ERROR', err});
                                                    });
                                                } else {
                                                    firestore.collection('current').doc(id).set({
                                                        balance: myFinal,
                                                        fullName: "Bank Account",
                                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                                        submittedOn: firestore.FieldValue.serverTimestamp()

                                                    }).then(() => {
                                                        firestore.collection('buys').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).set({
                                                            ...buys,
                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()

                                                        });

                                                    }).then(() => {
                                                        firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                                            event: 'purchase used bank balance ' + buys.section,
                                                            spent: total,
                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });
                                                    })
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
                                            if (buys.section === "Feeds") {
                                                firestore.collection('bags').doc('Month ' + month + ' Date ' + date.getDate()).set({
                                                    number: buys.objectNo,
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                });
                                            }

                                        }).then(() => {
                                            dispatch({type: 'INPUT_BUYING', buys});

                                        }).catch((err) => {
                                            dispatch({type: 'INPUT_BUYING_ERROR', err});
                                        });
                                    }
                                } else {
                                    const err = "No account found"
                                    dispatch({type: 'INPUT_BUYING_ERROR', err});
                                }
                            }).catch((err) => {
                            dispatch({type: 'INPUT_BUYING_ERROR', err});
                        });
                    }
                }
            }).catch((err) => {

                if (err) {
                    dispatch({type: 'INPUT_BUYING_ERROR', err});
                } else {
                    dispatch({type: 'INPUT_BUYING', buys});
                }

            });
        }
        collect();
    }
};

export const updateBags = (details) => {
    return (dispatch, getState, {getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();

        firestore.collection('bags').where("submittedOn", "==", details.submittedOn).get().then(function (query) {
            query.forEach(function (doc) {
                doc.ref.update({number: details.bagNo}).then(() => console.log("bagNo changed"));
            });
        }).catch((err) => {
            console.log(err.message);
        })

    }
};