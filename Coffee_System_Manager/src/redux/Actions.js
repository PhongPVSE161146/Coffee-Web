// actions/userActions.js

// Action types
// Portal request
export const FETCH_PORTAL_REQUEST = 'FETCH_PORTAL_REQUEST';
export const FETCH_PORTAL_REQUESTSUCCESS = 'FETCH_PORTAL_REQUESTSUCCESS';
export const FETCH_PORTAL_REQUESTFAILURE = 'FETCH_PORTAL_REQUESTFAILURE';
export const SAVE_GPA_DATA = 'SAVE_GPA_DATA';
//Classlist request
export const FETCH_CLASSLIST_REQUEST = 'FETCH_CLASSLIST_REQUEST';
export const FETCH_CLASSLIST_REQUESTSUCCESS = 'FETCH_CLASSLIST_REQUESTSUCCESS';
export const FETCH_CLASSLIST_REQUESTFAILURE = 'FETCH_CLASSLIST_REQUESTFAILURE';
export const SAVE_CLASSLIST_DATA = 'SAVE_CLASSLIST_DATA';
//Schedule Tracker request
export const FETCH_SCHEDULETRACKERTRAINING_REQUEST = 'FETCH_SCHEDULETRACKERTRAINING_REQUEST';
export const FETCH_SCHEDULETRACKERTRAINING_REQUESTSUCCESS = 'FETCH_SCHEDULETRACKERTRAINING_REQUESTSUCCESS';
export const FETCH_SCHEDULETRACKERTRAINING_REQUESTFAILURE = 'FETCH_SCHEDULETRACKERTRAINING_REQUESTFAILURE';

export const FETCH_SCHEDULETRACKERREPORT_REQUEST = 'FETCH_SCHEDULETRACKERREPORT_REQUEST';
export const FETCH_SCHEDULETRACKERREPORT_REQUESTSUCCESS = 'FETCH_SCHEDULETRACKERREPORT_REQUESTSUCCESS';
export const FETCH_SCHEDULETRACKERREPORT_REQUESTFAILURE = 'FETCH_SCHEDULETRACKERREPORT_REQUESTFAILURE';

export const SAVE_SCHEDULETRACKER_DATA = 'SAVE_SCHEDULETRACKER_DATA';

//Unit Price request
export const FETCH_UNITPRICE_REQUEST = 'FETCH_UNITPRICE_REQUEST';
export const FETCH_UNITPRICE_REQUESTSUCCESS = 'FETCH_UNITPRICE_REQUESTSUCCESS';
export const FETCH_UNITPRICE_REQUESTFAILURE = 'FETCH_UNITPRICE_REQUESTFAILURE';
export const SAVE_UNITPRICE_DATA = 'SAVE_UNITPRICE_DATA';



// Portal actions
export const fetchPortalRequest = () => ({
    type: FETCH_PORTAL_REQUEST,
});

export const fetchPortalSuccess = (success) => ({
    type: FETCH_PORTAL_REQUESTSUCCESS,
    payload: success,
});

export const fetchPortalFailure = (error) => ({
    type: FETCH_PORTAL_REQUESTFAILURE,
    payload: error,
});
export const saveGPAData = (filterOptions) => ({
    type: SAVE_GPA_DATA,
    payload: filterOptions,
});

// ClassList actions
export const fetchClassListRequest = () => ({
    type: FETCH_CLASSLIST_REQUEST,
});

export const fetchClassListSuccess = (success) => ({
    type: FETCH_CLASSLIST_REQUESTSUCCESS,
    payload: success,
});

export const fetchClassListFailure = (error) => ({
    type: FETCH_CLASSLIST_REQUESTFAILURE,
    payload: error,
});
export const saveClassListData = (filterOptions) => ({
    type: SAVE_CLASSLIST_DATA,
    payload: filterOptions,
});

// ScheduleTracker Traininhg actions
export const fetchScheduleTrackerTrainningRequest = () => ({
    type: FETCH_SCHEDULETRACKERTRAINING_REQUEST,
});

export const fetchScheduleTrackerTrainningSuccess = (success) => ({
    type: FETCH_SCHEDULETRACKERTRAINING_REQUESTSUCCESS,
    payload: success,
});

export const fetchScheduleTrackerTrainningFailure = (error) => ({
    type: FETCH_SCHEDULETRACKERTRAINING_REQUESTFAILURE,
    payload: error,
});
//ScheduleTracker Report actions
export const fetchScheduleTrackerReportRequest = () => ({
    type: FETCH_SCHEDULETRACKERREPORT_REQUEST,
});

export const fetchScheduleTrackerReportSuccess = (success) => ({
    type: FETCH_SCHEDULETRACKERREPORT_REQUESTSUCCESS,
    payload: success,
});

export const fetchScheduleTrackerReportFailure = (error) => ({
    type: FETCH_SCHEDULETRACKERREPORT_REQUESTFAILURE,
    payload: error,
});

export const saveScheduleTrackerData = (filterOptions) => ({
    type: SAVE_SCHEDULETRACKER_DATA,
    payload: filterOptions,
});

//Unit Price actions
export const fetchUnitPriceRequest = () => ({
    type: FETCH_UNITPRICE_REQUEST,
});

export const fetchUnitPriceSuccess = (success) => ({
    type: FETCH_UNITPRICE_REQUESTSUCCESS,
    payload: success,
});

export const fetchUnitPriceFailure = (error) => ({
    type: FETCH_UNITPRICE_REQUESTFAILURE,
    payload: error,
});
export const saveUnitPriceData = (filterOptions) => ({
    type: SAVE_UNITPRICE_DATA,
    payload: filterOptions,
});