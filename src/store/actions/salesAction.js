import moment from "moment";

function makeid(l) {
    var text = "";
    var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < l; i++) {
        text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    return text;
}

function leapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

//update otherDebtDoc as required when trays sold to thika farmers
const updateOtherDebtDoc = (sales) => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        let total = sales.trayNo ? parseInt(sales.trayNo) * parseInt(sales.trayPrice) : parseInt(sales.chickenNo) * parseInt(sales.chickenPrice);
        const currentDocRef = firestore.collection("current").doc("Jeff Karue");
        const batch = firestore.batch();

        if (sales.section === "Thika Farmers") {

            firestore.collection("otherDebt").orderBy("date", "desc").get().then(function (snapshot) {
                if (snapshot.size === 0) {
                    return null;
                }

                function updateThikaDoc(allThikaDocRef) {
                    allThikaDocRef.get().then(function (thikaDoc) {
                        if (thikaDoc.exists) {
                            const myTotal = parseInt(thikaDoc.data().total);
                            const newTotal = myTotal - total;
                            const current = total * -1;

                            if (newTotal > 0) {
                                batch.update(allThikaDocRef, {
                                    total: newTotal,
                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                })
                            } else if (newTotal <= 0) {
                                batch.delete(allThikaDocRef);
                            }

                            batch.update(currentDocRef, {
                                balance: firestore.FieldValue.increment(current),
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            })
                        } else {
                            return new Error("ERROR: No doc found");
                        }
                    }).catch((err) => {
                        console.log("ERROR: ", err.message);
                    })
                }

                for (let i = 0; i < snapshot.size; i++) {
                    const balance = parseInt(snapshot.docs[i].data().balance);

                    if (profile.firstName === "Jeff") {
                        const final = total - balance;
                        const otherDebtDocRef = firestore.collection("otherDebt").doc(snapshot.docs[i].id);
                        const allThikaDocRef = firestore.collection("otherDebt").doc("TotalThikaFarmers");

                        if (final < 0) {
                            const newFinal = final * -1;

                            batch.update(otherDebtDocRef, {
                                balance: newFinal,
                                submittedOn: firestore.FieldValue.serverTimestamp()
                            })

                            updateThikaDoc(allThikaDocRef);
                            batch.commit().then(() => console.log("debt updated"));

                            break;
                        } else if (final === 0) {
                            batch.delete(otherDebtDocRef);

                            updateThikaDoc(allThikaDocRef);

                            batch.commit().then(() => console.log("debt updated"));

                            break;

                        } else if (final > 0) {
                            batch.delete(otherDebtDocRef);
                            updateThikaDoc(allThikaDocRef);
                            total = final;

                            batch.commit().then(() => console.log("debt updated"));
                        }

                    } else {
                        return null;
                    }

                }


            }).then(() => {

            })

        } else {
            return null;
        }

    }
}

export const inputSell = (sales) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const fullName = profile.firstName + ' ' + profile.lastName;
        const date = new Date();
        const currentDate = date.getDate();
        const enteredMonth = parseInt(sales.month);
        const newMonth = enteredMonth - 1;
        const section = sales.section;
        const key = makeid(28);
        const enteredDate = parseInt(sales.date);
        const year = date.getFullYear();
        const keyedDate = new Date(year, enteredMonth, enteredDate);
        const weekNo = moment(keyedDate).week();
        const isLeap = leapYear(year);
        const status = JSON.parse(sales.status);
        const buyer = sales.buyerName ? sales.buyerName : sales.section;
        const salesDocRef = buyer ? firestore.collection("sales").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section + ': ' + buyer) : firestore.collection("sales").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section);
        const currentDocRef = firestore.collection("current").doc(fullName);
        const profitDocRef = firestore.collection("profit").doc('Month ' + enteredMonth + 'Week ' + weekNo);
        const currentJeffRef = firestore.collection("current").doc("Jeff Karue");
        const traysDocRef = firestore.collection("trays").doc("CurrentTrays");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const latePaymentDocRef = buyer ? firestore.collection("latePayment").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section + ': ' + buyer) : firestore.collection("latePayment").doc('Month ' + enteredMonth + ' Date ' + enteredDate + ' ' + section);

        const total = sales.trayNo ? parseInt(sales.trayNo) * parseInt(sales.trayPrice) : parseInt(sales.chickenNo) * parseInt(sales.chickenPrice);

        const dateCheck = (enteredMonth === 2 && (enteredDate > 28 || enteredDate < 1)) || (enteredMonth === 4
            && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 6 && (enteredDate > 30 || enteredDate < 1))
            || (enteredMonth === 9 && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 11
                && (enteredDate > 30 || enteredDate < 1)) || (enteredMonth === 1 && (enteredDate > 31 || enteredDate < 1))
            || (enteredMonth === 3 && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 5
                && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 7 && (enteredDate > 31
                || enteredDate < 1)) || (enteredMonth === 8 && (enteredDate > 31 || enteredDate < 1))
            || (enteredMonth === 10 && (enteredDate > 31 || enteredDate < 1)) || (enteredMonth === 12
                && (enteredDate > 31 || enteredDate < 1)) || (isLeap && enteredMonth === 2
                && (enteredDate > 29 || enteredDate < 1));


        if (dateCheck) {
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
                    const prevNumWeekDay = parseInt(doc.data().numWeekDay);
                    const prevNumMonthDay = parseInt(doc.data().numMonthDay);
                    const prevDate = parseInt(doc.data().date.toDate().getDate());
                    const newWeeklyTotal = total + prevWeeklyTotal;
                    const newMonthlyTotal = total + prevMonthlyTotal;
                    const dateDif = currentDate - prevDate;
                    let newNumWeekDay = prevNumWeekDay + dateDif;
                    let newNumMonthDay = prevNumMonthDay + dateDif;

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
                                                                    const buyDocRef = firestore.collection("buys").doc(buyDoc.id);

                                                                    transaction.set(salesDocRef, {
                                                                        ...sales,
                                                                        key: key,
                                                                        weeklyTotal: newWeeklyTotal,
                                                                        monthlyTotal: newMonthlyTotal,
                                                                        numWeekDay: newNumWeekDay,
                                                                        numMonthDay: newNumMonthDay,
                                                                        date: new Date(year, newMonth, enteredDate),
                                                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                                                    });

                                                                    if (newNumWeekDay === 8 && newNumMonthDay !== 31) {
                                                                        newNumWeekDay = 1;
                                                                        const weeklySpend = parseInt(buyDoc.data().weeklySpend);
                                                                        const used = JSON.parse(buyDoc.data().used);

                                                                        if (!used) {
                                                                            const weekProfit = prevWeeklyTotal - weeklySpend;

                                                                            transaction.set(profitDocRef, {
                                                                                weekProfit: weekProfit,
                                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                                            })

                                                                            transaction.update(buyDocRef, {
                                                                                used: true
                                                                            })
                                                                        }

                                                                        transaction.update(salesDocRef, {
                                                                            numWeekDay: newNumWeekDay,
                                                                            weeklyTotal: total,
                                                                        });

                                                                    } else if (newNumWeekDay !== 8 && newNumMonthDay === 31) {
                                                                        newNumMonthDay = 1;
                                                                        const monthlySpend = parseInt(buyDoc.data().monthlySpend);
                                                                        const used = JSON.parse(buyDoc.data().used);

                                                                        if (!used) {
                                                                            const monthProfit = prevMonthlyTotal - monthlySpend;

                                                                            transaction.set(profitDocRef, {
                                                                                monthProfit: monthProfit,
                                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                                            })

                                                                            transaction.update(buyDocRef, {
                                                                                used: true
                                                                            })
                                                                        }

                                                                        transaction.update(salesDocRef, {
                                                                            numMonthDay: newNumMonthDay,
                                                                            monthlyTotal: total,
                                                                        });

                                                                    } else if (newNumWeekDay === 8 && newNumMonthDay === 31) {
                                                                        const monthlySpend = parseInt(buyDoc.data().monthlySpend);
                                                                        const weeklySpend = parseInt(buyDoc.data().weeklySpend);
                                                                        const used = JSON.parse(buyDoc.data().used);

                                                                        newNumMonthDay = 1;
                                                                        newNumWeekDay = 1;

                                                                        if (!used) {
                                                                            const monthProfit = prevMonthlyTotal - monthlySpend;
                                                                            const weekProfit = prevWeeklyTotal - weeklySpend;

                                                                            transaction.set(profitDocRef, {
                                                                                monthProfit: monthProfit,
                                                                                weekProfit: weekProfit,
                                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                                            })

                                                                            transaction.update(buyDocRef, {
                                                                                used: true
                                                                            })
                                                                        }

                                                                        transaction.update(salesDocRef, {
                                                                            numWeekDay: newNumWeekDay,
                                                                            numMonthDay: newNumMonthDay,
                                                                            weeklyTotal: total,
                                                                            monthlyTotal: total
                                                                        });
                                                                    }

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
                                                            if (sales.trayNo) {
                                                                commonTransaction();

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

                                                                transaction.set(salesDocRef, {
                                                                    ...sales,
                                                                    key: key,
                                                                    date: new Date(year, newMonth, enteredDate),
                                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                                });

                                                            } else if (sales.chickenNo) {
                                                                transaction.set(latePaymentDocRef, {
                                                                    amountDue: total,
                                                                    chickenNo: sales.chickenNo,
                                                                    key: key,
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

                                                        } else {
                                                            return Promise.reject("ERROR: Contact main admin for help!");
                                                        }
                                                    }
                                                })
                                            })
                                        })
                                    })
                                }).then(() => {
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
            .then(() => {
                updateOtherDebtDoc(sales);
            })
    }
}
