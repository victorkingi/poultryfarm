//const admin = require('react-admin-firebase');

export const inputSales = (sales) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const month = date.getMonth() + 1;
        const section = sales.section;
        const status = sales.status;
        const collect = () => {
            firestore.collection('sales').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).get().then(function (doc) {
                if (doc.exists) {
                    dispatch({type: 'SALES_DOC_EXISTS'});
                } else {
                    firestore.collection('sales').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).set({
                        ...sales,
                        submittedBy: profile.firstName + ' ' + profile.lastName,
                        submittedOn: firestore.FieldValue.serverTimestamp()

                    }).then(() => {
                        const total = sales.trayNo ? (sales.trayNo * sales.trayPrice) : (sales.chickenNo * sales.chickenPrice);

                        if (user.uid && status === "true") {
                            firestore.collection('current').doc(user.uid).get().then(function (doc) {
                                if (doc.exists) {
                                    const data = doc.data();
                                    const myTotal = parseInt(data.balance) + parseInt(total);
                                    const final = parseInt(myTotal);

                                    firestore.collection('current').doc(user.uid).set({
                                        balance: final,
                                        fullName: profile.firstName + ' ' + profile.lastName,
                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    })

                                    firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                        event: 'sale ' + sales.section,
                                        earned: parseInt(total),
                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });

                                } else {
                                    firestore.collection('current').doc(user.uid).set({
                                        balance: parseInt(total),
                                        fullName: profile.firstName + ' ' + profile.lastName,
                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    })

                                    firestore.collection('userLogs').doc(user.uid).set({dummy: 'dummy'});

                                    firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                        event: 'sale ' + sales.section,
                                        earned: parseInt(total),
                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });
                                }
                            });
                        } else if (user.uid && status === "false") {
                            const buyer = sales.buyerName ? sales.buyerName : null;

                            if (buyer == null) {
                                firestore.collection('latePayment').add({
                                    amountDue: total,
                                    trayNo: sales.trayNo,
                                    trayPrice: sales.trayPrice,
                                    section: sales.section,
                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                })
                            } else {
                                firestore.collection('latePayment').add({
                                    amountDue: total,
                                    trayNo: sales.trayNo,
                                    trayPrice: sales.trayPrice,
                                    section: sales.section,
                                    buyer: buyer,
                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                })
                            }
                        }

                    }).then(() => {
                        dispatch({ type: 'INPUT_SALES', sales });
                    }).catch((err) => {
                        dispatch({ type: 'INPUT_SALES_ERROR', err });
                    });
                }
            });
        }
        collect();

    }
};