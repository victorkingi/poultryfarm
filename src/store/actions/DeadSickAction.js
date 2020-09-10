function leapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

export const inputDeadSick = (deadSick, image) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to database

        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const enteredMonth = parseInt(deadSick.month);
        const newMonth = enteredMonth - 1;
        const section = deadSick.section;
        const place = deadSick.place;
        const enteredDate = parseInt(deadSick.date);
        const year = date.getFullYear();
        const isLeap = leapYear(year);
        const deadSickDocRef = firestore.collection("deadSick").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section);
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const chickenDocRef = firestore.collection("chickenDetails").doc("2020");

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

        const storageRef = firebase.storage().ref();

        const uploadImagesRef = storageRef.child(`deadSick/${image.name}`);

        const uploadTask = uploadImagesRef.put(image);


        uploadTask.then(function (snapshot) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress + " %");
        }).then(() => {
            firebase.storage().ref()
                .child(`deadSick/${image.name}`)
                .getDownloadURL()
                .then((url) => {
                    return firestore.runTransaction(function (transaction) {
                        return transaction.get(deadSickDocRef).then(function (deadSickDoc) {
                            return transaction.get(chickenDocRef).then(function (chickenDoc) {
                                if (deadSickDoc.exists) {
                                    return Promise.reject("ERROR: Data already exists!");
                                } else {

                                    if (section === "Dead" && chickenDoc.exists) {

                                        if (place === "Cage") {
                                            const num = parseInt(chickenDoc.data().cage);
                                            const newNum = num - 1;
                                            transaction.update(chickenDocRef, {
                                                cage: newNum
                                            })
                                        } else if (place === "House") {
                                            const num = parseInt(chickenDoc.data().house);
                                            const newNum = num - 1;
                                            transaction.update(chickenDocRef, {
                                                house: newNum
                                            })
                                        }

                                        const data = parseInt(chickenDoc.data().total);
                                        const final = data - 1;

                                        if (final < 0) {
                                            throw new Error("ERROR: No more chickens left!");
                                        } else {
                                            transaction.update(chickenDocRef, {
                                                total: final,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            })
                                        }

                                    }

                                    transaction.set(deadSickDocRef, {
                                        ...deadSick,
                                        photoURL: url,
                                        date: new Date(year, newMonth, enteredDate),
                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()

                                    })

                                    transaction.set(userLogRef, {
                                        event: deadSick.section + " Chicken",
                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    })
                                }
                            })
                        })
                    }).then(() => {
                        dispatch({type: 'UPLOAD_DONE'});
                        window.alert("Data submitted");
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
