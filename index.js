// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="


async function fetchWeatherAlerts(state) {
    const response = await fetch(`${weatherApi}${state}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}


function displayAlerts(data) {
    const displayDiv = document.querySelector('#alerts-display');
    const alerts = data.features || [];
    displayDiv.innerHTML = `<h2>${data.title}: ${alerts.length}</h2>`;
    if (alerts.length > 0) {
        const list = document.createElement('ul');
        alerts.forEach(alert => {
            const li = document.createElement('li');
            li.textContent = alert.properties.headline;
            list.appendChild(li);
        });
        displayDiv.appendChild(list);
    } else {
        displayDiv.innerHTML += '<p>No active weather alerts for this state.</p>';
    }
}


function showError(message) {
    const errorDiv = document.querySelector('#error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}


function clearError() {
    const errorDiv = document.querySelector('#error-message');
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
}


function clearInput() {
    const input = document.querySelector('#state-input');
}


document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#fetch-alerts');
    const input = document.querySelector('#state-input');

    button.addEventListener('click', async () => {
        const state = input.value.trim();
        if (!state) {
            showError('Please enter a state abbreviation');
            return;
        }
        clearInput();
        try {
            const data = await fetchWeatherAlerts(state);
            displayAlerts(data);
            clearError();
        } catch (error) {
            showError(error.message);
        }
    });
});
