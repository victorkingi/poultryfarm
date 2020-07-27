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