import {dateCheck, leapYear} from "./salesAction";
import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";
import {storage} from "../api/firebase configurations/fbConfig";

export const inputDeadSick = (deadSick, image) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        setPerformanceStart();

        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const getHours = date.getHours();
        const getMinutes = date.getMinutes();
        const getSeconds = date.getSeconds();
        const enteredMonth = parseInt(deadSick.month);
        const newMonth = enteredMonth - 1;
        const section = deadSick.section;
        const place = deadSick.place;
        const enteredDate = parseInt(deadSick.date);
        const year = date.getFullYear();
        const isLeap = leapYear(year);
        const deadSickDocRef = firestore.collection("deadSick").doc();
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const chickenDocRef = firestore.collection("chickenDetails").doc("2020");
        const load = document.getElementById("loading-dead-sick");
        const submit = document.getElementById("submit-btn-dead-sick");

        const dateChecks = dateCheck(enteredMonth, enteredDate, isLeap);

        if (dateChecks) {
            const error = "ERROR: Impossible date entered!";
            dispatch({type: 'UPLOAD_ERROR', error});
            window.alert(error);
            submit.style.display = 'block';
            load.style.display = 'none';
            return new Error("ERROR: Impossible date entered!");
        }
        if (!image) {
            const error = "ERROR: No Image given!";
            dispatch({type: 'UPLOAD_ERROR', error});
            window.alert(error);
            submit.style.display = 'block';
            load.style.display = 'none';
            return new Error("ERROR: Impossible date entered!");
        }

        const storageRef = storage.ref();

        const uploadImagesRef = storageRef.child(`deadSick/${image?.name}`);
        const metadata = {
            section
        }

        const uploadTask = uploadImagesRef.put(image, metadata);

        uploadTask.on('state_changed',
            function (snapshot) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + " % done");
        }, function (error) {
            switch (error.code) {
                case 'storage/unauthorized':
                    window.alert("ERROR: You don't have permission to perform this task!");
                    break;

                case 'storage/canceled':
                    window.alert("Upload successfully cancelled!");
                    break;
                case 'storage/unknown':
                    window.alert("ERROR: Unknown error occurred!");
                    break;
                default:
                }
            },
            function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
                    firestore.collection("deadSick")
                        .where("docId", "==", `Month ${enteredMonth} Date ${enteredDate} ${section}`)
                        .get()
                        .then((query) => {
                            if (query.size !== 0) {
                                return new Error("ERROR: Data already exists!");
                            } else {
                                return firestore.runTransaction(function (transaction) {
                                    return transaction.get(deadSickDocRef).then(function (deadSickDoc) {
                                        return transaction.get(chickenDocRef).then(function (chickenDoc) {
                                            if (deadSickDoc.exists) {
                                                return Promise.reject("ERROR: Data already exists!");
                                            } else {

                                                if (section === "Dead" && chickenDoc.exists) {

                                                    if (place === "Cage") {
                                                        const num = parseInt(chickenDoc.data().cage);
                                                        const newNum = num - 1;
                                                        transaction.update(chickenDocRef, {
                                                            cloud: false,
                                                            cage: newNum
                                                        })
                                                    } else if (place === "House") {
                                                        const num = parseInt(chickenDoc.data().house);
                                                        const newNum = num - 1;
                                                        transaction.update(chickenDocRef, {
                                                            cloud: false,
                                                            house: newNum
                                                        })
                                                    }

                                                    const data = parseInt(chickenDoc.data().total);
                                                    const final = data - 1;

                                                    if (final < 0) {
                                                        return new Error("ERROR: No more chickens left!");
                                                    } else {
                                                        transaction.update(chickenDocRef, {
                                                            cloud: false,
                                                            total: final,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        })
                                                    }

                                                }

                                                transaction.set(deadSickDocRef, {
                                                    cloud: false,
                                                    ...deadSick,
                                                    docId: `Month ${enteredMonth} Date ${enteredDate} ${section}`,
                                                    photoURL: url,
                                                    date: new Date(year, newMonth, enteredDate, getHours, getMinutes, getSeconds),
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()

                                                })

                                                transaction.set(userLogRef, {
                                                    cloud: false,
                                                    event: deadSick.section + " Chicken",
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                })
                                            }
                                        })
                                    })
                                }).then(() => {
                                        dispatch({type: 'UPLOAD_DONE'});
                                        window.alert("Data submitted");
                                        load.style.display = 'none';
                                        window.location.reload();

                                    }).catch((err) => {
                                        const error = err.message || err;
                                        dispatch({type: 'UPLOAD_ERROR', error});

                                        window.alert(error);
                                        load.style.display = 'none';
                                        window.location = '/';
                                    });
                            }
                        });
                });
            });
        setPerformanceEnd('DEAD_SICK_TIME');
    }
}
