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

export const inputPurchase = (buys) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const enteredMonth = parseInt(buys.month);
        const newMonth = enteredMonth - 1;
        const section = buys.section;
        const key = makeid(28);
        const enteredDate = parseInt(buys.date);
        const year = date.getFullYear();
        const isLeap = leapYear(year);
        const status = JSON.parse(buys.status);
        const fullName = profile.firstName + ' ' + profile.lastName;
        const item = buys.itemName || buys.vaccineName || buys.drugName || buys.labourName;
        const buyDocRef = firestore.collection("buys").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section + ': ' + item);
        const currentDocRef = firestore.collection("current").doc(fullName);
        const bagsDocRef = firestore.collection("bags").doc("CurrentBags");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const oweJeffDocRef = firestore.collection("oweJeff").doc('Month ' + enteredMonth);
        const otherDebtDocRef = firestore.collection("otherDebt").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section + ': ' + item);
        const total = parseInt(buys.objectNo) * parseInt(buys.objectPrice);

        const dateChecks = (enteredMonth === 2 && (enteredDate > 28 || enteredDate < 1)) || (enteredMonth === 4
            && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 6 && (enteredDate > 30 || enteredDate < 1))
            || (enteredMonth === 9 && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 11
                && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 1 && (enteredDate > 31 || enteredDate < 1))
            || (enteredMonth === 3 && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 5
                && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 7 && (enteredDate > 31
                || enteredDate < 1)) || (enteredMonth === 8 && (enteredDate > 31 || enteredDate < 1))
            || (enteredMonth === 10 && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 12
                && (enteredDate > 31 || enteredDate < 1)) || (isLeap && enteredMonth === 2
                && (enteredDate > 29 || enteredDate < 1));


        if (dateChecks) {
            const error = "ERROR: Impossible date entered!";
            dispatch({type: 'INPUT_BUYING_ERROR', error});

            window.alert(error);
            window.location = '/';
            throw new Error("ERROR: Impossible date entered!");
        }

        return firestore.runTransaction(function (transaction) {

            return transaction.get(buyDocRef).then(function (buyDoc) {
                return transaction.get(currentDocRef).then(function (currentDoc) {
                    function commonTransactions() {
                        if (section === "Feeds") {
                            transaction.set(bagsDocRef, {
                                number: parseInt(buys.objectNo),
                                key: key,
                                counter: new Date(year, newMonth, enteredDate),
                                date: new Date(year, newMonth, enteredDate),
                                submittedBy: fullName,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            });
                        }

                        transaction.set(buyDocRef, {
                            ...buys,
                            key: key,
                            date: new Date(year, newMonth, enteredDate),
                            submittedBy: fullName,
                            submittedOn: firestore.FieldValue.serverTimestamp()
                        });
                    }

                    if (buyDoc.exists) {
                        return Promise.reject("ERROR: Data already exists!");
                    } else {
                        if (user.uid && status) {
                            if (currentDoc.exists) {
                                const currentData = currentDoc.data();
                                const currentTotal = parseInt(currentData.balance) - total;
                                const final = parseInt(currentTotal);

                                if (final < 0 && user.email !== "jeffkarue@gmail.com") {
                                    return Promise.reject("ERROR: Insufficient funds!");
                                } else if (final < 0 && user.email === "jeffkarue@gmail.com") {
                                    transaction.update(currentDocRef, {
                                        balance: 0,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });

                                    const newFinal = final * -1;

                                    if (oweJeffDocRef.exists) {

                                        transaction.update(oweJeffDocRef, {
                                            balance: firestore.FieldValue.increment(newFinal),
                                            submittedBy: fullName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });
                                    } else {

                                        transaction.set(oweJeffDocRef, {
                                            key: key,
                                            balance: newFinal,
                                            submittedBy: fullName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });
                                    }

                                    transaction.set(userLogRef, {
                                        event: 'purchase owe Jeff ' + buys.section,
                                        spent: newFinal,
                                        key: key,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });

                                    commonTransactions();

                                } else if (final === 0 || final > 0) {
                                    transaction.set(currentDocRef, {
                                        balance: final,
                                        fullName: profile.firstName + ' ' + profile.lastName,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });

                                    transaction.set(userLogRef, {
                                        event: 'purchase ' + buys.section,
                                        spent: total,
                                        key: key,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });

                                    commonTransactions();

                                }
                            } else {
                                throw new Error("Doc doesn't exist");
                            }
                        } else if (user.uid && !status) {
                            transaction.set(otherDebtDocRef, {
                                debtor: buys.section,
                                balance: total,
                                key: key,
                                date: new Date(year, newMonth, enteredDate),
                                submittedBy: fullName,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            });

                            commonTransactions();

                            transaction.set(userLogRef, {
                                event: 'purchase owe ' + buys.section,
                                spent: total,
                                key: key,
                                submittedBy: fullName,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            });
                        } else {
                            return Promise.reject("ERROR: Contact main admin for help!");
                        }
                    }
                })
            })

        }).then(() => {
            dispatch({type: 'INPUT_BUYING', buys});
            window.alert("Data Submitted");
            window.location = '/';

        }).catch(function (err) {
            const error = err.message || err;

            dispatch({type: 'INPUT_BUYING_ERROR', error});
            window.alert(error);
            window.location = '/';

        });
    }
}

export const updateBags = (state) => {
    return (dispatch, getState, {getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        let myBags = parseInt(state.bagNo);
        if (myBags < 1) {
            myBags = 0;
        }

        const bagRef = firestore.collection("bags").doc("CurrentBags");

        bagRef.update({
            number: myBags,
            counter: state.counter,
            submittedBy: profile.firstName + ' ' + profile.lastName,
            submittedOn: firestore.FieldValue.serverTimestamp()
        }).then(() => dispatch({type: 'BAGS_CHANGE'}))
            .catch((err) => console.log(err.message));
    }

};