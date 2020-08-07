function makeid(l) {
    var text = "";
    var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < l; i++) {
        text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    return text;
}

export const inputSales = (sales) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const key = makeid(28);
        const month = date.getMonth() + 1;
        const section = sales.section;
        const status = sales.status;
        const collect = () => {
            firestore.collection('sales').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).get().then(function (doc) {
                if (doc.exists) {
                    dispatch({type: 'SALES_DOC_EXISTS'});
                } else {
                    const trays = parseInt(sales.trayNo);

                    firestore.collection('trays').doc('Month ' + month + ' Date ' + date.getDate()).get().then(function (doc) {
                        if (doc.exists) {
                            const trayNo = parseInt(doc.data().number);
                            const final = trayNo - trays;

                            if (final < 0) {
                                const err = "ERROR: trays left cannot be negative";
                                dispatch({type: 'INPUT_SALES_ERROR', err});
                            } else {

                                firestore.collection('trays').doc('Month ' + month + ' Date ' + date.getDate()).update({
                                    number: final,
                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                });


                                firestore.collection('sales').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).set({
                                    ...sales,
                                    saleKey: key,
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
                                                saleKey: key,
                                                trayPrice: sales.trayPrice,
                                                section: sales.section,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            })
                                        } else {
                                            firestore.collection('latePayment').add({
                                                amountDue: total,
                                                trayNo: sales.trayNo,
                                                saleKey: key,
                                                trayPrice: sales.trayPrice,
                                                section: sales.section,
                                                buyer: buyer,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            })
                                        }
                                    }

                                }).then(() => {
                                    dispatch({type: 'INPUT_SALES', sales});
                                }).catch((err) => {
                                    dispatch({type: 'INPUT_SALES_ERROR', err});
                                });

                            }
                        } else {
                            const err = "ERROR: cannot make a sale with no eggs in store";
                            dispatch({type: 'INPUT_SALES_ERROR', err});
                        }
                    });
                }
            });
        }
        collect();
    }
};