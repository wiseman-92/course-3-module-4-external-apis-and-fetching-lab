const weatherApi = "https://api.weather.gov/alerts/active?area="

const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsContainer = document.getElementById('alerts-display');
const errorMessageDiv = document.getElementById('error-message');

fetchButton.addEventListener('click', () => {
    const stateAbbr = stateInput.value.trim().toUpperCase();
    if (stateAbbr.length !== 2) {
        showError("Please enter a valid 2-letter state abbreviation.");
        return;
    }
    fetchWeatherAlerts(stateAbbr);
});

function fetchWeatherAlerts(state) {
    clearUI();
    toggleLoading(true);

    const url = `${weatherApi}${state}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            toggleLoading(false);
            console.log(data);
            displayAlerts(data, state);
        })
        .catch(errorObject => {
            toggleLoading(false);
            console.log(errorObject.message);
            showError(errorObject.message);
        });
}

function displayAlerts(data, state) {
    const features = data.features || [];
    const alertCount = features.length;

    const summaryMessage = `Weather Alerts: ${alertCount}`;
    const summaryElement = document.createElement('h3');
    summaryElement.textContent = summaryMessage;
    alertsContainer.appendChild(summaryElement);

    if (alertCount === 0) {
        const noAlertsElement = document.createElement('p');
        noAlertsElement.textContent = "No active alerts for this area.";
        alertsContainer.appendChild(noAlertsElement);
        return;
    }

    const ulElement = document.createElement('ul');

    features.forEach(feature => {
        const headline = feature.properties.headline || "No headline provided.";
        const liElement = document.createElement('li');
        liElement.textContent = headline;
        ulElement.appendChild(liElement);
    });

    alertsContainer.appendChild(ulElement);
}

function clearUI() {
    stateInput.value = "";
    alertsContainer.innerHTML = "";
    errorMessageDiv.textContent = "";
    errorMessageDiv.style.display = "none";
    errorMessageDiv.classList.add('hidden');
}

function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = "block";
    errorMessageDiv.classList.remove('hidden');
    errorMessageDiv.classList.add('error-style');
}

function toggleLoading(isLoading) {
    const loader = document.getElementById('loading-spinner');
    if (loader) {
        loader.style.display = isLoading ? "block" : "none";
    }
}
