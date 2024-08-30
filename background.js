import fetchLocations from "./api/fetchLocations.js";

const ALARM_JOB_NAME = "DROP-ALARM";

chrome.runtime.onInstalled.addListener(details => {
    fetchLocations();
});  

chrome.runtime.onMessage.addListener( data => {
    const { event, prefs } = data;
    switch(event) {
        case "onStart":
            handleOnStart(prefs);
            break;
        case "onStop":
            handleOnStop();
            break;
        default:
            break;
    }
});

const handleOnStart = (prefs) => {
    console.log("onStart in BG:");
    console.log("onStart:", prefs);
    chrome.storage.local.set({
        locationId: prefs.locationId,
        startDate: prefs.startDate,
        endDate: prefs.endDate,
        tzData: prefs.tzData
    }, () => {
        console.log("prefs set in BG");
    });
    createAlarm();
    setRunningStatus(true);
};


const handleOnStop = () => {
    console.log("onStop in BG:");
    stopAlarm();
    setRunningStatus(false);
};

const setRunningStatus = (isRunning) => {
    chrome.storage.local.set({ isRunning }, () => {
        console.log("isRunning set in BG", isRunning);
    });
};


const createAlarm = () => {
    chrome.alarms.get(ALARM_JOB_NAME, existingAlarm => {
        if (!existingAlarm) {
            chrome.alarms.create(ALARM_JOB_NAME, {
                delayInMinutes: 1,
                periodInMinutes: 1
            });
        }
    });
};

const stopAlarm = () => {
    chrome.alarms.clearAll();
};

chrome.alarms.onAlarm.addListener(() => {
    console.log("Alarm sheduling on running the code...");
});