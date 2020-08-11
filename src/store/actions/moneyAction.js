export const inputMoney = (money) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const receiver = money.receiver;
        const amount = parseInt(money.amount);
        var receiverUID = undefined;
        var receiverName = undefined;

        firestore.collection('users').where("email", "==", receiver).get()
            .then(function (query) {
                query.forEach(function (doc) {
                    receiverUID = doc.id;
                    receiverName = doc.data().firstName + " " + doc.data().lastName;

                    if (money) {
                        const collect = () => {
                            if (user.uid) {
                                firestore.collection('current').doc(user.uid).get().then(function (doc) {
                                    if (doc.exists) {
                                        const data = doc.data();
                                        const senderNewBalance = data.balance - amount;
                                        const senderFinalBalance = parseInt(senderNewBalance);
                                        const error = 'balance less than 0';

                                        if (senderFinalBalance < 0) {
                                            dispatch({type: 'MONEY_ERROR', error});
                                        } else {
                                            firestore.collection('current').doc(user.uid).set({
                                                balance: senderFinalBalance,
                                                fullName: profile.firstName + ' ' + profile.lastName,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            });

                                            firestore.collection('userLogs').doc(user.uid).set({dummy: 'dummy'});

                                            firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                                event: 'sent money to ' + receiver,
                                                amount: parseInt(amount),
                                                fullName: profile.firstName + ' ' + profile.lastName,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            });

                                            if (receiverUID) {
                                                firestore.collection('current').doc(receiverUID).get().then(function (doc) {
                                                    if (doc.exists) {
                                                        const data = doc.data();
                                                        const receiverNewBalance = data.balance + amount;
                                                        const receiverFinalBalance = parseInt(receiverNewBalance);

                                                        firestore.collection('current').doc(receiverUID).set({
                                                            balance: receiverFinalBalance,
                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                            fullName: receiverName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });

                                                        firestore.collection('userLogs').doc(receiverUID).set({dummy: 'dummy'});

                                                        firestore.collection('userLogs').doc(receiverUID).collection('logs').add({
                                                            event: 'received money from ' + user.email,
                                                            amount: parseInt(amount),
                                                            fullName: receiverName,
                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });
                                                    } else {
                                                        const emptyBalance = parseInt(amount);

                                                        firestore.collection('current').doc(receiverUID).set({
                                                            balance: emptyBalance,
                                                            fullName: receiverName,
                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });

                                                        firestore.collection('userLogs').doc(receiverUID).set({dummy: 'dummy'});

                                                        firestore.collection('userLogs').doc(receiverUID).collection('logs').add({
                                                            event: 'received money from ' + user.email,
                                                            amount: emptyBalance,
                                                            fullName: receiverName,
                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        collect();
                    }

                })
            }).then(() => {
            dispatch({type: 'MONEY_SENT', money});
        })
            .catch((err) => {
                dispatch({type: 'MONEY_ERROR', err});
            });
    }
}

export const latePays = (details) => {

    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        const profile = getState().firebase.profile;
        const user = firebase.auth().currentUser;
        const buy = details.buyer ? (details.section + ": " + details.buyer) : details.section;


        firestore.collection('latePayment').where("saleKey", "==", details.saleKey).get()
            .then(function (query) {

                query.forEach(function (myDoc) {

                    firestore.collection('current').doc(user.uid).get().then(function (doc) {
                        if (doc.exists) {
                            const data = doc.data();
                            const total = data.balance;
                            const final = parseInt(total) + parseInt(details.amountDue);


                            firestore.collection('current').doc(user.uid).set({
                                balance: final,
                                fullName: profile.firstName + ' ' + profile.lastName,
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()

                            }).then(() => {
                                firestore.collection('sales').where("saleKey", "==", details.saleKey).get()
                                    .then(function (query) {
                                        query.forEach(function () {
                                            const thing = query.docs[0];
                                            const newVal = true;
                                            thing.ref.update({status: newVal}).then(() => console.log("complete "));
                                        })
                                    })
                            })

                            firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                event: 'late payment from ' + buy,
                                earned: parseInt(details.amountDue),
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            });

                        } else {
                            const myFinal = parseInt(details.amountDue);

                            firestore.collection('current').doc(user.uid).set({
                                balance: myFinal,
                                fullName: profile.firstName + ' ' + profile.lastName,
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()

                            });

                            firestore.collection('sales').where("section", "==", details.section).where("trayNo",
                                "==", details.trayNo).where("trayPrice", "==", details.trayPrice)
                                .get()
                                .then(function (query) {
                                    query.forEach(function (doc) {
                                        doc.update({
                                            status: true
                                        })
                                    });
                                })
                            firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                event: 'late payment from ' + buy,
                                earned: parseInt(details.amountDue),
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            });
                        }
                    }).then(() => {
                        myDoc.ref.delete().then(() => console.log("payment made"));
                    })

                })
            }).then(() => {
            dispatch({type: 'LATE_REPAID'});
        })
            .catch((err) => {
                dispatch({type: 'LATE_ERROR', err});
            })
    }
}

export const clearedDebt = (details) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        const profile = getState().firebase.profile;
        const user = firebase.auth().currentUser;
        const month = new Date().getMonth() + 1;

        firestore.collection('current').doc(user.uid).get().then(function (doc) {
            if (doc.exists) {
                const data = doc.data();
                const final = parseInt(data.balance) - parseInt(details.balance);

                if (final < 0) {
                    firestore.collection('current').where("fullName", "==", "Bank Account").get()
                        .then(function (query) {
                            query.forEach(function (doc) {
                                const data = doc.data();
                                const myFinal = parseInt(data.balance) - parseInt(details.balance);

                                if (myFinal < 0) {
                                    firestore.collection('oweJeff').doc("Month " + month).get().then(function (doc) {
                                        if (doc.exists) {
                                            const data = doc.data();
                                            const fin = parseInt(data.balance) + parseInt(details.balance);

                                            doc.ref.update({balance: fin}).then(() => console.log("owing jeff updated"));
                                        }
                                    }).then(() => {
                                        firestore.collection('sales').where("buyKey", "==", details.buyKey).get().then(function (query) {
                                            query.forEach(function (doc) {
                                                doc.ref.update({status: true}).then(() => {
                                                    firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                                        event: 'balance cleared of ' + details.debter,
                                                        amount: parseInt(details.balance),
                                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                                    })
                                                });
                                            });
                                        });
                                    })
                                } else {
                                    doc.ref.update({
                                        balance: myFinal,
                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    }).then(() => console.log("bank balance updated"));

                                    firestore.collection('sales').where("buyKey", "==", details.buyKey).get().then(function (query) {
                                        query.forEach(function (doc) {
                                            doc.ref.update({status: true}).then(() => {
                                                firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                                    event: 'balance cleared of ' + details.debter,
                                                    amount: parseInt(details.balance),
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                })
                                            });
                                        });
                                    });
                                }
                            })
                        })
                } else {
                    doc.ref.update({
                        balance: final,
                        submittedBy: profile.firstName + ' ' + profile.lastName,
                        submittedOn: firestore.FieldValue.serverTimestamp()
                    }).then(() => console.log("user balance updated"));

                    firestore.collection('sales').where("buyKey", "==", details.buyKey).get().then(function (query) {
                        query.forEach(function (doc) {
                            doc.ref.update({status: true}).then(() => {
                                firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                    event: 'balance cleared of ' + details.debter,
                                    amount: parseInt(details.balance),
                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                })
                            });
                        });
                    }).then(() => {
                        firestore.collection('otherDebt').where("buyKey", "==", details.buyKey).get().then(function (query) {
                            query.forEach(function (doc) {
                                doc.ref.delete().then(() => console.log("deleted respective debt"));
                            })
                        })
                    });
                }
            }
        })

    }
}

export const updateBankBalance = () => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const profile = getState().firebase.profile;


        firestore.collection('current').where("fullName", "==", "Bank Account").get().then(function (query) {
            query.forEach(function (doc) {
                const balance = doc.data().balance;

                if (balance > 0) {
                    firestore.collection('oweJeff').where("balance", ">", 0).get().then(function (querySnap) {
                        querySnap.forEach(function (mydoc) {
                            const debt = mydoc.data().balance;
                            const final = balance - debt;

                            if (final >= 0) {
                                mydoc.ref.delete().then(() => console.log("deleted"));
                                doc.ref.update({balance: final}).then(() => console.log("current changed"));

                                firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                    event: 'all debt paid off',
                                    amount: parseInt(debt),
                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                });

                            } else {
                                const myBalance = final * -1;
                                mydoc.ref.update({balance: myBalance}).then(() => console.log("complete "));
                                doc.ref.update({balance: 0}).then(() => console.log("current now 0"));

                                firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                    event: 'some debt paid off',
                                    amount: parseInt(debt),
                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                });
                            }

                        })
                    })
                }
            })
        }).then(() => {
            dispatch({type: 'UPDATE'});
        })
    }
}

export const updateBorrow = (details) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const profile = getState().firebase.profile;
        const date = new Date();
        const month = date.getMonth() + 1;


        firestore.collection('borrow').doc('Month ' + month + ' Date ' + date.getDate()).get().then((doc) => {
            if (doc.exists) {
                const err = "Doc exists"
                dispatch({type: 'BORROW_FAILED', err});
            } else {
                firestore.collection('borrow').doc('Month ' + month + ' Date ' + date.getDate()).set({
                    borrowAmount: details.borrowAmount,
                    borrower: details.borrower,
                    purpose: details.purpose,
                    submittedBy: profile.firstName + ' ' + profile.lastName,
                    submittedOn: firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    firestore.collection('current').doc(user.uid).get().then((doc) => {
                        if (doc.exists) {
                            const data = doc.data();
                            const balance = parseInt(data.balance);
                            const final = balance - parseInt(details.borrowAmount);

                            if (final < 0) {
                                const err = "Insufficient funds to borrow money";
                                dispatch({type: 'BORROW_FAILED', err});
                            } else {
                                doc.ref.update({
                                    balance: final,
                                    submittedOn: firestore.FieldValue.serverTimestamp(),
                                    submittedBy: profile.firstName + ' ' + profile.lastName
                                }).then(() => console.log("updated current after borrowing"))
                            }
                        }
                    })

                }).then(() => {
                    dispatch({type: 'BORROW_SUCCESS'});
                })

            }

        });
    }
}