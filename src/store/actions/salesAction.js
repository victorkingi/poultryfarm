
export const inputSales = (sales) => {
    return (dispatch, getState, { getFirestore }) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const date = new Date();
        const month = date.getMonth()+1;
        const section = sales.section;
        const collect = () => {
            firestore.collection('sales').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).get().then(function (doc) {
                if(doc.exists) {
                    dispatch({ type: 'SALES_DOC_EXISTS'});
                } else {
                    firestore.collection('sales').doc('Month ' + month + ' Date ' + date.getDate() + ' ' + section).set({
                        ...sales,
                        submittedBy: profile.firstName + ' ' + profile.lastName,
                        submittedOn: firestore.FieldValue.serverTimestamp()

                    }).then(() => {
                        const total = sales.trayNo ? (sales.trayNo * sales.trayPrice) : (sales.chickenNo * sales.chickenPrice);

                        firestore.collection('current').doc('Month ' + month + ' Date ' + date.getDate()).get().then(function (doc) {
                            if (doc.exists) {
                                const data = doc.data();
                                const myTotal = data.totalEarned + total;

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