document.addEventListener('DOMContentLoaded', () => {

    // ELEMENTS
    const locationIdElement = document.getElementById('locationId');
    const startDateElement = document.getElementById('startDate');
    const endDateElement = document.getElementById('endDate');

    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    // Span Listeners
    const runningSpan = document.getElementById('runningSpan');
    const stoppedSpan = document.getElementById('stoppedSpan');

    // Error Listeners
    const locationIdError = document.getElementById('locationIdError');
    const startDateError = document.getElementById('startDateError');
    const endDateError = document.getElementById('endDateError');

    const hideElement = (element) => {
        element.style.display = 'none';
    }

    const showElement = (element) => {
        element.style.display = "";
    }

    const disableElement = (element) => {
        element.disabled = true;
    }

    const enableElement = (element) => {
        element.disabled = false;
    }

    console.log('Elements:', {
        locationIdElement,
        startDateElement,
        endDateElement,
        locationIdError,
        startDateError,
        endDateError,
    });


    // EVENT LISTENERS
    startButton.onclick = () => {
        const allFieldIsValid = performValidationOnStart();
        if(allFieldIsValid) {
            handleOnStartState();
            const prefs = {
                locationId: locationIdElement.value,
                startDate: startDateElement.value,
                endDate: endDateElement.value,
                tzData: locationIdElement.options[locationIdElement.selectedIndex].getAttribute('data-tz')
            }
            chrome.runtime.sendMessage({ event: "onStart", prefs })
        }
        
    }
    stopButton.onclick = () => {
        handleOnStopState();
        const prefs = {
            locationId: "",
            startDate: "",
            endDate: ""
        }
        chrome.runtime.sendMessage({ event: "onStop", prefs: prefs })
    }

    chrome.storage.local.get(["locationId", "startDate", "endDate", "locations", "isRunning"], (result) => {
        const { locationId, startDate, endDate, locations, isRunning} = result;
        console.log("Daten aus local storage abgerufen:", result);
        console.log("data.prefs73", result);
        setLocations(locations);
        if(locationId) {
            locationIdElement.value = locationId; 
        }
        if(startDate) {
            startDateElement.value = startDate;
        }
        if(endDate) {
            endDateElement.value = endDate;
        }
        if(isRunning) {
            handleOnStartState();
        }
        else {
            handleOnStopState();
        }
    })

    const handleOnStartState = () => {
        // Span
        showElement(runningSpan);
        hideElement(stoppedSpan);
        // Button
        disableElement(startButton);
        enableElement(stopButton);
        // Inputs
        disableElement(locationIdElement);
        disableElement(startDateElement);
        disableElement(endDateElement);
    }

    const handleOnStopState = () => {
        showElement(stoppedSpan);
        hideElement(runningSpan);
        // Button
        enableElement(startButton);
        disableElement(stopButton);
        // Inputs
        enableElement(locationIdElement);
        enableElement(startDateElement);
        enableElement(endDateElement);
    }

    const performValidationOnStart = () => {
        if(!locationIdElement.value) {
            showElement(locationIdError);
        }
        else {
            hideElement(locationIdError);
        }
        if(!startDateElement.value) {
            showElement(startDateError);
        }
        else {
            hideElement(startDateError);
        }
        if(!endDateElement.value) {
            showElement(endDateError);
        }
        else {
            hideElement(endDateError);
        }
        console.log(locationIdElement, startDateElement, endDateElement);
        return locationIdElement.value && startDateElement.value && endDateElement.value;
    }

    const setLocations = (locations) => {
        locations.forEach(location => {
            const optionElement = document.createElement('option');
            optionElement.value = location.id;
            optionElement.innerHTML = location.shortName;
            optionElement.setAttribute('data-tz', location.tzData);
            locationIdElement.appendChild(optionElement);
        });
    }

});