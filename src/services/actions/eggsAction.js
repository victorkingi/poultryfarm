import {dateCheck, leapYear} from "./salesAction";
import {setPerformanceEnd, setPerformanceStart} from "./moneyAction";
import {clearForm} from "../../scenes/Input Pages/scenes/Sales/components/Inputsell";

function isLastDay(dt) {
    const test = new Date(dt.getTime());
    test.setDate(test.getDate() + 1);
    return test.getDate() === 1;
}

//when user inputs eggs
export const inputTray = (eggs) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        setPerformanceStart();

        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const date = new Date();
        const getHours = date.getHours();
        const getMinutes = date.getMinutes();
        const getSeconds = date.getSeconds();
        const enteredMonth = parseInt(eggs.month);
        let year = undefined;
        let ans = prompt("Is this a 2020 entry?(type Y or N)");
        if (ans === "Y") {
            year = 2020;
        } else if (ans === "N") {
            year = 2021;
        } else {
            const err = new Error("invalid year entered");
            window.alert(err);
            window.location.reload();
            return 0;
        }
        const enteredDate = parseInt(eggs.date);
        const oldDate = new Date(year, enteredMonth-1, enteredDate);
        const dayOfTheWeek = oldDate.getDay();
        const endMonth = isLastDay(oldDate);
        let prevDate = enteredDate - 1;
        let prevMonth = enteredMonth;
        const isLeap = leapYear(year);
        const eggDocRef = firestore.collection("eggs").doc();
        const traysDocRef = firestore.collection("trays").doc("CurrentTrays");
        const chickenDocRef = firestore.collection("chickenDetails").doc("2020");
        const userLogRef = firestore.collection("userLogs").doc(user.uid).collection("logs").doc();
        const a1 = parseInt(eggs['A 1']);
        const a2 = parseInt(eggs['A 2']);
        const b1 = parseInt(eggs['B 1']);
        const b2 = parseInt(eggs['B 2']);
        const c1 = parseInt(eggs['C 1']);
        const c2 = parseInt(eggs['C 2']);
        const tempArr = [a1, a2, b1, b2, c1, c2];
        const house = parseInt(eggs['house']);
        const myTotal = a1 + a2 + b1 + b2 + c1 + c2 + house;
        const cagedTotal = a1 + a2 + b1 + b2 + c1 + c2;
        const cageTotal = parseInt(cagedTotal);
        const total = parseInt(myTotal);
        const load = document.getElementById("loading-eggs");
        const submit = document.getElementById("egg7");
        const finalDocId = `Month ${enteredMonth} Date ${enteredDate} Year ${year}`;


        for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i] > 75 || tempArr[i] < 0) {
                const error = new Error("Impossible values entered!");
                dispatch({type: 'INPUT_BUYING_ERROR', error});
                window.alert(error);
                submit.style.display = 'block';
                load.style.display = 'none';
                return error;
            }
        }

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

        const dateChecks = dateCheck(enteredMonth, enteredDate, isLeap)


        if (dateChecks) {
            const error = new Error("Impossible date entered!");
            dispatch({type: 'INPUT_BUYING_ERROR', error});

            window.alert(error);
            submit.style.display = 'block';
            load.style.display = 'none';
            return error;
        }

        firestore.collection("eggs").where("docId", "==", finalDocId).get()
            .then((outerQuery) => {
                if (outerQuery.size !== 0) {
                    const error = new Error("Data already exists!");
                    dispatch({type: 'INPUT_BUYING_ERROR', error});

                    window.alert(error);
                    submit.style.display = 'block';
                    load.style.display = 'none';
                    return error;
                } else {
                    firestore.collection("eggs").where("docId", "==", `Month ${prevMonth} Date ${prevDate} Year ${year}`)
                        .get().then((query) => {
                        if (query.size === 0) {
                            const error = new Error("Wrong date entered, dates are entered in chronological order!");
                            dispatch({type: 'INPUT_BUYING_ERROR', error});

                            window.alert(error);
                            submit.style.display = 'block';
                            load.style.display = 'none';
                            return error;
                        }

                       query.forEach((eggPreviousDoc) => {
                            firestore.runTransaction(function (transaction) {
                                return transaction.get(traysDocRef).then(function (trayDoc) {
                                    return  transaction.get(eggDocRef).then((_eggDoc) => {
                                    return transaction.get(chickenDocRef).then(function (chickenDoc) {
                                        if (_eggDoc.exists) {
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
                                                        const finalDate = new Date(year, enteredMonth-1, enteredDate, getHours, getMinutes, getSeconds);

                                                        if (dayOfTheWeek === 0 && endMonth) {
                                                            const weeklyAllPercent = ((prevAllWeeklyEggs / 7) / chickenNo) * 100;
                                                            const weeklyCagePercent = ((prevCageWeeklyEggs / 7) / cageNo) * 100;
                                                            const weeklyHousePercent = ((prevHouseWeeklyEggs / 7) / houseNo) * 100;
                                                            const monthAllPercent = ((prevAllMonthlyEggs / 30) / chickenNo) * 100;
                                                            const monthCagePercent = ((prevCageMonthlyEggs / 30) / cageNo) * 100;
                                                            const monthHousePercent = ((prevHouseMonthlyEggs / 30) / houseNo) * 100;

                                                            transaction.update(chickenDocRef, {
                                                                cloud: false,
                                                                weekPercent: weeklyAllPercent,
                                                                monthPercent: monthAllPercent,
                                                                weekCagePercent: weeklyCagePercent,
                                                                weekHousePercent: weeklyHousePercent,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            })

                                                            transaction.set(eggDocRef, {
                                                                ...eggs,
                                                                cloud: false,
                                                                docId: finalDocId,
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
                                                                date: finalDate,
                                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            })
                                                        } else if (dayOfTheWeek === 0) {
                                                            const weeklyAllPercent = ((prevAllWeeklyEggs / 7) / chickenNo) * 100;
                                                            const weeklyCagePercent = ((prevCageWeeklyEggs / 7) / cageNo) * 100;
                                                            const weeklyHousePercent = ((prevHouseWeeklyEggs / 7) / houseNo) * 100;

                                                            transaction.update(chickenDocRef, {
                                                                cloud: false,
                                                                weekPercent: weeklyAllPercent,
                                                                weekCagePercent: weeklyCagePercent,
                                                                weekHousePercent: weeklyHousePercent,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            })

                                                            transaction.set(eggDocRef, {
                                                                ...eggs,
                                                                cloud: false,
                                                                docId: finalDocId,
                                                                weeklyAllPercent: weeklyAllPercent,
                                                                weeklyCagePercent: weeklyCagePercent,
                                                                weeklyHousePercent: weeklyHousePercent,
                                                                allWeeklyEggs: total,
                                                                cageWeeklyEggs: cageTotal,
                                                                houseWeeklyEggs: house,
                                                                allMonthlyEggs: allMonthlyEggs,
                                                                cageMonthlyEggs: cageMonthlyEggs,
                                                                houseMonthlyEggs: houseMonthlyEggs,
                                                                date: finalDate,
                                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            })
                                                        } else if (endMonth) {
                                                            const monthAllPercent = ((prevAllMonthlyEggs / 30) / chickenNo) * 100;
                                                            const monthCagePercent = ((prevCageMonthlyEggs / 30) / cageNo) * 100;
                                                            const monthHousePercent = ((prevHouseMonthlyEggs / 30) / houseNo) * 100;

                                                            transaction.update(chickenDocRef, {
                                                                cloud: false,
                                                                monthPercent: monthAllPercent,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            })

                                                            transaction.set(eggDocRef, {
                                                                ...eggs,
                                                                cloud: false,
                                                                docId: finalDocId,
                                                                monthAllPercent: monthAllPercent,
                                                                monthCagePercent: monthCagePercent,
                                                                monthHousePercent: monthHousePercent,
                                                                allWeeklyEggs: allWeeklyEggs,
                                                                cageWeeklyEggs: cageWeeklyEggs,
                                                                houseWeeklyEggs: houseWeeklyEggs,
                                                                allMonthlyEggs: total,
                                                                cageMonthlyEggs: cageTotal,
                                                                houseMonthlyEggs: house,
                                                                date: finalDate,
                                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            })
                                                        } else {
                                                            transaction.set(eggDocRef, {
                                                                ...eggs,
                                                                cloud: false,
                                                                docId: finalDocId,
                                                                allWeeklyEggs: allWeeklyEggs,
                                                                cageWeeklyEggs: cageWeeklyEggs,
                                                                houseWeeklyEggs: houseWeeklyEggs,
                                                                allMonthlyEggs: allMonthlyEggs,
                                                                cageMonthlyEggs: cageMonthlyEggs,
                                                                houseMonthlyEggs: houseMonthlyEggs,
                                                                date: finalDate,
                                                                submittedBy: profile.firstName + ' ' + profile.lastName,
                                                                submittedOn: firestore.FieldValue.serverTimestamp()
                                                            })
                                                        }

                                                        transaction.set(traysDocRef, {
                                                            cloud: false,
                                                            number: final,
                                                            remainder: myRemainder,
                                                            submittedBy: profile.firstName + ' ' + profile.lastName,
                                                            submittedOn: firestore.FieldValue.serverTimestamp()
                                                        })

                                                        if (user.uid) {

                                                            transaction.set(userLogRef, {
                                                                cloud: false,
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
                                            } else {
                                                return Promise.reject("ERROR: doc not found!");
                                            }
                                        }
                                    })
                                    })
                                })
                            }).then(() => {
                                dispatch({type: 'INPUT_EGGS', eggs});
                                window.alert("Data submitted");
                                load.style.display = 'none';
                                clearForm('eggs-form');
                                submit.style.display = 'block';
                            }).catch((err) => {
                                const error = err.message || err;
                                dispatch({type: 'INPUT_EGGS_ERROR', error});

                                window.alert(err);
                                load.style.display = 'none';
                                window.location = '/';

                            })
                        });
                    })
                }
            })
        setPerformanceEnd('EGG_TIME');
    }
};
