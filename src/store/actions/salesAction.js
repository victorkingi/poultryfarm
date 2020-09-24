import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";

function makeid(l) {
    let text = "";
    const char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < l; i++) {
        text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    return text;
}

function leapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

function dateCheck(enteredMonth, enteredDate, isLeap) {
    return (enteredMonth === 2 && (enteredDate > 28 || enteredDate < 1)) || (enteredMonth === 4
        && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 6 && (enteredDate > 30 || enteredDate < 1))
        || (enteredMonth === 9 && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 11
            && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 1 && (enteredDate > 31 || enteredDate < 1))
        || (enteredMonth === 3 && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 5
            && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 7 && (enteredDate > 31
            || enteredDate < 1)) || (enteredMonth === 8 && (enteredDate > 31 || enteredDate < 1))
        || (enteredMonth === 10 && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 12
            && (enteredDate > 31 || enteredDate < 1)) || (isLeap && enteredMonth === 2
            && (enteredDate > 29 || enteredDate < 1));
}

export const inputSell = (sales) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        setPerformanceStart();

        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const fullName = profile.firstName + ' ' + profile.lastName;
        const date = new Date();
        const enteredMonth = parseInt(sales.month);
        const newMonth = enteredMonth - 1;
        const section = sales.section;
        const key = makeid(28);
        const enteredDate = parseInt(sales.date);
        const year = date.getFullYear();
        const isLeap = leapYear(year);
        const status = JSON.parse(sales.status);
        const buyer = sales.buyerName ? sales.buyerName : sales.section;
        const salesDocRef = buyer ? firestore.collection("sales").doc('Month ' + enteredMonth + ' Date ' + enteredDate
            + ' ' + section + ': ' + buyer) : firestore.collection("sales").doc('Month ' + enteredMonth
            + ' Date ' + enteredDate + ' ' + section);
        const currentDocRef = firestore.collection("current").doc(fullName);
        const currentJeffRef = firestore.collection("current").doc("Jeff Karue");
        const traysDocRef = firestore.collection("trays").doc("CurrentTrays");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const latePaymentDocRef = buyer ? firestore.collection("latePayment").doc('Month ' + enteredMonth
            + ' Date ' + enteredDate + ' ' + section + ': ' + buyer) : firestore.collection("latePayment")
            .doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section);


        let total = sales.trayNo ? parseInt(sales.trayNo) * parseInt(sales.trayPrice)
            : parseInt(sales.chickenNo) * parseInt(sales.chickenPrice);

        const dateChecks = dateCheck(enteredMonth, enteredDate, isLeap);


        if (dateChecks) {
            const error = "ERROR: Impossible date entered!";
            dispatch({type: 'INPUT_BUYING_ERROR', error});

            window.alert(error);
            window.location = '/';
            throw new Error("ERROR: Impossible date entered!");
        }

        firestore.collection("sales").orderBy("date", "desc").limit(1).get().then(function (snapshot) {
            if (snapshot.size === 0) {
                throw new Error("ERROR: Contact admin for help!");
            }
            snapshot.docs.forEach(function (doc) {
                if (doc.exists) {

                    const prevWeeklyTotal = parseInt(doc.data().weeklyTotal);
                    const prevMonthlyTotal = parseInt(doc.data().monthlyTotal);
                    const newWeeklyTotal = total + prevWeeklyTotal;
                    const newMonthlyTotal = total + prevMonthlyTotal;

                    firestore.collection("buys").orderBy("date", "desc").limit(1).get().then(function (query) {
                        query.forEach(function (buyDoc) {
                            if (buyDoc.exists) {

                                return firestore.runTransaction(function (transaction) {
                                    return transaction.get(salesDocRef).then(function (salesDoc) {
                                        return transaction.get(currentDocRef).then(function (currentDoc) {
                                            return transaction.get(traysDocRef).then(function (traysDoc) {
                                                return transaction.get(currentJeffRef).then(function (jeffDoc) {
                                                    function commonTransaction() {
                                                        if (traysDoc.exists) {
                                                            const trayData = traysDoc.data().number;
                                                            const final = parseInt(trayData) - parseInt(sales.trayNo);

                                                            if (final === 0 || final > 0) {
                                                                transaction.update(traysDocRef, {
                                                                    number: final,
                                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                                })
                                                                return true;

                                                            } else {
                                                                return false;
                                                            }
                                                        }
                                                    }

                                                    if (salesDoc.exists) {
                                                        return Promise.reject("ERROR: Data already exists!");
                                                    } else {
                                                        if (user.uid && status) {
                                                            if (currentDoc.exists) {
                                                                let transMade = false;
                                                                if (sales.trayNo) {
                                                                    transMade = commonTransaction();
                                                                }

                                                                if (transMade) {

                                                                    transaction.set(salesDocRef, {
                                                                        ...sales,
                                                                        key: key,
                                                                        weeklyTotal: newWeeklyTotal,
                                                                        monthlyTotal: newMonthlyTotal,
                                                                        date: new Date(year, newMonth, enteredDate),
                                                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                                                    });

                                                                    if (section === "Simbi" && jeffDoc.exists) {
                                                                        transaction.update(currentJeffRef, {
                                                                            balance: firestore.FieldValue.increment(total),
                                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                                        });

                                                                    } else {
                                                                        transaction.update(currentDocRef, {
                                                                            balance: firestore.FieldValue.increment(total),
                                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                                        });

                                                                    }
                                                                    transaction.set(userLogRef, {
                                                                        event: 'sale ' + sales.section + ' to ' + buyer,
                                                                        earned: total,
                                                                        key: key,
                                                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                                                    });
                                                                } else {
                                                                    return Promise.reject("ERROR: No trays in store!");
                                                                }
                                                            } else {
                                                                return Promise.reject("ERROR: Document doesn't exist!");
                                                            }
                                                        } else if (user.uid && !status) {
                                                            let transMade = false;
                                                            if (sales.trayNo) {
                                                                transMade = commonTransaction();
                                                            }

                                                            if (transMade) {

                                                                transaction.set(latePaymentDocRef, {
                                                                    amountDue: total,
                                                                    trayNo: sales.trayNo,
                                                                    key: key,
                                                                    trayPrice: sales.trayPrice,
                                                                    date: new Date(year, newMonth, enteredDate),
                                                                    section: sales.section,
                                                                    buyer: buyer,
                                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                                })

                                                            } else if (sales.chickenNo) {
                                                                transaction.set(latePaymentDocRef, {
                                                                    amountDue: total,
                                                                    chickenNo: sales.chickenNo,
                                                                    key: key,
                                                                    weeklyTotal: newWeeklyTotal,
                                                                    monthlyTotal: newMonthlyTotal,
                                                                    chickenPrice: sales.chickenPrice,
                                                                    date: new Date(year, newMonth, enteredDate),
                                                                    section: sales.section,
                                                                    buyer: buyer,
                                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                                })
                                                            } else {
                                                                return Promise.reject("ERROR: Contact main admin for help!");
                                                            }

                                                            transaction.set(salesDocRef, {
                                                                ...sales,
                                                                key: key,
                                                                weeklyTotal: newWeeklyTotal,
                                                                monthlyTotal: newMonthlyTotal,
                                                                date: new Date(year, newMonth, enteredDate),
                                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            });

                                                            transaction.set(userLogRef, {
                                                                event: 'sale ' + sales.section + ' to ' + buyer + ' but not paid',
                                                                earned: total,
                                                                key: key,
                                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            });

                                                        } else {
                                                            return Promise.reject("ERROR: Contact main admin for help!");
                                                        }
                                                    }
                                                })
                                            })
                                        })
                                    })
                                }).then(() => {

                                    const batch = firestore.batch();
                                    const allThikaDocRef = firestore.collection("otherDebt").doc("TotalThikaFarmers");

                                    if (sales.section === "Thika Farmers") {

                                        firestore.collection("otherDebt").orderBy("date", "desc").get().then(function (snapshot) {
                                            if (snapshot.size === 0) {
                                                return null;
                                            }

                                            for (let i = 0; i < snapshot.size; i++) {
                                                const balance = parseInt(snapshot.docs[i].data().balance);

                                                if (profile.firstName === "Jeff") {
                                                    const final = total - balance;
                                                    const otherDebtDocRef = firestore.collection("otherDebt").doc(snapshot.docs[i].id);

                                                    if (final < 0) {
                                                        const newFinal = final * -1;

                                                        batch.update(otherDebtDocRef, {
                                                            balance: newFinal,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        })

                                                        break;
                                                    } else if (final === 0) {
                                                        batch.delete(otherDebtDocRef);

                                                        break;

                                                    } else if (final > 0) {
                                                        batch.delete(otherDebtDocRef);
                                                        total = final;
                                                    }


                                                }

                                            }

                                            const newTotal = total * -1;

                                            batch.update(allThikaDocRef, {
                                                total: firestore.FieldValue.increment(newTotal),
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            })

                                            batch.update(currentDocRef, {
                                                balance: firestore.FieldValue.increment(newTotal),
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            })


                                            batch.commit().then(() => console.log("debt updated"));

                                        }).catch((err) => {
                                            console.log("error, ", err.message);
                                        })

                                    }

                                    dispatch({type: 'INPUT_SALES', sales});
                                    window.alert("Data Submitted");
                                    window.location = '/';

                                }).catch((err) => {
                                    const error = err.message || err;
                                    dispatch({type: 'INPUT_SALES_ERROR', error});

                                    window.alert(error);
                                    window.location = '/';
                                });

                            } else {
                                const error = "No buy doc found";
                                dispatch({type: 'INPUT_SALES_ERROR', error});

                                window.alert("ERROR: ", error);
                                window.location = '/';
                            }
                        })
                    })
                } else {
                    const error = "No buy doc found";
                    dispatch({type: 'INPUT_SALES_ERROR', error});

                    window.alert("ERROR: ", error);
                    window.location = '/';
                }
            })
        })
        setPerformanceEnd('SELL_TIME');
    }
}

export {makeid, leapYear, dateCheck};
