importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");
firebase.initializeApp({
    messagingSenderId: "921557433248"
});
const messaging = firebase.messaging();

//messaging.onMessage((payload) => console.log('Message received. ', payload));


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


            return registration.showNotification(_data_title, {
                actions: [
                    {action: 'Accept', title: 'Accept'},
                    {action: 'Reject', title: 'Reject'}
                ],
                body: _data_body,
                icon: 'chicken.jpg',
                requireInteraction: true,
                silent: false
            });
        });
});

function silentlyRejectClaims() {

}

function silentlyAcceptClaims() {
}

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'Accept') {
        silentlyAcceptClaims();
    } else if (event.action === 'Reject') {
        silentlyRejectClaims();
    } else {
        clients.openWindow("https://poultryfarm.web.app");
    }
});