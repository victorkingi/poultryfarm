const initState = {}

const deadSickReducer = (state = initState, action) => {
    switch (action.type) {
        case 'UPLOAD_DONE':
            console.log('uploaded');
            return state;
        case 'SUBMIT':
            console.log('submitted');
            return state;
        case 'UPLOAD_ERROR':
            window.location = '/';
            console.log('upload error', action.err);
            window.alert("ERROR: " + action.err);
            return state;
        case 'DOC_EXISTS':
            window.location = '/';
            console.log('doc exists', action.err);
            window.alert("ERROR: " + action.err);
            return state;
        case 'DOWNLOAD_ERROR':
            window.location = '/';
            console.log('download error', action.err);
            window.alert("ERROR: " + action.err);
            return state;
        default:
            return state;
    }
}

export default deadSickReducer;
