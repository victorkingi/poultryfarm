function leapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}


export const inputEggs = (eggs) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const enteredDate = parseInt(eggs.date);
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        var prevMonth = month;
        var prevDate = enteredDate - 1;
        const a1 = parseInt(eggs['A 1']);
        const a2 = parseInt(eggs['A 2']);
        const b1 = parseInt(eggs['B 1']);
        const b2 = parseInt(eggs['B 2']);
        const c1 = parseInt(eggs['C 1']);
        const c2 = parseInt(eggs['C 2']);
        const mytotal = a1 + a2 + b1 + b2 + c1 + c2;
        var total = parseInt(mytotal);
        var trays = Math.floor(total / 30);
        var remainder = total % 30;


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
            firestore.collection('eggs').doc('Month ' + month + ' Date ' + enteredDate).get().then(function (doc) {
                if (doc.exists) {
                    dispatch({type: 'EGGS_DOC_EXISTS'});
                } else {
                    firestore.collection('trays').doc('Month ' + prevMonth + ' Date ' + prevDate).get().then(function (doc) {
                        if (doc.exists) {
                            const data = doc.data();
                            const remNum = parseInt(data.remainder);
                            const trayNum = parseInt(data.number);
                            const myTotal = total + remNum;
                            const myTrays = Math.floor(myTotal / 30);
                            const final = myTrays + trayNum;
                            const myRemainder = myTotal % 30;

                            firestore.collection('trays').doc('Month ' + month + ' Date ' + enteredDate).set({
                                number: final,
                                remainder: myRemainder,
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            }).then(() => {
                                doc.ref.delete().then(() => console.log("tray doc deleted"));
                            });

                            firestore.collection('eggs').doc('Month ' + month + ' Date ' + enteredDate).set({
                                ...eggs,
                                date: new Date(year, date.getMonth(), enteredDate),
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()

                            }).then(() => {
                                if (user.uid) {

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
                                dispatch({type: 'INPUT_EGGS_ERROR', err});
                            });

                        } else {

                            firestore.collection('trays').doc('Month ' + month + ' Date ' + enteredDate).set({
                                number: trays,
                                remainder: remainder,
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            });

                            firestore.collection('eggs').doc('Month ' + month + ' Date ' + enteredDate).set({
                                ...eggs,
                                date: new Date(year, date.getMonth(), enteredDate),
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()

                            }).then(() => {
                                if (user.uid) {

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
                                dispatch({type: 'INPUT_EGGS_ERROR', err});
                            });
                        }
                    })

                }
            });
        }
        collect();

    }
};