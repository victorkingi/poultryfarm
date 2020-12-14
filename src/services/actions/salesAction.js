import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";
import {clearForm} from "../../scenes/Input Pages/scenes/Sales/components/Inputsell";

function makeid(l) {
    let text = "";
    const char_list = '!#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefghijklmnopqrstuvwxyz{|}~';
    for (let i = 0; i < l; i++) {
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
        const getHours = date.getHours();
        const getMinutes = date.getMinutes();
        const getSeconds = date.getSeconds();
        const enteredMonth = parseInt(sales.month);
        const newMonth = enteredMonth - 1;
        const section = sales.section;
        const key = makeid(28);
        const enteredDate = parseInt(sales.date);
        const year = date.getFullYear();
        const isLeap = leapYear(year);
        let status = JSON.parse(sales.status);
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
        const load = document.getElementById("loading-sales");
        let total = sales.trayNo ? parseInt(sales.trayNo) * parseInt(sales.trayPrice)
            : parseInt(sales.chickenNo) * parseInt(sales.chickenPrice);
        const dateChecks = dateCheck(enteredMonth, enteredDate, isLeap);

        if (section === "Thika Farmers") {
            status = true
        }

        if (dateChecks) {
            const error = "ERROR: Impossible date entered!";
            dispatch({type: 'INPUT_BUYING_ERROR', error});

            window.alert(error);
            return new Error(error);
        }
        const assertChickenValues = (sales.trayPrice || sales.trayNo) || (!sales.chickenNo || !sales.chickenPrice);
        const assertTrayValues = (!sales.trayPrice || !sales.trayNo) || (sales.chickenNo || sales.chickenPrice);

        if ((assertChickenValues && section === "Old Chickens") || (assertTrayValues && section !== "Old Chickens")) {
            const error = "ERROR: Impossible chicken data entered!";
            dispatch({type: 'INPUT_BUYING_ERROR', error});

            window.alert(error);
            return new Error(error);
        }

        const criticalBuyerNameCheck = section !== buyer;

        if (criticalBuyerNameCheck && (section === "Thika Farmers" || section === "Cakes" || section === "Simbi")) {
            const error = "ERROR: Impossible buyer name entered!";
            dispatch({type: 'INPUT_BUYING_ERROR', error});

            window.alert(error);
            return new Error(error);
        }

        firestore.collection("sales").orderBy("submittedOn", "desc").limit(1).get().then(function (snapshot) {
            if (snapshot.size === 0) {
                return new Error("ERROR: Contact admin for help!");
            }
            snapshot.docs.forEach(function (doc) {
                if (doc.exists) {

                    const prevWeeklyTotal = parseInt(doc.data().weeklyTotal);
                    const prevMonthlyTotal = parseInt(doc.data().monthlyTotal);
                    const newWeeklyTotal = total + prevWeeklyTotal;
                    const newMonthlyTotal = total + prevMonthlyTotal;

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
                                                    } else if (sales.chickenNo) {
                                                        transMade = true;
                                                    }
                                                    if (transMade) {
                                                        transaction.set(salesDocRef, {
                                                            ...sales,
                                                            buyerName: buyer,
                                                            key: key,
                                                            weeklyTotal: newWeeklyTotal,
                                                            monthlyTotal: newMonthlyTotal,
                                                            date: new Date(year, newMonth, enteredDate, getHours, getMinutes, getSeconds),
                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });

                                                        if (section === "Simbi" && jeffDoc.exists) {
                                                            transaction.update(currentJeffRef, {
                                                                balance: firestore.FieldValue.increment(total),
                                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            });

                                                        } else if (section !== "Thika Farmers") {
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
                                                        date: new Date(year, newMonth, enteredDate, getHours, getMinutes, getSeconds),
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
                                                        date: new Date(year, newMonth, enteredDate, getHours, getMinutes, getSeconds),
                                                        section: sales.section,
                                                        buyer: buyer,
                                                        submittedBy: profile.firstName + ' ' + profile.lastName,
                                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                                    })
                                                }

                                                transaction.set(salesDocRef, {
                                                    ...sales,
                                                    buyerName: buyer,
                                                    key: key,
                                                    weeklyTotal: newWeeklyTotal,
                                                    monthlyTotal: newMonthlyTotal,
                                                    date: new Date(year, newMonth, enteredDate, getHours, getMinutes, getSeconds),
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

                                            }
                                        }
                                    })
                                })
                            })
                        })
                    }).then(() => {
                        const batch = firestore.batch();
                        if (section === "Thika Farmers") {

                            firestore.collection("otherDebt").orderBy("date", "desc").get().then((snapshot) => {
                                let profitMade = undefined;

                                if (snapshot.size === 0) {
                                    return null;
                                }
                                for (let i = 0; i < snapshot.size; i++) {
                                    const balance = parseInt(snapshot.docs[i].data().balance);
                                        const final = total - balance;
                                        const otherDebtDocRef = firestore.collection("otherDebt").doc(snapshot.docs[i].id);

                                        if (final < 0) {
                                            const newFinal = final * -1;
                                            batch.update(otherDebtDocRef, {
                                                balance: newFinal,
                                                updateKey: key,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            });
                                            break;

                                        } else if (final === 0) {
                                            batch.delete(otherDebtDocRef);
                                            break;

                                        } else if (final > 0) {
                                            batch.delete(otherDebtDocRef);
                                            total = final;

                                            if (snapshot.size - 1 === i) {
                                                profitMade = final;
                                            }
                                        }
                                }

                                // a special case whereby all Feeds debt docs have been deleted but we made a profit
                                //hence thika farmers will owe us
                                if (profitMade) {
                                    const newVal = profitMade * -1;
                                    const thikaFarmDebtRef = firestore.collection("otherDebt").doc("TotalThikaFarmers");

                                    batch.update(thikaFarmDebtRef, {
                                        total: firestore.FieldValue.increment(newVal),
                                        submittedOn: firestore.FieldValue.serverTimestamp()
                                    });
                                }

                                batch.commit().then(() => {
                                    dispatch({type: 'INPUT_SALES', sales});
                                    window.alert("Data Submitted");
                                    load.style.display = 'none';
                                    clearForm('sales-form');
                                    setPerformanceEnd('SELL_TIME');
                                });

                            }).catch((err) => {
                                console.log("error, ", err.message);
                            });

                        } else {
                            dispatch({type: 'INPUT_SALES', sales});
                            window.alert("Data Submitted");
                            load.style.display = 'none';
                            clearForm('sales-form');
                            setPerformanceEnd('SELL_TIME');
                        }

                    }).catch((err) => {
                        const error = err.message || err;
                        dispatch({type: 'INPUT_SALES_ERROR', error});
                        window.alert(error);
                        load.style.display = 'none';
                        window.location = '/';
                        setPerformanceEnd('SELL_TIME');
                    });
                } else {
                    const error = "No previous sales doc found";
                    dispatch({type: 'INPUT_SALES_ERROR', error});

                    window.alert(`ERROR: ${error}`);
                    load.style.display = 'none';
                    window.location = '/';
                    setPerformanceEnd('SELL_TIME');
                }
            })
        })
    }
}

export {makeid, leapYear, dateCheck};
