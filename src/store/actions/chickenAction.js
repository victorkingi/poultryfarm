//update the age of the birds accordingly
export const updateChickens = () => {
    return (dispatch, getState, {getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();
        const date = new Date()
        const startDate = new Date(2020, 2, 9, 12, 32, 45, 67);

        function weeksBetween(d1, d2) {
            return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
        }

        const weeks = weeksBetween(startDate, date);
        const months = weeks / 4;

        firestore.collection('chickenDetails').doc('2020').update({
            monthNo: months,
            weekNo: weeks
        })

    }
}

export const inputNews = (details) => {
    return (dispatch, getState, {getFirestore}) => {
        //make async call to database
        const firestore = getFirestore();

        firestore.collection("latestNews").doc("WZj6mDlVZMyVrCvPDOym").get().then(function (doc) {
            if (doc.exists) {
                doc.ref.set({
                    title: details.title,
                    content: details.content,
                    provider: details.provider,
                    link: details.link,
                    time: firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    dispatch({type: 'UPLOAD_DONE'});
                    window.alert("Data submitted");
                    window.location = '/';
                }).catch((err) => {
                    dispatch({type: 'UPLOAD_ERROR'});
                    window.alert("ERROR: " + err.message);
                    window.location = '/';
                })
            } else {
                const error = "Doc not found"
                dispatch({type: 'UPLOAD_ERROR', error});
                window.alert("ERROR");
                window.location = '/';
            }
        }).catch((err) => {
            dispatch({type: 'UPLOAD_ERROR'});
            window.alert("ERROR: " + err.message);
            window.location = '/';
        })

    }
}

export const sendTokenToServer = (token) => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const fullName = profile.firstName + ' ' + profile.lastName;
        const tokenDocRef = firestore.collection("notifyToken").doc(fullName);

        if (profile) {
            if (profile.firstName) {
                return firestore.runTransaction(function (transaction) {
                    return transaction.get(tokenDocRef).then(function (tokenDoc) {
                        if (tokenDoc.exists) {
                            const prevToken = tokenDoc.data().token;
                            if (token === prevToken) {
                                return Promise.reject("entered");
                            } else {
                                transaction.set(tokenDocRef, {
                                    token: token,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                })
                            }
                        } else {
                            transaction.set(tokenDocRef, {
                                token: token,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            })
                        }
                    })
                }).then(() => {
                    console.log("token sent");
                }).catch((err) => {
                    console.log(err);
                })
            }
        }
    }
}

/** checks if it is Sunday or the end of the month, if not does nothing, if so
 * creates new document in sales with the week's or month's profit
 **/
