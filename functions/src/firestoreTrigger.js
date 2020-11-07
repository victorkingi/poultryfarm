const scheduleExports = require('./scheduled');
const makeANotification = scheduleExports.makeANotification;
const makeANotificationToOneUser = scheduleExports.makeANotificationToOneUser;

const numeral = require('numeral');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const date = new Date();
const current = date.getDate();
const currentMonth = date.getMonth() + 1;
const getHour = date.getHours();
const year = date.getFullYear();

const createNotification = (notification => {
    return admin.firestore().collection('notifications')
        .add(notification)
        .then(doc => console.log('notification added', doc));
});

exports.checkLayingPercentage = functions.firestore.document('chickenDetails/2020')
    .onWrite(((change) => {
        const prevData = change.before.data();
        const newData = change.after.data();
        const prevCage = parseInt(prevData.weekCagePercent);
        const prevHouse = parseInt(prevData.weekHousePercent);
        const newCage = parseInt(newData.weekCagePercent);
        const newHouse = parseInt(newData.weekHousePercent);
        let cageDif = newCage - prevCage;
        let houseDif = newHouse - prevHouse;

        if (cageDif < 0) {
            cageDif = cageDif * -1;
            const rounded = Math.round((cageDif + Number.EPSILON) * 100) / 100;
            const details = {
                title: `${rounded}% decrease in Laying Percentage`,
                body: `Cage Laying Percentage decreased by ${rounded}% this week`
            };
            makeANotification(details);
        } else if (cageDif > 0) {
            const rounded = Math.round((cageDif + Number.EPSILON) * 100) / 100;
            const details = {
                title: `${rounded}% increase in Laying Percentage`,
                body: `Cage Laying Percentage increased by ${rounded}% this week`
            };
            makeANotification(details);
        }

        if (houseDif < 0) {
            houseDif = houseDif * -1;
            const rounded = Math.round((houseDif + Number.EPSILON) * 100) / 100;
            const details = {
                title: `${rounded}% decrease in Laying Percentage`,
                body: `House Laying Percentage decreased by ${rounded}% this week`
            };
            makeANotification(details);
        } else if (houseDif > 0) {
            const rounded = Math.round((houseDif + Number.EPSILON) * 100) / 100;
            const details = {
                title: `${rounded}% increase in Laying Percentage`,
                body: `House Laying Percentage increased by ${rounded}% this week`
            };
            makeANotification(details);
        }

        return null;
    }))

exports.whatToNotify = functions.firestore.document('userLogs/{userId}/logs/{logId}').onCreate(
    (snap) => {
        const data = snap.data();
        const event = data.event || null;
        const halfEvent = event.substring(0, 4);
        const _halfEvent = event.indexOf("borrowed");
        const borrow_name = event.substr(0, event.indexOf(" b"));
        const amount = parseInt(data.amount);
        const name = data.submittedBy;
        const firstName = name.substring(0, event.lastIndexOf(" "));
        let details;

        if (halfEvent === "sent") {
            if (data.receiver === "Bank Account") {
                details = `Ksh.${numeral(amount).format("0,0")} sent to Bank by ${firstName}`;
            } else {
                const receive = data.receiver;

                details = {
                    message: `You Have Received Ksh.${numeral(amount).format("0,0")} from ${firstName}`,
                    name: receive
                }
                return makeANotificationToOneUser(details);
            }

            return makeANotification(details);
        } else if (_halfEvent !== -1) {
            const details = `${borrow_name} borrowed Ksh.${numeral(amount).format("0,0")} from ${firstName}`;

            return makeANotification(details);
        }
        return null;
    }
)

exports.bags = functions.firestore.document('bags/CurrentBags').onWrite(
    ((change) => {
        const data = change.after.data();
        const num = parseInt(data.number);

        if (num === 0) {
            const details = {
                message: `No Bags of feeds in store!`,
                name: 'Purity'
            }
            return makeANotification(details);
        } else if (num <= 3) {
            const details = {
                message: `Feeds in Store are less than 3!`,
                name: 'dummy'
            }
            return makeANotification(details);
        }

        return null;
    })
)

exports.deadSick = functions.firestore.document('deadSick/{deadsickId}').onCreate(
    ((snap) => {
        const ds = snap.data();
        const name = ds.submittedBy || '';
        const section = ds.section || '';
        const num = parseInt(ds.chickenNo);
        let notification;
        let details;

        if (section === "Dead") {
            if (num === 1) {
                notification = {
                    content: '1 Chicken Died!',
                    user: `${name}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }
                details = `A chicken died`;
            } else {
                notification = {
                    content: 'Some Chickens Died!',
                    user: `${name}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }
                details = `Some chickens died`;
            }
        } else if (section === "Sick") {
            if (num === 1) {
                notification = {
                    content: '1 Chicken is sick!',
                    user: `${name}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }
                details = `A chicken is sick!`;
            } else {
                notification = {
                    content: 'Some Chickens are sick!',
                    user: `${name}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }
                details = `Some chickens are sick!`;
            }
        }
        createNotification(notification).catch((err) => {
            return console.log(err);
        });

        return makeANotification(details);
    })
)

exports.trays = functions.firestore.document('trays/CurrentTrays').onWrite(
    ((change) => {
        const data = change.after.data();
        const num = parseInt(data.number);
        const time = data.submittedOn.toDate();
        const newHour = time.getHours();

        if (newHour === getHour && time.getDate() === current && time.getMonth() === currentMonth - 1
            && year === time.getFullYear()) {
            return null;
        }

        if (num <= 10) {
            const details = {
                message: `Less than 10 trays in store!`,
                name: 'dummy'
            }
            return makeANotification(details);
        } else if (num > 70) {
            const details = {
                message: `More than 70 trays in store!`,
                name: 'dummy'
            }
            return makeANotification(details);
        }
        return null;
    })
)

exports.buysMade = functions.firestore.document('buys/{buyId}')
    .onCreate((snap) => {
        const buy = snap.data();
        const name = buy.submittedBy;
        const firstName = name.substring(0, name.lastIndexOf(" "));
        const feeds = buy.section === "Feeds" ? " Bags of Feeds" : ""
        const item = buy.itemName || buy.vaccineName || buy.drugName || buy.labourName || buy.section;
        const notification = {
            content: 'Made a purchase!',
            user: `${buy.submittedBy}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        createNotification(notification).catch((err) => {
            return console.log(err);
        });

        const details = {
            message: `${firstName} bought ${buy.objectNo}${feeds}: ${item}!`,
            name: 'dummy'
        };

        return makeANotification(details);

    });

exports.salesMade = functions.firestore.document('sales/{saleId}')
    .onCreate((snap) => {
        const sale = snap.data();
        const buyerName = snap.data().buyerName || '';
        let convertedBuyerName;
        const name = sale.submittedBy || '';
        const firstName = name.substring(0, name.lastIndexOf(" "));

        if (buyerName) {
            //first letter should always be uppercase
            convertedBuyerName = buyerName.charAt(0).toUpperCase() + buyerName.slice(1);
            snap.ref.update({
                buyerName: convertedBuyerName
            }).then(() => {
                return console.log("name changed")
            })
                .catch((err) => {
                    return console.error(err)
                })
        }

        let details;
        const notification = {
            content: 'Made a sale!',
            user: `${sale.submittedBy}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        createNotification(notification).then(() => console.log("notification made")).catch((err) => {
            console.error(err)
        });
        if (sale.trayNo) {
            if (parseInt(sale.trayNo) === 1) {
                details = {
                    message: `${firstName} sold ${sale.trayNo} tray!`,
                    name: firstName
                }
            } else {
                details = {
                    message: `${firstName} sold ${sale.trayNo} trays!`,
                    name: firstName
                }
            }
        } else if (sale.chickenNo) {
            if (parseInt(sale.chickenNo) === 1) {
                details = {
                    message: `${firstName} sold ${sale.chickenNo} chicken!`,
                    name: firstName
                }
            } else {
                details = {
                    message: `${firstName} sold ${sale.chickenNo} chickens!`,
                    name: firstName
                }
            }
        }
        return makeANotification(details);

    });

exports.latestNews = functions.firestore.document('latestNews/{newsId}')
    .onWrite((change) => {
        const news = change.after.data();
        const title = news.title || '';
        const provider = news.provider || '';
        const notification = {
            content: `Latest poultry news update!`,
            user: `${provider}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        createNotification(notification).then(() => console.log("notification made")).catch((err) => {
            console.error(err)
        });

        const details = {
            title: `Latest Poultry News from ${provider}`,
            body: title
        }

        return makeANotification(details);

    });


