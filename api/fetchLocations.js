const LOCATION_ENDPOINT = "https://ttp.cbp.dhs.gov/schedulerapi/locations/?temporary=false&inviteOnly=false&operational=true&serviceName=Global+Entry";

export default function fetchLocations() {
    fetch(LOCATION_ENDPOINT)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            const filterLocations = data.map(loc => {
                return {
                    "id": loc.id,
                    "name": loc.name,
                    "shortName": loc.shortName,
                    "tzData": loc.tzData
                }
            });
            console.log(filterLocations);
            chrome.storage.local.set({locations: filterLocations}, () => {
                console.log("locations set in BG");
            })
        })
        .catch(error => {
            console.log("error", error);
        });
};