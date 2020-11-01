const functions = require('firebase-functions');
const admin = require('firebase-admin');

const AllTopic = 'ALL_USERS';
const adminTopic = 'ADMIN_USERS';

function unsubscribeFromTopics(myToken, myTopic) {
    return admin.messaging().unsubscribeFromTopic(myToken, myTopic).then((response) => {
        return console.log('Successfully unsubscribed from topic: ', response);
    }).catch(err => {
        return console.error("error occurred unsubscribing, ", err)
    });
}

function subscribeToTopics(myToken, myTopic) {
    return admin.messaging().subscribeToTopic(myToken, myTopic).then((response) => {
        return console.log('Successfully subscribed to topic: ', response);
    }).catch(err => {
        return console.error("error occurred, ", err)
    });
}

exports.checkForNewFCMTokens = functions.firestore.document('notifyToken/{docId}/tokens/{tokenId}')
    .onCreate(async (snap, context) => {
        const batch = admin.firestore().batch();
        const countDocRef = admin.firestore().collection('notifyToken')
            .doc(context.params.docId).collection('tokens').doc('count');
        const email = snap.data().email;

        batch.update(countDocRef, {
            total: admin.firestore.FieldValue.increment(1),
            submittedOn: admin.firestore.FieldValue.serverTimestamp()
        });

        admin.auth().getUserByEmail(email).then((userRecord) => {
            if (userRecord.customClaims['admin']) {
                return subscribeToTopics(snap.data().token, adminTopic);
            }
            return null;
        }).catch((err) => {
            return console.error(err);
        });

        await subscribeToTopics(snap.data().token, AllTopic);
        return batch.commit();
    })

exports.unsubscribeOnDelete = functions.firestore.document('notifyToken/{docId}/tokens/{tokenId}')
    .onDelete(async (snap, context) => {
        const batch = admin.firestore().batch();
        const countDocRef = admin.firestore().collection('notifyToken')
            .doc(context.params.docId).collection('tokens').doc('count');
        const email = snap.data().email;

        batch.update(countDocRef, {
            total: admin.firestore.FieldValue.increment(-1),
            submittedOn: admin.firestore.FieldValue.serverTimestamp()
        });

        admin.auth().getUserByEmail(email).then((userRecord) => {
            if (userRecord.customClaims['admin']) {
                return unsubscribeFromTopics(snap.data().token, adminTopic);
            }
            return null;
        }).catch((err) => {
            return console.error(err);
        });

        await unsubscribeFromTopics(snap.data().token, AllTopic);

        return batch.commit();
    });
