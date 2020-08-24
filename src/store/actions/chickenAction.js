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