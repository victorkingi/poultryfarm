import {dateCheck, leapYear, makeid} from "./salesAction";
import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";
import {clearForm} from "../../scenes/Input Pages/scenes/Sales/components/Inputsell";

export const inputPurchase = (buys) => {
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
        const enteredMonth = parseInt(buys.month);
        const section = buys.section;
        const key = makeid(28);
        const enteredDate = parseInt(buys.date);
        const year = date.getFullYear();
        const isLeap = leapYear(year);
        let status = JSON.parse(buys.status);
        const fullName = profile.firstName + ' ' + profile.lastName;
        const item = buys.itemName || buys.vaccineName || buys.drugName || buys.labourName;
        const buyDocRef = firestore.collection("buys").doc();
        const currentDocRef = firestore.collection("current").doc(fullName);
        const bagsDocRef = firestore.collection("bags").doc("CurrentBags");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const oweJeffDocRef = firestore.collection("oweJeff").doc("Amount");
        const otherDebtDocRef = firestore.collection("otherDebt").doc();
        const total = parseInt(buys.objectNo) * parseInt(buys.objectPrice);
        const load = document.getElementById("loading-buys");

        const dateChecks = dateCheck(enteredMonth, enteredDate, isLeap);

        if (section === "Feeds") {
            buys.status = false
            status = false
        }


        if (dateChecks) {
            const error = "ERROR: Impossible date entered!";
            dispatch({type: 'INPUT_BUYING_ERROR', error});

            window.alert(error);
            return new Error("ERROR: Impossible date entered!");
        }

        firestore.collection('buys').orderBy("submittedOn", "desc").limit(1).get().then(function (snapshot) {
            if (snapshot.size === 0) {
                return new Error("ERROR: Contact admin for help!");
            }

            snapshot.docs.forEach(function (doc) {
                const prevWeeklySpend = parseInt(doc.data().weeklySpend);
                const prevMonthlySpend = parseInt(doc.data().monthlySpend);
                const newWeeklySpend = total + prevWeeklySpend;
                const newMonthlySpend = total + prevMonthlySpend;
                const newMonth = enteredMonth - 1;

                firestore.collection("buys")
                    .where("docId", "==", `Month ${enteredMonth} Date ${enteredDate} ${section}: ${item}`).get()
                    .then((query) => {
                        if (query.size !== 0) {
                            const error = "ERROR: Data already exists!";
                            dispatch({type: 'INPUT_BUYING_ERROR', error});
                            window.alert(error);
                            load.style.display = 'none';
                            window.location = '/';

                            setPerformanceEnd('PURCHASE_TIME');
                            return new Error(error);
                        } else {
                            return firestore.runTransaction(function (transaction) {
                                return transaction.get(currentDocRef).then((currentDoc) => {
                                    return transaction.get(buyDocRef).then((_buyDoc) => {
                                        function commonTransactions() {
                                            if (section === "Feeds") {
                                                transaction.update(bagsDocRef, {
                                                    cloud: false,
                                                    number: firestore.FieldValue.increment(parseInt(buys.objectNo)),
                                                    key: key,
                                                    counter: new Date(year, newMonth, enteredDate, getHours, getMinutes, getSeconds),
                                                    date: new Date(year, newMonth, enteredDate, getHours, getMinutes, getSeconds),
                                                    submittedBy: fullName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                });
                                            }

                                            transaction.set(buyDocRef, {
                                                ...buys,
                                                cloud: false,
                                                docId: `Month ${enteredMonth} Date ${enteredDate} ${section}: ${item}`,
                                                key: key,
                                                usedWeek: false,
                                                usedMonth: false,
                                                weeklySpend: newWeeklySpend,
                                                monthlySpend: newMonthlySpend,
                                                date: new Date(year, newMonth, enteredDate, getHours, getMinutes, getSeconds),
                                                submittedBy: fullName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            });
                                        }

                                        if (_buyDoc.exists) {
                                            return Promise.reject("ERROR: Data already exists!");

                                        } else {
                                            if (user.uid && status) {
                                                if (currentDoc.exists) {
                                                    const currentData = currentDoc.data();
                                                    const currentTotal = parseInt(currentData.balance) - total;
                                                    const final = parseInt(currentTotal);

                                                    if (final < 0 && user.email !== "jeffkarue@gmail.com") {
                                                        return Promise.reject("ERROR: Insufficient funds!");
                                                    } else if (final < 0 && user.email === "jeffkarue@gmail.com") {
                                                        transaction.update(currentDocRef, {
                                                            cloud: false,
                                                            balance: 0,
                                                            submittedBy: fullName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });

                                                        const newFinal = final * -1;

                                                        if (oweJeffDocRef.exists) {
                                                            transaction.update(oweJeffDocRef, {
                                                                cloud: false,
                                                                usedOn: section,
                                                                balance: firestore.FieldValue.increment(newFinal),
                                                                submittedBy: fullName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            });
                                                        }

                                                        transaction.set(userLogRef, {
                                                            cloud: false,
                                                            event: 'purchase owe Jeff ' + buys.section,
                                                            spent: newFinal,
                                                            key: key,
                                                            submittedBy: fullName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });

                                                        commonTransactions();

                                                    } else if (final === 0 || final > 0) {
                                                        transaction.set(currentDocRef, {
                                                            cloud: false,
                                                            balance: final,
                                                            fullName: profile.firstName + ' ' + profile.lastName,
                                                            submittedBy: fullName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });

                                                        transaction.set(userLogRef, {
                                                            cloud: false,
                                                            event: 'purchase ' + buys.section,
                                                            spent: total,
                                                            key: key,
                                                            submittedBy: fullName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        });

                                                        commonTransactions();

                                                    }
                                                } else {
                                                    return new Error("Doc doesn't exist");
                                                }
                                            } else if (user.uid && !status) {
                                                transaction.set(otherDebtDocRef, {
                                                    cloud: false,
                                                    docId: `Month ${enteredMonth} Date ${enteredDate} ${section}: ${item}`,
                                                    debtor: buys.section,
                                                    balance: total,
                                                    key: key,
                                                    updateKey: 'new',
                                                    order: 2,
                                                    date: new Date(year, newMonth, enteredDate, getHours, getMinutes, getSeconds),
                                                    submittedBy: fullName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                });

                                                commonTransactions();

                                                transaction.set(userLogRef, {
                                                    cloud: false,
                                                    event: 'purchase owe ' + buys.section,
                                                    spent: total,
                                                    key: key,
                                                    submittedBy: fullName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                });
                                            } else {
                                                return Promise.reject("ERROR: Contact main admin for help!");
                                            }
                                        }
                                    })
                                })
                            }).then(() => {
                                dispatch({type: 'INPUT_BUYING', buys});
                                window.alert("Data Submitted");
                                load.style.display = 'none';
                                clearForm('buys-form');

                                setPerformanceEnd('PURCHASE_TIME');

                            }).catch(function (err) {
                                const error = err.message || err;

                                dispatch({type: 'INPUT_BUYING_ERROR', error});
                                window.alert(error);
                                load.style.display = 'none';
                                window.location = '/';

                                setPerformanceEnd('PURCHASE_TIME');

                            });
                        }
                    });
            });
        })
    }
}