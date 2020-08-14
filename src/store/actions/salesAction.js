function makeid(l) {
    var text = "";
    var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < l; i++) {
        text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    return text;
}

function leapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
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
        const enteredDate = parseInt(sales.date);
        const year = date.getFullYear();
        var prevMonth = month;
        var prevDate = enteredDate - 1;

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

            if (sales.section === "Old Chickens") {
                firestore.collection('sales').doc('Month ' + month + ' Date ' + enteredDate + ' ' + section).get().then(function (doc) {
                    if (doc.exists) {
                        const err = "ERROR: Doc exists";
                        dispatch({type: 'INPUT_SALES_ERROR', err});
                    } else {
                        firestore.collection('sales').doc('Month ' + month + ' Date ' + enteredDate + ' ' + section).set({
                            ...sales,
                            saleKey: key,
                            date: new Date(year, date.getMonth(), enteredDate),
                            submittedBy: profile.firstName + ' ' + profile.lastName,
                            submittedOn: firestore.FieldValue.serverTimestamp()
                        }).then(() => {

                            if (user.uid && status === "true") {
                                const total = parseInt(sales.chickenNo) * parseInt(sales.chickenPrice);

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
                                            saleKey: key,
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
                                            saleKey: key,
                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });
                                    }
                                });
                            } else if (user.uid && status === "false") {
                                const buyer = sales.buyerName ? sales.buyerName : null;
                                const total = parseInt(sales.chickenNo) * parseInt(sales.chickenPrice);

                                if (buyer == null) {
                                    firestore.collection('latePayment').add({
                                        amountDue: total,
                                        trayNo: sales.trayNo,
                                        saleKey: key,
                                        trayPrice: sales.trayPrice,
                                        date: new Date(year, date.getMonth(), enteredDate),
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
                                        date: new Date(year, date.getMonth(), enteredDate),
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
                });
            } else {

                firestore.collection('sales').doc('Month ' + month + ' Date ' + enteredDate + ' ' + section).get().then(function (doc) {
                    if (doc.exists) {
                        dispatch({type: 'SALES_DOC_EXISTS'});
                    } else {
                        const trays = parseInt(sales.trayNo);

                        firestore.collection('trays').where("number", ">", 0).get().then(function (query) {
                            query.forEach((doc) => {
                                if (doc.exists) {
                                    const trayNo = parseInt(doc.data().number);
                                    const final = trayNo - trays;

                                    if (final < 0) {
                                        const err = "ERROR: trays left cannot be negative";
                                        dispatch({type: 'INPUT_SALES_ERROR', err});
                                    } else {

                                        firestore.collection('trays').doc(doc.id).update({
                                            number: final,
                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });

                                        firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                            event: 'trays used',
                                            number: parseInt(trays),
                                            saleKey: key,
                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        })


                                        firestore.collection('sales').doc('Month ' + month + ' Date ' + enteredDate + ' ' + section).set({
                                            ...sales,
                                            saleKey: key,
                                            date: new Date(year, date.getMonth(), enteredDate),
                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()

                                        }).then(() => {
                                            const total = sales.trayNo * sales.trayPrice;

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
                                                            saleKey: key,
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
                                                            saleKey: key,
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
                                        }).then(() => {
                                            if (final === 0) {
                                                doc.ref.delete().then(() => console.log("trays are zero"));
                                            }

                                        }).catch((err) => {
                                            dispatch({type: 'INPUT_SALES_ERROR', err});
                                        });

                                    }
                                } else {
                                    const err = "ERROR: cannot make a sale with no eggs in store";
                                    dispatch({type: 'INPUT_SALES_ERROR', err});
                                }
                            })


                        });
                    }
                });
            }
        }
        collect();
    }
};