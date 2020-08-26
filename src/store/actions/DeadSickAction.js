import React from "react";
import 'react-toastify/dist/ReactToastify.css';


export const inputDeadSick = (deadSick, image) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        //make async call to database

        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        const enteredDate = deadSick.date;
        const section = deadSick.section;
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        firestore.collection('deadSick').doc('Month ' + month + ' Date ' + enteredDate + ' ' + section).get().then(function (doc) {
            if (doc.exists) {
                const err = "Doc exists";
                dispatch({type: 'DOC_EXISTS', err});
            } else {

                var storageRef = firebase.storage().ref();

                var uploadImagesRef = storageRef.child(`deadSick/${image.name}`);

                var uploadTask = uploadImagesRef.put(image);


                uploadTask.then(function (snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress + " %");
                }).then(() => {
                    firebase.storage().ref()
                        .child(`deadSick/${image.name}`)
                        .getDownloadURL()
                        .then((url) => {

                            firestore.collection('deadSick').doc('Month ' + month + ' Date ' + enteredDate + ' ' + section).set({
                                ...deadSick,
                                photoURL: url,
                                date: new Date(year, date.getMonth(), enteredDate),
                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                submittedOn: firestore.FieldValue.serverTimestamp()

                            }).then(() => {
                                dispatch({type: 'UPLOAD_DONE'});
                                const upload = document.getElementById("uploadLoad");
                                upload.style.display = 'block';

                                function uploadNotify() {
                                    upload.style.display = 'none';
                                }

                                setTimeout(uploadNotify, 3000);


                            }).then(() => {
                                if (section === "Dead") {
                                    firestore.collection('chickenDetails').doc('2020').get().then(function (doc) {
                                        if (doc.exists) {
                                            const data = doc.data();
                                            const total = parseInt(data.total);
                                            const myTotal = total - 1;

                                            doc.ref.update({
                                                total: myTotal
                                            })
                                        }
                                    })
                                }

                                firestore.collection('userLogs').doc(user.uid).set({dummy: 'dummy'});

                                firestore.collection('userLogs').doc(user.uid).collection('logs').add({
                                    event: deadSick.section + " Chicken",
                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                });
                            });
                        }).then(() => {
                        dispatch({type: 'SUBMIT'});
                        window.alert("Data submitted");
                        window.location = '/';

                    });
                });
            }

        });
    }
}
