const functions = require('firebase-functions');
const admin = require('firebase-admin');

const date = new Date();
const chickenDocRef = admin.firestore().collection("chickenDetails").doc("2020");

const createNotification = (notification => {
    return admin.firestore().collection('notifications')
        .add(notification)
        .then(doc => console.log('notification added', doc));
});

exports.updateBirdAge = functions.pubsub.schedule('every monday 04:00').onRun((() => {
    const startDate = new Date(2020, 2, 9, 12, 32, 45, 67);
    const batch = admin.firestore().batch();

    function weeksBetween(d1, d2) {
        return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
    }

    const weeks = weeksBetween(startDate, date);
    const months = weeks / 4;

    batch.update(chickenDocRef, {
        monthNo: months,
        weekNo: weeks
    });

    batch.commit().then(() => {
        return console.log("chicken age updated")
    })
        .catch((err) => {
            return console.error("chicken age error, ", err)
        });
}))


exports.balance = functions.firestore.document('current/{currentId}')
    .onUpdate((change) => {
        const current = change.after.data();
        return {
            content: 'Current Balance: ' + current.totalEarned,
            user: `${current.submittedBy}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        };
    });

exports.eggsCollected = functions.firestore.document('eggs/{eggId}')
    .onCreate(doc => {
        const egg = doc.data();
        const dateString = egg.date;
        const newDate = new Date(dateString);
        doc.ref.update({
            date: newDate
        }).then(() => {
            return console.log("date ok")
        })
            .catch((err) => {
                return console.error("date error, ", err)
            });
        const notification = {
            content: 'Collected Eggs!',
            user: `${egg.submittedBy}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createNotification(notification);
    });

exports.thikaFarmersDebt = functions.firestore.document('otherDebt/{debtId}')
    .onWrite(( (change) => {
        const data = change.after.exists ? change.after.data() : null;
        const prevData = change.before.data();
        //const debtorGet = prevData || data;
        const totalDoc = admin.firestore().collection('otherDebt').doc('TotalThikaFarmers');
        const batch = admin.firestore().batch();

        let amountCleared;

        if (prevData && data) {
            amountCleared = (parseInt(prevData.balance) - parseInt(data.balance)) * -1;
        } else if (prevData && !data) {
            amountCleared = parseInt(prevData.balance) * -1;
        } else {
            amountCleared = parseInt(data.balance);
        }
        batch.update(totalDoc, {
            submittedOn: admin.firestore.FieldValue.serverTimestamp(),
            total: admin.firestore.FieldValue.increment(amountCleared)
        });

        return batch.commit();
/*
        if (debtorGet.debtor) {
            if (debtorGet.debtor === "Feeds") {
                totalDoc.get().then((doc) => {
                    if (doc.exists) {
                        const amount = parseInt(doc.data().total);
                        if (amount < 0 && data) {
                            const notNegative = amount + parseInt(data.balance);

                            if (notNegative < 0) {
                                change.after.ref.update({
                                    balance: 0
                                });
                            } else {
                                change.after.ref.update({
                                    balance: notNegative
                                });
                            }
                        }

                    }
                    return null;
                }).then(() => {
                    return console.log("thika farmers updated")
                }).catch((err) => {
                    return console.log(err)
                });
            }
        }
        return null;*/
    }))
