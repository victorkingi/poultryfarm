function leapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

export const inputTray = (eggs) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const enteredMonth = parseInt(eggs.month);
        const newMonth = enteredMonth - 1;
        const enteredDate = parseInt(eggs.date);
        const year = date.getFullYear();
        const isLeap = leapYear(year);
        const eggDocRef = firestore.collection("eggs").doc('Month ' + enteredMonth + ' Date ' + enteredDate);
        const traysDocRef = firestore.collection("trays").doc("CurrentTrays");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const a1 = parseInt(eggs['A 1']);
        const a2 = parseInt(eggs['A 2']);
        const b1 = parseInt(eggs['B 1']);
        const b2 = parseInt(eggs['B 2']);
        const c1 = parseInt(eggs['C 1']);
        const c2 = parseInt(eggs['C 2']);
        const house = parseInt(eggs['house']);
        const myTotal = a1 + a2 + b1 + b2 + c1 + c2 + house;
        const total = parseInt(myTotal);

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
            const error = "ERROR: Impossible date entered";
            dispatch({type: 'INPUT_BUYING_ERROR', error});

            window.alert(error);
            window.location = '/';
            throw new Error("ERROR: Impossible date entered");
        }

        return firestore.runTransaction(function (transaction) {

            return transaction.get(eggDocRef).then(function (eggDoc) {
                return transaction.get(traysDocRef).then(function (trayDoc) {
                    if (eggDoc.exists) {
                        return Promise.reject("ERROR: Data already exists");
                    } else {
                        if (trayDoc.exists) {
                            const data = trayDoc.data();
                            const remNum = parseInt(data.remainder);
                            const trayNum = parseInt(data.number);
                            const myTotal = total + remNum;
                            const myTrays = Math.floor(myTotal / 30);
                            const final = myTrays + trayNum;
                            const myRemainder = myTotal % 30;

                            transaction.set(traysDocRef, {
                                number: final,
                                remainder: myRemainder,
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            })

                            transaction.set(eggDocRef, {
                                ...eggs,
                                date: new Date(year, newMonth, enteredDate),
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            })

                            if (user.uid) {

                                transaction.set(userLogRef, {
                                    event: 'eggs collected',
                                    total: total,
                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                });

                            } else {
                                return Promise.reject("ERROR: Contact admin for help");
                            }

                        } else {
                            return Promise.reject("ERROR: No tray doc found");
                        }
                    }
                })
            })
        }).then(() => {
            dispatch({type: 'INPUT_EGGS', eggs});
            window.alert("Data submitted");
            window.location = '/';
        }).catch((err) => {
            const error = err.message || err;
            dispatch({type: 'INPUT_EGGS_ERROR', error});

            window.alert(err);
            window.location = '/';
        })

    }
};
