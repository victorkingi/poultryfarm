//update the age of the birds accordingly
import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";
import {clearForm} from "../../scenes/Input Pages/scenes/Sales/components/Inputsell";

export const inputNews = (details) => {
    return (dispatch, getState, {getFirestore}) => {
        setPerformanceStart();

        //make async call to database
        const firestore = getFirestore();
        const load = document.getElementById("loading-news");

        firestore.collection("latestNews").doc("WZj6mDlVZMyVrCvPDOym").get().then(function (doc) {
            if (doc.exists) {
                doc.ref.set({
                    title: details.title,
                    content: details.content,
                    provider: details.provider,
                    link: details.link,
                    time: firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    dispatch({type: 'UPLOAD_DONE'});
                    window.alert("Data submitted");
                    load.style.display = 'none';
                    clearForm('news-form');

                }).catch((err) => {
                    dispatch({type: 'UPLOAD_ERROR'});
                    window.alert("ERROR: " + err.message);
                    load.style.display = 'none';
                    window.location = '/';
                    clearForm('news-form');
                })
            } else {
                const error = "Doc not found"
                dispatch({type: 'UPLOAD_ERROR', error});
                window.alert("ERROR");
                load.style.display = 'none';
                window.location = '/';
                clearForm('news-form');
            }
        }).catch((err) => {
            dispatch({type: 'UPLOAD_ERROR'});
            window.alert("ERROR: " + err.message);
            load.style.display = 'none';
            window.location = '/';
            clearForm('news-form');
        })

        setPerformanceEnd('NEWS_UPDATE_TIME');
    }
}

export const sendTokenToServer = (token) => {
    return (dispatch, getState, {getFirestore, getFirebase}) => {
        setPerformanceStart();

        const firestore = getFirestore();
        const firebase = getFirebase();
        const batch = firestore.batch();
        const name = firebase.auth().currentUser.displayName;

        if (name) {
            const tokenRef = firestore.collection("notifyToken").doc(name).collection("tokens").doc(token);

            batch.set(tokenRef, {
                token: token,
                submittedOn: firestore.FieldValue.serverTimestamp()
            });

            batch.commit().then(() => {
                console.log("new token")
                window.location.reload();
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