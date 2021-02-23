importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");

firebase.initializeApp({
    messagingSenderId: ""
});

const messaging = firebase.messaging();
const firestore = firebase.firestore();

messaging.setBackgroundMessageHandler(function (payload) {
    return clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            const _data_title = payload.data?.title || payload.notification?.title;
            const _data_body = payload.data?.body || payload.notification?.body;
            const _data_image = payload.data?.image || payload.notification?.image || null;

            if (_data_title === `database export failed`) {
                firestore.doc('firestoreExport/status').set({
                    status: false,
                    submittedOn: firestore.FieldValue.serverTimestamp()
                }).catch((err) => {
                    console.error(err);
                })
            }

            if (_data_image !== null) {
                return registration.showNotification(_data_title, {
                    body: _data_body,
                    icon: 'chicken.jpg',
                    requireInteraction: true,
                    silent: false,
                    image: _data_image
                });
            } else {
                return registration.showNotification(_data_title, {
                    body: _data_body,
                    icon: 'chicken.jpg',
                    requireInteraction: true,
                    silent: false
                });
            }
        });
});

self.addEventListener('notificationclick', async function (event) {
    event.notification.close();
    const doc = await firestore.doc('firestoreExport/status').get();
    const value = doc.data().status;

    if (value === false) {
        clients.openWindow("https://console.firebase.google.com/u/0/project/poultry101-6b1ed/functions/logs?functionFilter=sch-weeklyChanges(us-central1)&search=&severity=DEBUG");
    }
    clients.openWindow("https://poultryfarm.web.app");
});