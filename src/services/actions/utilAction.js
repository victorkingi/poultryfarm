import {messaging, storage} from "../api/firebase configurations/fbConfig";

export const hideBars = () => {
    return (dispatch) => {
        dispatch({type: 'HIDE_BARS'});
    }
}

// undo write events to database
export const rollBack = (details) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const batch = firestore.batch();
        const rollDocRef = firestore.doc(details.docId);
        const rollBackDoc = firestore.collection("rollback").doc(details.id);
        const storageRef = storage.ref();

        async function getLog() {
            const doc = await rollDocRef.get();
            const data = doc.data();

            const ids = [
                "1vMGrBhcwPXj2b4k2BlpAPyHAtc2",
                "cMxQ5l47KmVackqSRBpaM3ieVCX2",
                "jj9uon3O9LOaM6k5wtkeVUAy5wi2",
                "uM7j65iqBzQmU5vJZCzAsOibba53",
                "5AjrDRY93TSAqdOgX7bb67UuPH43",
                "phD4BTAFfKc38Tqx4ukmjfMwZD42"
            ]

            return firestore.collection("rollback").where("time", ">", details.time)
                .get().then((snapshot) => {
                    let code = 0;
                    if (snapshot.size !== 0 ) {
                        snapshot.docs.forEach((queryDoc) => {
                            const queryData = queryDoc.data();
                            if (queryData.docId.includes("sales")
                                || queryData.docId.includes("buys")
                                || queryData.docId.includes("eggs")) {
                                if (data.event.includes("sale")
                                    || data.event.includes("purchase")
                                    || data.event.includes("eggs collected")) {
                                    code = 1;
                                    const error = new Error("This rewind is impossible!");
                                    console.error(error);
                                    return window.alert(error);
                                }
                            }
                            for (let i = 0; i < ids.length; i++) {
                                firestore.collection("userLogs").doc(ids[i]).collection('logs')
                                    .where("submittedOn", ">", details.time).get()
                                    .then((snap) => {
                                        if (snap.size !== 0) {
                                            snap.docs.forEach((finalDoc) => {
                                                const finalData = finalDoc.data();
                                                if (finalData.event.includes("sent money")) {
                                                    code = 1;
                                                    const error = new Error("This rewind is impossible!");
                                                    console.error(error);
                                                    return window.alert(error);
                                                }
                                            });
                                        }
                                    })
                            }
                        })
                    }
                    return code;
            })
        }

        getLog().then((code) => {
            if (code === 0) {
                firestore.collection("rollback").where("isBatch", "==", details.isBatch)
                    .get().then((snapshot) => {

                    if (details.action === "delete" && !details.imageId) {
                        //this triggers rollback function again and when user deletes the rollback, it alternates
                        //between 2 states
                        batch.delete(rollDocRef);

                    } else if (details.action === "create") {
                        batch.set(rollDocRef, {...details.prevValues, cloud: true});

                    }  else if (details.action === "update") {
                        batch.update(rollDocRef, {...details.prevValues, cloud: true});

                    } else if (details.action === "delete" && details.imageId) {
                        //this triggers rollback function again and when user deletes the rollback, it alternates
                        //between 2 states
                        batch.delete(rollDocRef);
                        // Create a reference to the file to delete
                        const imageRef = storageRef.child(details.imageId);

                        imageRef.delete().then(() => {
                            // File deleted successfully
                            return console.log("image deleted");
                        }).catch(function(error) {
                            // Uh-oh, an error occurred!
                            window.alert(`ERROR: ${error}`);
                            return console.error(error);
                        });
                    }
                    batch.delete(rollBackDoc);

                    // if it was a batch write/ transaction
                    if (snapshot.size !== 0) {
                        snapshot.docs.forEach((doc) => {
                            const data = doc.data();
                            const queryDocRef = firestore.collection("rollback").doc(doc.id);
                            const actOnDocRef = firestore.doc(data.docId);
                            const prevValues = data.prevValues || null;
                            if (doc.id !== details.id) {
                                if (data.action === "delete" && !data.imageId) {
                                    batch.delete(actOnDocRef);
                                }
                                if (data.action === "create" && prevValues !== null) {
                                    batch.set(actOnDocRef, {...prevValues, cloud: true});
                                }
                                if (data.action === "update" && prevValues !== null) {
                                    batch.update(actOnDocRef, {...prevValues, cloud: true});
                                }
                                if (data.action === "delete" && data.imageId) {
                                    //this triggers rollback function again and when user deletes the rollback, it alternates
                                    //between 2 states
                                    batch.delete(rollDocRef);
                                    // Create a reference to the file to delete
                                    const imageRef = storageRef.child(details.imageId);

                                    imageRef.delete().then(() => {
                                        // File deleted successfully
                                        return console.log("image deleted");
                                    }).catch(function(error) {
                                        // Uh-oh, an error occurred!
                                        window.alert(`ERROR: ${error}`);
                                        return console.error(error);
                                    });
                                }

                                batch.delete(queryDocRef);
                            }
                        });
                    }
                    return batch.commit().then(() => {
                        dispatch({type: 'LATE_REPAID'});
                    }).catch((err) => {
                        dispatch({type: 'LATE_ERROR'});
                        window.alert("ERROR: " + err.message);
                        window.location.reload();
                    });
                });
            } else {
                window.location.reload();
            }
        });
    }
}

export const handleToken = (sendTokenToServer_, renderCount) => {
    const load = document.getElementById("loading");
    const submit = document.getElementById("login");

    if (renderCount % 2 !== 0 && messaging !== null) {
        messaging.requestPermission()
            .then(async function () {
                const token = await messaging.getToken();
                sendTokenToServer_(token);
            })
            .catch(function (err) {
                console.log("Unable to get permission to notify.", err);
                window.alert("ERROR: It seems that your browser has blocked notifications. Try changing your option in settings for this site or rather, uncheck the checkbox to continue");

                load.style.display = 'none';
                submit.style.display = 'block';
            });
        messaging.onTokenRefresh(() => {
            messaging.getToken().then((refreshedToken) => {
                console.log('Token refreshed.');
                sendTokenToServer_(refreshedToken);
            }).catch((err) => {
                console.log('Unable to retrieve refreshed token ', err);
                window.alert(`ERROR: unable to retrieve messaging token ${err} uncheck box to continue`);
            });
        });
    } else if (messaging === null && renderCount % 2 !== 0 ) {
        window.alert("ERROR: This browser does not support push notifications, please uncheck the box");
        load.style.display = 'none';
        submit.style.display = 'block';
    }
    else {
        window.location.reload();
    }
}
