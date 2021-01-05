import {makeid} from "./salesAction";
import {clearForm} from "../../scenes/Input Pages/scenes/Sales/components/Inputsell";

function setPerformanceStart() {
    performance.mark('measurementStart');
}

function setPerformanceEnd(name) {
    performance.mark('measurementStop');
    performance.measure(name, 'measurementStart', 'measurementStop');
}

//sending money from one user to another
export const sendMoney = (money) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        setPerformanceStart();

        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const fullName = profile.firstName + ' ' + profile.lastName;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const receiver = money.receiver;
        const amount = parseInt(money.amount);
        const currentDocRef = firestore.collection("current").doc(fullName);
        const receiverDocRef = firestore.collection("current").doc(receiver);
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const load = document.getElementById("loading-send-money");
        const submit = document.getElementById("submit-btn-send-money");

        function sendTheFunds() {
            return firestore.runTransaction(function (transaction) {
                return transaction.get(currentDocRef).then(function (currentDoc) {
                    return transaction.get(receiverDocRef).then(function (receiverDoc) {

                        if (currentDoc.exists) {
                            if (receiverDoc.exists) {
                                const name = receiverDoc.data().fullName;

                                if (name === currentDoc.data().fullName || amount < 1) {
                                    return Promise.reject("ERROR: Recheck data entered!");

                                } else {
                                    const senderNewBalance = currentDoc.data().balance - amount;

                                    if (senderNewBalance < 0) {
                                        return Promise.reject("ERROR: Insufficient funds to complete transfer");

                                    } else {
                                        transaction.update(currentDocRef, {
                                            cloud: true,
                                            balance: senderNewBalance,
                                            submittedBy: fullName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });

                                        transaction.update(receiverDocRef, {
                                            cloud: true,
                                            balance: firestore.FieldValue.increment(amount),
                                            submittedBy: fullName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });

                                        transaction.set(userLogRef, {
                                            cloud: true,
                                            event: 'sent money to ' + name,
                                            receiver: name,
                                            amount: amount,
                                            submittedBy: fullName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });
                                    }
                                }
                            } else {
                                return Promise.reject("ERROR: Doc doesn't exist!");
                            }

                        } else {
                            return Promise.reject("ERROR: Doc doesn't exist!");
                        }
                    })
                })
            }).then(() => {
                    dispatch({type: 'MONEY_SENT', money});
                    window.alert("Data submitted");
                    load.style.display = 'none';
                    submit.style.display = 'block';
                    clearForm('send-money-form');
                }).catch((err) => {
                const error = err.message || err;
                dispatch({type: 'MONEY_ERROR', error});

                window.alert(error);
                load.style.display = 'none';
                window.location = '/';
            })
        }

        if (money.receiver === "Bank Account") {
            return firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    return user.getIdTokenResult().then(idToken => {
                        if (!idToken.claims.admin) {
                            return Promise.reject("ERROR: You are not an admin!");
                        } else {
                            setPerformanceEnd('SEND_MONEY_TIME');
                            return sendTheFunds();
                        }
                    }).catch((err) => {
                        console.error(err);
                        window.alert(err);
                        submit.style.display = 'block';
                        load.style.display = 'none';
                        window.location = '/';
                    })
                }
            });
        } else {
            setPerformanceEnd('SEND_MONEY_TIME');
            return sendTheFunds();
        }
    }
}

//if a customer has taken trays but hasn't paid, hasPaidLate fires
export const hasPaidLate = (details) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        setPerformanceStart();

        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const fullName = profile.firstName + ' ' + profile.lastName;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const amountDue = parseInt(details.amountDue);
        const salesRef = firestore.collection("sales");
        const currentDocRef = firestore.collection("current").doc(fullName);
        const latePaymentRef = firestore.collection("latePayment");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();

        return salesRef.where("docId", "==", details.docId).where("submittedOn", "==", details.submittedOn).get()
            .then((query) => {
                query.forEach((doc) => {
                    latePaymentRef.where("docId", "==", details.docId)
                        .where("submittedOn", "==", details.submittedOn).get()
                        .then((innerQuery) => {
                            innerQuery.forEach((lateDoc) => {
                                const batch = firestore.batch();
                                const salesDocRef = firestore.collection("sales").doc(doc.id);
                                const latePaymentDocRef = firestore.collection("latePayment").doc(lateDoc.id);

                                batch.update(currentDocRef, {
                                    cloud: false,
                                    balance: firestore.FieldValue.increment(amountDue),
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                });

                                batch.update(salesDocRef, {status: true, cloud: false});

                                batch.set(userLogRef, {
                                    cloud: false,
                                    event: 'late payment from ' + details.buyer,
                                    earned: amountDue,
                                    submittedBy: fullName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                });

                                batch.delete(latePaymentDocRef);

                                batch.commit().then(() => {
                                    dispatch({type: 'LATE_REPAID'});
                                }).catch((err) => {
                                    dispatch({type: 'LATE_ERROR'});
                                    window.alert("ERROR: " + err.message);
                                });
                                setPerformanceEnd('LATE_PAYMENT_TIME');
                            })
                        })

                })
            })
    }
}

//executed if we owe ANYONE money excluding Jeff
export const weClearedOurDebt = (details) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        setPerformanceStart();

        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const fullName = profile.firstName + ' ' + profile.lastName;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const balance = parseInt(details.balance);
        const buyRef = firestore.collection("buys");
        const currentDocRef = firestore.collection("current").doc(fullName);
        const oweJeffDocRef = firestore.collection("oweJeff").doc("Amount");
        const otherDebtRef = firestore.collection("otherDebt");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();

        return buyRef.where("docId", "==", details.docId).where("submittedOn", "==", details.submittedOn).get()
            .then((query) => {
                query.forEach((doc) => {
                    otherDebtRef.where("docId", "==", details.docId)
                        .where("submittedOn", "==", details.submittedOn).get()
                        .then((innerQuery) => {
                            innerQuery.forEach((debtDoc) => {
                                const buyDocRef = firestore.collection("buys").doc(doc.id);
                                const otherDebtDocRef = firestore.collection("otherDebt").doc(debtDoc.id);

                                firestore.runTransaction((transaction) => {
                                    return transaction.get(currentDocRef).then(function (currentDoc) {
                                        return transaction.get(buyDocRef).then(function (buyDoc) {
                                                return transaction.get(otherDebtDocRef).then(function (otherDebtDoc) {
                                                    if (currentDoc.exists) {
                                                        const currentData = currentDoc.data().balance;
                                                        const final = parseInt(currentData) - parseInt(details.balance);

                                                        if (final < 0 && user.email !== "jeffkarue@gmail.com") {

                                                            return Promise.reject("ERROR: Insufficient funds");
                                                        } else if (final < 0 && user.email === "jeffkarue@gmail.com") {
                                                            const newFinal = final * -1;

                                                            transaction.update(currentDocRef, {
                                                                cloud: false,
                                                                balance: 0,
                                                                submittedBy: fullName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            });

                                                            transaction.update(oweJeffDocRef, {
                                                                cloud: false,
                                                                balance: firestore.FieldValue.increment(newFinal),
                                                                submittedBy: fullName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            });

                                                            transaction.update(buyDocRef, {status: true, cloud: false});

                                                            transaction.delete(otherDebtDocRef);

                                                            transaction.set(userLogRef, {
                                                                cloud: false,
                                                                event: `balance of ${details.debtor} cleared by jeff so we now owe jeff`,
                                                                amount: balance,
                                                                submittedBy: fullName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            });

                                                        } else if (final === 0 || final > 0) {
                                                            transaction.update(currentDocRef, {
                                                                cloud: false,
                                                                balance: final,
                                                                submittedBy: fullName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            });

                                                            if (buyDoc.exists && otherDebtDoc.exists) {
                                                                transaction.update(buyDocRef, {status: true, cloud: false});

                                                                transaction.delete(otherDebtDocRef);

                                                            } else {
                                                                return Promise.reject("ERROR: No document found");
                                                            }

                                                            transaction.set(userLogRef, {
                                                                cloud: false,
                                                                event: 'balance cleared of ' + details.debtor,
                                                                amount: balance,
                                                                submittedBy: fullName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            });

                                                        }
                                                    } else {
                                                        return Promise.reject("ERROR: No document found");
                                                    }
                                                })
                                        })
                                    })
                                }).then(() => {
                                    dispatch({type: 'OWE_OTHERS'});
                                }).catch((err) => {
                                    const error = err.message || err;
                                    dispatch({type: 'CLEAR_ERROR', error});

                                    window.alert(error);
                                    window.location = '/';
                                })
                                setPerformanceEnd('CLEAR_DEBT_TIME');
                            });
                        });
                });
        });
    }
}

//executed if we want to pay back Jeff
export const payBackJeff = (details) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        setPerformanceStart();

        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const fullName = profile.firstName + ' ' + profile.lastName;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const currentDocRef = firestore.collection("current").doc(fullName);
        const oweJeffDocRef = firestore.collection("oweJeff").doc("Amount");
        const bankDocRef = firestore.collection("current").doc("Bank Account");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();

        firestore.runTransaction(function (transaction) {
            return transaction.get(currentDocRef).then(function (currentDoc) {
                return transaction.get(oweJeffDocRef).then(function (oweJeffDoc) {
                    return transaction.get(bankDocRef).then(function (bankDoc) {

                        if (currentDoc.exists) {
                            if (oweJeffDoc.exists) {
                                const currentData = parseInt(currentDoc.data().balance);
                                const final = currentData - parseInt(details.balance);

                                if (final < 0 && user.email !== "jeffkarue@gmail.com" && currentData !== 0) {
                                    const newFinal = final * -1;

                                    transaction.set(userLogRef, {
                                        cloud: false,
                                        event: 'some debt paid off',
                                        amount: currentData,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });

                                    transaction.update(currentDocRef, {
                                        cloud: false,
                                        balance: 0,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });


                                    transaction.update(oweJeffDocRef, {
                                        cloud: false,
                                        balance: newFinal,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });

                                } else if (final === 0 || final > 0) {

                                    transaction.set(userLogRef, {
                                        cloud: false,
                                        event: 'all debt paid off',
                                        amount: details.balance,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });

                                    transaction.update(currentDocRef, {
                                        cloud: false,
                                        balance: final,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });

                                    transaction.delete(oweJeffDocRef);


                                } else if (final < 0 && user.email === "jeffkarue@gmail.com" && bankDoc.exists) {
                                    const balance = parseInt(bankDoc.data().balance);
                                    const newFinal = final * -1;
                                    const finalBalance = balance - newFinal;

                                    if (finalBalance < 0) {
                                        const newFinalBalance = finalBalance * -1;

                                        transaction.set(userLogRef, {
                                            cloud: false,
                                            event: 'some debt paid off',
                                            amount: balance,
                                            submittedBy: fullName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });

                                        transaction.update(bankDocRef, {
                                            cloud: false,
                                            balance: 0,
                                            submittedBy: fullName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });

                                        transaction.update(oweJeffDocRef, {
                                            cloud: false,
                                            balance: newFinalBalance,
                                            submittedBy: fullName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });

                                    } else if (finalBalance === 0 || finalBalance > 0) {

                                        transaction.set(userLogRef, {
                                            cloud: false,
                                            event: 'all debt paid off',
                                            amount: details.balance,
                                            submittedBy: fullName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        });

                                        transaction.update(bankDocRef, {
                                            cloud: false,
                                            balance: finalBalance,
                                            submittedBy: fullName,
                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                        }).then(() => console.log("bank balance used"));

                                        transaction.delete(oweJeffDocRef);
                                    }

                                    transaction.update(currentDocRef, {
                                        cloud: false,
                                        balance: 0,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });

                                } else {
                                    return Promise.reject("ERROR: Contact main admin for help");
                                }
                            } else {
                                return Promise.reject("ERROR: Doc not found");
                            }

                        } else {
                            return Promise.reject("ERROR: Doc not found");
                        }
                    })
                })
            })
        }).then(() => {
            dispatch({type: 'OWE_OTHERS'});
            window.alert("Payment Successful");
            window.location = '/';

        }).catch((err) => {
            const error = err.message || err;
            dispatch({type: 'CLEAR_ERROR', error});

            window.alert(error);
            window.location = '/';
        })

        setPerformanceEnd('PAY_JEFF_TIME');
    }
}

//executed if someone randomly borrows chicken money
export const borrowSomeMoney = (details) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        setPerformanceStart();

        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const fullName = profile.firstName + ' ' + profile.lastName;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const key = makeid(28);
        const borrowAmount = parseInt(details.borrowAmount)
        const currentDocRef = firestore.collection("current").doc(fullName);
        const borrowDocRef = firestore.collection("borrow").doc();
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const load = document.getElementById("loading-borrow");

        firestore.runTransaction(function (transaction) {

            return transaction.get(currentDocRef).then(function (currentDoc) {
                if (currentDoc.exists) {
                    const currentData = parseInt(currentDoc.data().balance);
                    const final = currentData - borrowAmount;

                    if (final < 0) {
                        return Promise.reject("ERROR: Insufficient funds");
                    } else {
                        transaction.update(currentDocRef, {
                            cloud: false,
                            balance: final,
                            submittedBy: fullName,
                            submittedOn: firestore.FieldValue.serverTimestamp()
                        });

                        transaction.set(borrowDocRef, {
                            cloud: false,
                            borrowAmount: borrowAmount,
                            borrower: details.borrower,
                            key: key,
                            purpose: details.purpose,
                            submittedBy: fullName,
                            submittedOn: firestore.FieldValue.serverTimestamp()
                        });

                        transaction.set(userLogRef, {
                            cloud: false,
                            event: details.borrower + ' borrowed money',
                            amount: borrowAmount,
                            key: key,
                            submittedBy: fullName,
                            submittedOn: firestore.FieldValue.serverTimestamp()
                        });
                    }

                } else {
                    return Promise.reject("ERROR: Doc doesn't exist!");
                }
            })

        }).then(() => {
            dispatch({type: 'BORROW_SUCCESS'});
            window.alert("Money successfully borrowed");
            load.style.display = 'none';
            clearForm('borrow-form');

        }).catch((err) => {
            const error = err.message || err;
            dispatch({type: 'BORROW_FAILED', error});

            window.alert(error);
            load.style.display = 'none';
            window.location = '/';
        })
        setPerformanceEnd('BORROW_MONEY_TIME');
    }
}

//fired if someone who borrowed money, returns it
export const borrowerReturnsFunds = (details) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        setPerformanceStart();

        //make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const fullName = profile.firstName + ' ' + profile.lastName;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const key = makeid(28);
        const borrowAmount = parseInt(details.borrowAmount)
        const currentDocRef = firestore.collection("current").doc(fullName);
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();

        firestore.collection("borrow").where("key", "==", details.key).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                const borrowDocRef = firestore.collection("borrow").doc(doc.id);

                return firestore.runTransaction(function (transaction) {
                    return transaction.get(currentDocRef).then(function (currentDoc) {
                        return transaction.get(userLogRef).then(function (userLogDoc) {
                            if (currentDoc.exists) {
                                transaction.update(currentDocRef, {
                                    cloud: false,
                                    balance: firestore.FieldValue.increment(borrowAmount),
                                    submittedBy: fullName,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                });

                                transaction.delete(borrowDocRef);

                                if (userLogDoc.exists) {
                                    return Promise.reject("ERROR: Contact admin for help");
                                } else {
                                    transaction.set(userLogRef, {
                                        cloud: false,
                                        event: 'received borrowed money from ' + details.borrower,
                                        amount: borrowAmount,
                                        key: key,
                                        submittedBy: fullName,
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });
                                }

                            }
                        });
                    })
                }).then(() => {
                    dispatch({type: 'REPAID'});
                }).catch((err) => {
                    const error = err.message || err;
                    dispatch({type: 'REPAID_ERROR', error});

                    window.alert(error);
                    window.location = '/';
                })
            });
        });

        setPerformanceEnd('RECEIVE_BORROWED_MONEY_TIME');
    }
}

export {setPerformanceStart, setPerformanceEnd};
