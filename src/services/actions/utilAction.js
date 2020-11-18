import {messaging} from "../api/firebase configurations/fbConfig";

export const hideBars = () => {
    return (dispatch) => {
        dispatch({type: 'HIDE_BARS'});
    }
}

export const handleToken = (sendTokenToServer_, renderCount) => {
    const load = document.getElementById("loading");
    const submit = document.getElementById("login");

    if (renderCount % 2 !== 0 && messaging !== null) {
        messaging.requestPermission()
            .then(async function () {
                const token = await messaging.getToken();
                sendTokenToServer_(token);
            })
            .catch(function (err) {
                console.log("Unable to get permission to notify.", err);
                window.alert("ERROR: It seems that your browser has blocked notifications. Try changing your option in settings for this site or rather, uncheck the checkbox to continue");

                load.style.display = 'none';
                submit.style.display = 'block';
            });
        messaging.onTokenRefresh(() => {
            messaging.getToken().then((refreshedToken) => {
                console.log('Token refreshed.');
                sendTokenToServer_(refreshedToken);
            }).catch((err) => {
                console.log('Unable to retrieve refreshed token ', err);
                window.alert(`ERROR: unable to retrieve messaging token ${err} uncheck box to continue`);
            });
        });
    } else if (messaging === null && renderCount % 2 !== 0 ) {
        window.alert("ERROR: This browser does not support push notifications, please uncheck the box");
        load.style.display = 'none';
        submit.style.display = 'block';
    }
    else {
        window.location.reload();
    }
}
