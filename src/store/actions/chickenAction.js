//update the age of the birds accordingly
import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";

export const inputNews = (details) => {
    return (dispatch, getState, {getFirestore}) => {
        setPerformanceStart();

        //make async call to database
        const firestore = getFirestore();

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
                    window.location = '/';
                }).catch((err) => {
                    dispatch({type: 'UPLOAD_ERROR'});
                    window.alert("ERROR: " + err.message);
                    window.location = '/';
                })
            } else {
                const error = "Doc not found"
                dispatch({type: 'UPLOAD_ERROR', error});
                window.alert("ERROR");
                window.location = '/';
            }
        }).catch((err) => {
            dispatch({type: 'UPLOAD_ERROR'});
            window.alert("ERROR: " + err.message);
            window.location = '/';
        })

        setPerformanceEnd('NEWS_UPDATE_TIME');
    }
}

export const sendTokenToServer = (token) => {
    return (dispatch, getState, {getFirestore}) => {
        setPerformanceStart();

        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const fullName = profile.firstName + ' ' + profile.lastName;
        const tokenRef = firestore.collection("notifyToken").doc(fullName).collection("tokens").doc(token);
        const batch = firestore.batch();

        if (profile) {
            if (profile.firstName) {
                let tokenEntered = false;
                firestore.collection("notifyToken").doc(fullName).collection("tokens").orderBy("submittedOn", "desc").get().then(
                    function (query) {
                        query.forEach(function (doc) {
                            if (doc.exists) {
                                const prevToken = doc.data().token;
                                if (token === prevToken) {
                                    tokenEntered = true;
                                }
                            }
                        })
                    }
                ).catch((error) => {
                    console.log(error)
                }).then(() => {
                    tokenRef.get().then((doc) => {
                        if (doc.exists) {
                            return Promise.reject("entered");
                        } else {
                            if (!tokenEntered) {
                                batch.set(tokenRef, {
                                    token: token,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                });
                                batch.commit().then(() => console.log("new token"));
                            }
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                })
            }
        }

        setPerformanceEnd('TOKEN_SEND_TIME');
    }
}