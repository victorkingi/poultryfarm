const admin = require('firebase-admin');
admin.initializeApp();

const handleFCMTokens = require('./src/handleFCMTokens');
const sendNotificationTriggers = require('./src/sendNotificationTriggers');
const utils = require('./src/utils');

exports.handleFCMTokens = handleFCMTokens;
exports.sendNotificationTriggers = sendNotificationTriggers;
exports.utils = utils;