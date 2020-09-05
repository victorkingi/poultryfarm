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

export const inputSell = (sales) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const enteredMonth = parseInt(sales.month);
        const newMonth = enteredMonth - 1;
        const section = sales.section;
        const key = makeid(28);
        const enteredDate = parseInt(sales.date);
        const year = date.getFullYear();
        const isLeap = leapYear(year);
        const status = JSON.parse(sales.status);
        const buyer = sales.buyerName ? sales.buyerName : sales.section;
        const salesDocRef = buyer ? firestore.collection("sales").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section + ': ' + buyer) : firestore.collection("sales").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section);
        const currentDocRef = firestore.collection("current").doc(user.uid);
        const traysDocRef = firestore.collection("trays").doc("CurrentTrays");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const latePaymentDocRef = buyer ? firestore.collection("latePayment").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section + ': ' + buyer) : firestore.collection("latePayment").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section);

        const total = sales.trayNo ? parseInt(sales.trayNo) * parseInt(sales.trayPrice) : parseInt(sales.chickenNo) * parseInt(sales.chickenPrice);

        const dateCheck = (enteredMonth === 2 && (enteredDate > 28 || enteredDate < 1)) || (enteredMonth === 4
            && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 6 && (enteredDate > 30 || enteredDate < 1))
            || (enteredMonth === 9 && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 11
                && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 1 && (enteredDate > 31 || enteredDate < 1))
            || (enteredMonth === 3 && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 5
                && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 7 && (enteredDate > 31
                || enteredDate < 1)) || (enteredMonth === 8 && (enteredDate > 31 || enteredDate < 1))
            || (enteredMonth === 10 && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 12
                && (enteredDate > 31 || enteredDate < 1)) || (isLeap && enteredMonth === 2
                && (enteredDate > 29 || enteredDate < 1));


        if (dateCheck) {
            const error = "ERROR: Impossible date entered!";
            dispatch({type: 'INPUT_BUYING_ERROR', error});

            window.alert(error);
            window.location = '/';
            throw new Error("ERROR: Impossible date entered!");
        }

        firestore.collection("current").where("fullName", "==", "Jeff Karue").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                const currentJeffRef = firestore.collection("current").doc(doc.id);

                return firestore.runTransaction(function (transaction) {

                    return transaction.get(salesDocRef).then(function (salesDoc) {
                        return transaction.get(currentDocRef).then(function (currentDoc) {
                            return transaction.get(traysDocRef).then(function (traysDoc) {
                                function commonTransaction() {
                                    if (traysDoc.exists) {
                                        const trayData = traysDoc.data().number;
                                        const final = parseInt(trayData) - parseInt(sales.trayNo);

                                        if (final === 0 || final > 0) {
                                            transaction.update(traysDocRef, {
                                                number: final,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            })

                                        } else {
                                            return Promise.reject("ERROR: Not enough trays in store!");
                                        }
                                    }
                                }

                                if (salesDoc.exists) {
                                    return Promise.reject("ERROR: Data already exists!");
                                } else {
                                    if (user.uid && status) {
                                        if (currentDoc.exists) {

                                            if (sales.trayNo) {
                                                commonTransaction();
                                            }

                                            transaction.set(salesDocRef, {
                                                ...sales,
                                                key: key,
                                                date: new Date(year, newMonth, enteredDate),
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            });

                                            if (section === "Simbi") {
                                                transaction.update(currentJeffRef, {
                                                    balance: firestore.FieldValue.increment(total),
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                });

                                            } else {

                                                transaction.update(currentDocRef, {
                                                    balance: firestore.FieldValue.increment(total),
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                });

                                            }

                                            transaction.set(userLogRef, {
                                                event: 'sale ' + sales.section + ' to ' + buyer,
                                                earned: total,
                                                key: key,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            });
                                        } else {
                                            return Promise.reject("ERROR: Document doesn't exist!");
                                        }
                                    } else if (user.uid && !status) {

                                        if (sales.trayNo) {
                                            commonTransaction();

                                            transaction.set(latePaymentDocRef, {
                                                amountDue: total,
                                                trayNo: sales.trayNo,
                                                key: key,
                                                trayPrice: sales.trayPrice,
                                                date: new Date(year, newMonth, enteredDate),
                                                section: sales.section,
                                                buyer: buyer,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            })

                                            transaction.set(salesDocRef, {
                                                ...sales,
                                                key: key,
                                                date: new Date(year, newMonth, enteredDate),
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            });

                                        } else if (sales.chickenNo) {
                                            transaction.set(latePaymentDocRef, {
                                                amountDue: total,
                                                chickenNo: sales.chickenNo,
                                                key: key,
                                                chickenPrice: sales.chickenPrice,
                                                date: new Date(year, newMonth, enteredDate),
                                                section: sales.section,
                                                buyer: buyer,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            })
                                        } else {
                                            return Promise.reject("ERROR: Contact main admin for help!");
                                        }

                                    } else {
                                        return Promise.reject("ERROR: Contact main admin for help!");
                                    }
                                }
                            })
                        })
                    })
                }).then(() => {
                    dispatch({type: 'INPUT_SALES', sales});
                    window.alert("Data Submitted");
                    window.location = '/';

                }).catch((err) => {
                    const error = err.message || err;
                    dispatch({type: 'INPUT_SALES_ERROR', error});

                    window.alert(error);
                    window.location = '/';
                });
            })
        })

    }
}