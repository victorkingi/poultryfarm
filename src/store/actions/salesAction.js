
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