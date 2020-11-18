import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";
import {functions} from "../api/firebase configurations/fbConfig";

export const sendTokenToServer = (token) => {
    return (dispatch, getState, {getFirestore, getFirebase}) => {
        setPerformanceStart();

        const firestore = getFirestore();
        const firebase = getFirebase();
        const batch = firestore.batch();
        const name = firebase.auth().currentUser.displayName;
        const email = firebase.auth().currentUser.email;

        if (name) {
            const tokenRef = firestore.collection("notifyToken").doc(name).collection("tokens").doc(token);

            batch.set(tokenRef, {
                token: token,
                email,
                submittedOn: firestore.FieldValue.serverTimestamp()
            });

            batch.commit().then(() => {
                console.log("new token");
                const firstNotification = functions.httpsCallable('enabledNotify');
                firstNotification({}).then(() => {
                    window.location.reload();
                }).catch((err) => {
                    window.alert(`ERROR: Unexpected error occurred! ${err}`);
                });
            }).catch((err) => {
                console.log("entered: ", err.message);
                window.alert(`ERROR: ${err.message} If you are already subscribed to notifications, please uncheck box and click submit to proceed. If after doing this you are still seeing this error, contact admin for help`);
                const load = document.getElementById("loading");
                const submit = document.getElementById("login");
                load.style.display = 'none';
                submit.style.display = 'block';
            });
        }

        setPerformanceEnd('TOKEN_SEND_TIME');
    }
}