export const inputBuys = (buys) => {
    return (dispatch, getState, { getFirestore }) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const date = new Date();
        const month = date.getMonth() + 1;
        const section = buys.section;
        const collect = () => {
            firestore.collection('buys').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).get().then(function (doc) {
                if (doc.exists) {
                    dispatch({type: 'BUYS_DOC_EXISTS'});
                } else {
                    firestore.collection('buys').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).set({
                        ...buys,
                        submittedBy: profile.firstName + ' ' + profile.lastName,
                        submittedOn: firestore.FieldValue.serverTimestamp()

                    }).then(() => {
                        const total = buys.objectNo * buys.objectPrice;

                        firestore.collection('current').doc('Month ' + month + ' Date ' + date.getDate()).get().then(function (doc) {
                            if (doc.exists) {
                                const data = doc.data();
                                const myTotal = data.totalEarned - total;

                                firestore.collection('current').doc('Month ' + month + ' Date ' + date.getDate()).set({
                                    totalEarned: myTotal,
                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                })

                            } else {
                                firestore.collection('current').doc('Month ' + month + ' Date ' + date.getDate()).set({
                                    totalEarned: total,
                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                })
                            }
                        });
                    }).then(() => {
                        dispatch({type: 'INPUT_BUYING', buys});
                    }).catch((err) => {
                        dispatch({type: 'INPUT_BUYING_ERROR', err});
                    });
                }
            });
        }
        collect();
    }
};