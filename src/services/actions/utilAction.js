import {messaging} from "../api/firebase configurations/fbConfig";

export const hideBars = () => {
    return (dispatch) => {
        dispatch({type: 'HIDE_BARS'});
    }
}

export const handleToken = (sendTokenToServer_, renderCount) => {

    if (renderCount % 2 !== 0) {
        messaging.requestPermission()
            .then(async function () {
                const token = await messaging.getToken();
                sendTokenToServer_(token);
            })
            .catch(function (err) {
                console.log("Unable to get permission to notify.", err);
                alert("ERROR: It seems that your browser has blocked notifications. Try changing your option in settings for this site or rather, uncheck the checkbox to continue");
                const load = document.getElementById("loading");
                const submit = document.getElementById("login");

                load.style.display = 'none';
                submit.style.display = 'block';
            });
        messaging.onTokenRefresh(() => {
            messaging.getToken().then((refreshedToken) => {
                console.log('Token refreshed.');
                sendTokenToServer_(refreshedToken);
                window.location.reload();
            }).catch((err) => {
                console.log('Unable to retrieve refreshed token ', err);
                window.location.reload();
            });
        });
    } else {
        window.location.reload();
    }
}
