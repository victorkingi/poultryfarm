
export const inputEggs = (eggs) => {
    return (dispatch, getState, { getFirestore }) => {
        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const date = new Date();
        const month = date.getMonth()+1;
        const collect = () => {
            firestore.collection('eggs').doc('Month ' + month + ' Date ' + date.getDate()).get().then(function (doc) {
                if(doc.exists) {
                    dispatch({ type: 'EGGS_DOC_EXISTS'});
                } else {
                    firestore.collection('eggs').doc('Month ' + month + ' Date ' + date.getDate()).set({
                        ...eggs,
                        submittedBy: profile.firstName + ' ' + profile.lastName,
                        submittedOn: firestore.FieldValue.serverTimestamp()

                    }).then(() => {
                        dispatch({ type: 'INPUT_EGGS', eggs });
                    }).catch((err) => {
                        dispatch({ type: 'INPUT_EGGS_ERROR', err });
                    });
                }
            });
        }
        collect();

    }
};