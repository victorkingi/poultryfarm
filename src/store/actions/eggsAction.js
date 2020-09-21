import {dateCheck, isLastDay, leapYear} from "./salesAction";
import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";

//when user inputs eggs
export const inputTray = (eggs) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        setPerformanceStart();

        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const dayOfTheWeek = date.getDay();
        const endMonth = isLastDay(date);
        const enteredMonth = parseInt(eggs.month);
        const newMonth = enteredMonth - 1;
        const enteredDate = parseInt(eggs.date);
        let prevDate = enteredDate - 1;
        let prevMonth = enteredMonth;
        const year = date.getFullYear();
        const isLeap = leapYear(year);
        const eggDocRef = firestore.collection("eggs").doc('Month ' + enteredMonth + ' Date ' + enteredDate);
        const traysDocRef = firestore.collection("trays").doc("CurrentTrays");
        const chickenDocRef = firestore.collection("chickenDetails").doc("2020");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const a1 = parseInt(eggs['A 1']);
        const a2 = parseInt(eggs['A 2']);
        const b1 = parseInt(eggs['B 1']);
        const b2 = parseInt(eggs['B 2']);
        const c1 = parseInt(eggs['C 1']);
        const c2 = parseInt(eggs['C 2']);
        const house = parseInt(eggs['house']);
        const myTotal = a1 + a2 + b1 + b2 + c1 + c2 + house;
        const cagedTotal = a1 + a2 + b1 + b2 + c1 + c2;
        const cageTotal = parseInt(cagedTotal);
        const total = parseInt(myTotal);

        if (prevDate === 0) {
            prevMonth = prevMonth - 1;
            if (prevMonth === 1 || prevMonth === 3 || prevMonth === 5 || prevMonth === 7 || prevMonth === 8 || prevMonth === 10 || prevMonth === 12) {
                prevDate = 31;
            } else if (isLeap && prevMonth === 2) {
                prevDate = 29;
            } else if (prevMonth === 2) {
                prevDate = 28;
            } else {
                prevDate = 30
            }
        }

        const eggPreviousDocRef = firestore.collection("eggs").doc('Month ' + prevMonth + ' Date ' + prevDate);

        const dateChecks = dateCheck(enteredMonth, enteredDate, isLeap)


        if (dateChecks) {
            const error = "ERROR: Impossible date entered!";
            dispatch({type: 'INPUT_BUYING_ERROR', error});

            window.alert(error);
            window.location = '/';
            return new Error("ERROR: Impossible date entered!");
        }

        firestore.runTransaction(function (transaction) {

            return transaction.get(eggDocRef).then(function (eggDoc) {
                return transaction.get(traysDocRef).then(function (trayDoc) {
                    return transaction.get(chickenDocRef).then(function (chickenDoc) {
                        return transaction.get(eggPreviousDocRef).then(function (eggPreviousDoc) {
                            if (eggDoc.exists) {
                                return Promise.reject("ERROR: Data already exists!");
                            } else {
                                if (eggPreviousDoc.exists) {
                                    if (trayDoc.exists) {
                                        if (chickenDoc.exists) {
                                            const data = trayDoc.data();
                                            const remNum = parseInt(data.remainder);
                                            const trayNum = parseInt(data.number);
                                            const myTotal = total + remNum;
                                            const myTrays = Math.floor(myTotal / 30);
                                            const final = myTrays + trayNum;
                                            const myRemainder = myTotal % 30;
                                            const chickenNo = parseInt(chickenDoc.data().total);
                                            const prevAllWeeklyEggs = parseInt(eggPreviousDoc.data().allWeeklyEggs);
                                            const prevCageWeeklyEggs = parseInt(eggPreviousDoc.data().cageWeeklyEggs);
                                            const prevHouseWeeklyEggs = parseInt(eggPreviousDoc.data().houseWeeklyEggs);
                                            const prevAllMonthlyEggs = parseInt(eggPreviousDoc.data().allMonthlyEggs);
                                            const prevCageMonthlyEggs = parseInt(eggPreviousDoc.data().cageMonthlyEggs);
                                            const prevHouseMonthlyEggs = parseInt(eggPreviousDoc.data().houseMonthlyEggs);
                                            const cageNo = parseInt(chickenDoc.data().cage);
                                            const houseNo = parseInt(chickenDoc.data().house);
                                            let allWeeklyEggs = total + prevAllWeeklyEggs;
                                            let houseWeeklyEggs = house + prevHouseWeeklyEggs;
                                            let cageWeeklyEggs = cageTotal + prevCageWeeklyEggs;
                                            let allMonthlyEggs = total + prevAllMonthlyEggs;
                                            let houseMonthlyEggs = house + prevHouseMonthlyEggs;
                                            let cageMonthlyEggs = cageTotal + prevCageMonthlyEggs;

                                            if (dayOfTheWeek === 0 && endMonth) {
                                                const weeklyAllPercent = ((prevAllWeeklyEggs / 7) / chickenNo) * 100;
                                                const weeklyCagePercent = ((prevCageWeeklyEggs / 7) / cageNo) * 100;
                                                const weeklyHousePercent = ((prevHouseWeeklyEggs / 7) / houseNo) * 100;
                                                const monthAllPercent = ((prevAllMonthlyEggs / 30) / chickenNo) * 100;
                                                const monthCagePercent = ((prevCageMonthlyEggs / 30) / cageNo) * 100;
                                                const monthHousePercent = ((prevHouseMonthlyEggs / 30) / houseNo) * 100;

                                                transaction.update(chickenDocRef, {
                                                    weekPercent: weeklyAllPercent,
                                                    monthPercent: monthAllPercent,
                                                    weekCagePercent: weeklyCagePercent,
                                                    weekHousePercent: weeklyHousePercent,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                })

                                                transaction.set(eggDocRef, {
                                                    ...eggs,
                                                    weeklyAllPercent: weeklyAllPercent,
                                                    weeklyCagePercent: weeklyCagePercent,
                                                    weeklyHousePercent: weeklyHousePercent,
                                                    monthAllPercent: monthAllPercent,
                                                    monthCagePercent: monthCagePercent,
                                                    monthHousePercent: monthHousePercent,
                                                    allWeeklyEggs: total,
                                                    cageWeeklyEggs: cageTotal,
                                                    houseWeeklyEggs: house,
                                                    allMonthlyEggs: total,
                                                    cageMonthlyEggs: cageTotal,
                                                    houseMonthlyEggs: house,
                                                    date: new Date(year, newMonth, enteredDate),
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                })
                                            } else if (dayOfTheWeek === 0) {
                                                const weeklyAllPercent = ((prevAllWeeklyEggs / 7) / chickenNo) * 100;
                                                const weeklyCagePercent = ((prevCageWeeklyEggs / 7) / cageNo) * 100;
                                                const weeklyHousePercent = ((prevHouseWeeklyEggs / 7) / houseNo) * 100;

                                                transaction.update(chickenDocRef, {
                                                    weekPercent: weeklyAllPercent,
                                                    weekCagePercent: weeklyCagePercent,
                                                    weekHousePercent: weeklyHousePercent,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                })

                                                transaction.set(eggDocRef, {
                                                    ...eggs,
                                                    weeklyAllPercent: weeklyAllPercent,
                                                    weeklyCagePercent: weeklyCagePercent,
                                                    weeklyHousePercent: weeklyHousePercent,
                                                    allWeeklyEggs: total,
                                                    cageWeeklyEggs: cageTotal,
                                                    houseWeeklyEggs: house,
                                                    allMonthlyEggs: allMonthlyEggs,
                                                    cageMonthlyEggs: cageMonthlyEggs,
                                                    houseMonthlyEggs: houseMonthlyEggs,
                                                    date: new Date(year, newMonth, enteredDate),
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                })
                                            } else if (endMonth) {
                                                const monthAllPercent = ((prevAllMonthlyEggs / 30) / chickenNo) * 100;
                                                const monthCagePercent = ((prevCageMonthlyEggs / 30) / cageNo) * 100;
                                                const monthHousePercent = ((prevHouseMonthlyEggs / 30) / houseNo) * 100;

                                                transaction.update(chickenDocRef, {
                                                    monthPercent: monthAllPercent,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                })

                                                transaction.set(eggDocRef, {
                                                    ...eggs,
                                                    monthAllPercent: monthAllPercent,
                                                    monthCagePercent: monthCagePercent,
                                                    monthHousePercent: monthHousePercent,
                                                    allWeeklyEggs: allWeeklyEggs,
                                                    cageWeeklyEggs: cageWeeklyEggs,
                                                    houseWeeklyEggs: houseWeeklyEggs,
                                                    allMonthlyEggs: total,
                                                    cageMonthlyEggs: cageTotal,
                                                    houseMonthlyEggs: house,
                                                    date: new Date(year, newMonth, enteredDate),
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                })
                                            } else {
                                                transaction.set(eggDocRef, {
                                                    ...eggs,
                                                    allWeeklyEggs: allWeeklyEggs,
                                                    cageWeeklyEggs: cageWeeklyEggs,
                                                    houseWeeklyEggs: houseWeeklyEggs,
                                                    allMonthlyEggs: allMonthlyEggs,
                                                    cageMonthlyEggs: cageMonthlyEggs,
                                                    houseMonthlyEggs: houseMonthlyEggs,
                                                    date: new Date(year, newMonth, enteredDate),
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                })
                                            }

                                            transaction.set(traysDocRef, {
                                                number: final,
                                                remainder: myRemainder,
                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                            })

                                            if (user.uid) {

                                                transaction.set(userLogRef, {
                                                    event: 'eggs collected',
                                                    total: total,
                                                    submittedBy: profile.firstName + ' ' + profile.lastName,
                                                    submittedOn: firestore.FieldValue.serverTimestamp()
                                                });

                                            } else {
                                                return Promise.reject("ERROR: Contact admin for help!");
                                            }
                                        } else {
                                            return Promise.reject("ERROR: doc not found!");
                                        }

                                    } else {
                                        return Promise.reject("ERROR: No tray doc found!");
                                    }
                                }
                            }
                        })
                    })
                })
            })
        }).then(() => {
            dispatch({type: 'INPUT_EGGS', eggs});
            window.alert("Data submitted");
            window.location = '/';
        }).catch((err) => {
            const error = err.message || err;
            dispatch({type: 'INPUT_EGGS_ERROR', error});

            window.alert(err);
            window.location = '/';
        })

        setPerformanceEnd('EGG_TIME');
    }
};
