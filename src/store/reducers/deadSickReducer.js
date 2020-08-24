const initState = {}

const deadSickReducer = (state = initState, action) => {
    switch (action.type) {
        case 'UPLOAD_DONE':
            console.log('uploaded');
            window.alert("Upload successful");
            return state;
        case 'SUBMIT':
            console.log('submitted');
            window.alert("Submitted successfully");
            return state;
        case 'UPLOAD_ERROR':
            console.log('upload error', action.err);
            window.alert("ERROR: " + action.err);
            return state;
        case 'DOC_EXISTS':
            console.log('doc exists', action.err);
            window.alert("ERROR: " + action.err);
            return state;
        case 'DOWNLOAD_ERROR':
            console.log('download error', action.err);
            window.alert("ERROR: " + action.err);
            return state;
        default:
            return state;
    }
}

export default deadSickReducer;
