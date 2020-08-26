
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


export const handleToken = () => {

    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        const messaging = firebase.messaging();

        // [START get_messaging_object]
        // Retrieve Firebase Messaging object.

        // [END get_messaging_object]
        // [START set_public_vapid_key]
        // Add the public key generated from the console here.
        //  messaging.usePublicVapidKey("BNkQ-HrKdgBl63_vBLkxkVlhfRZyyHvuaSUjWCxp4GyJMNYNvqI6u0jlNAHW_od7b01MuwawpGMM0UO4xC0Mkts");
        // [END set_public_vapid_key]

        // [START refresh_token]
        // Callback fired if Instance ID token is updated.
        requestPermission();

        messaging.onTokenRefresh(() => {
            messaging.getToken().then((refreshedToken) => {
                console.log('Token refreshed.');
                // Indicate that the new Instance ID token has not yet been sent to the
                // app server.
                setTokenSentToServer(false);
                // Send Instance ID token to app server.
                sendTokenToServer(refreshedToken);
                // [START_EXCLUDE]
                // Display new Instance ID token and clear UI of all previous messages.
            }).catch((err) => {
                console.log('Unable to retrieve refreshed token ', err);
            });
        });
        // [END refresh_token]

        // [START receive_message]
        // Handle incoming messages. Called when:
        // - a message is received while the app has focus
        // - the user clicks on an app notification created by a service worker
        //   `messaging.setBackgroundMessageHandler` handler.
        messaging.onMessage((payload) => {
            console.log('Message received. ', payload);
            // [START_EXCLUDE]
            // Update the UI to include the received message.
            // [END_EXCLUDE]
        });
        // [END receive_message]

        // Send the Instance ID token your application server, so that it can:
        // - send messages back to this app
        // - subscribe/unsubscribe the token from topics
        function sendTokenToServer() {
            if (!isTokenSentToServer()) {
                console.log('Sending token to server...');
                setTokenSentToServer(true);
            } else {
                console.log('Token already sent to server so won\'t send it again ' +
                    'unless it changes');
            }

        }

        function isTokenSentToServer() {
            return window.localStorage.getItem('sentToServer') === '1';
        }

        function setTokenSentToServer(sent) {
            window.localStorage.setItem('sentToServer', sent ? '1' : '0');
        }


        function requestPermission() {
            // [START request_permission]
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                    messaging.getToken().then((token) => {

                        if (user) {
                            firestore.collection("notifyToken").doc(user.uid).set({
                                currentToken: token,
                                time: firestore.FieldValue.serverTimestamp()
                            }).then(() => console.log("complete")).catch((err) => {
                                console.log("Error: ", err.message)
                            })
                        }

                    }).catch((err) => {
                        console.log("Error: ", err)
                    })

                    messaging.onMessage(function (payload) {
                        console.log("onMessage: ", payload);
                    })

     
                    // [START_EXCLUDE]
                    // In many cases once an app has been granted notification permission,
                    // it should update its UI reflecting this.
                    // [END_EXCLUDE]
                } else {
                    console.log('Unable to get permission to notify.');
                }
            });
            // [END request_permission]
        }

    }
}