//update the age of the birds accordingly
import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";
import {clearForm} from "../../components/projects/Inputsell";

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
    return (dispatch, getState, {getFirestore}) => {
        setPerformanceStart();

        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const fullName = profile?.firstName + ' ' + profile?.lastName;
        const tokenRef = firestore.collection("notifyToken").doc(fullName).collection("tokens").doc(token);
        const batch = firestore.batch();

        batch.set(tokenRef, {
            token: token,
            submittedOn: firestore.FieldValue.serverTimestamp()
        });

        batch.commit().then(() => console.log("new token"))
            .catch((err) => console.log("entered: ", err.message));

        setPerformanceEnd('TOKEN_SEND_TIME');
    }
}