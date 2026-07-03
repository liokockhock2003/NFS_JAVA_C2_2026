const API_BASE_URL = "http://localhost:8081/api";

// Write your JavaScript here.

// --- Select the HTML elements ---
const loadButton = document.getElementById("loadButton");
const statusText = document.getElementById("statusText");
const eventList = document.getElementById("eventList");

// Challenge (search by id) elements
const eventIdInput = document.getElementById("eventIdInput");
const searchButton = document.getElementById("searchButton");
const searchStatusText = document.getElementById("searchStatusText");
const searchResult = document.getElementById("searchResult");

// Build the readable text for one event:
// "Tech Career Fair - 2026-08-10 - Kuala Lumpur Convention Centre - 120 seats available"
function formatEvent(event) {
    return (
        event.title +
        " - " +
        event.date +
        " - " +
        event.venue +
        " - " +
        event.availableSeats +
        " seats available"
    );
}

// --- Load all events (Requirement 1-6) ---
async function loadEvents() {
    // Clear old results and show a loading message
    eventList.innerHTML = "";
    statusText.textContent = "Loading events...";

    try {
        const response = await fetch(`${API_BASE_URL}/events`);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const events = await response.json();

        // Render each event as a list item
        events.forEach((event) => {
            const listItem = document.createElement("li");
            listItem.textContent = formatEvent(event);
            eventList.appendChild(listItem);
        });

        // Success message
        statusText.textContent = `${events.length} event(s) loaded successfully.`;
    } catch (error) {
        // Error message if the request fails
        statusText.textContent = "Error loading events: " + error.message;
    }
}

// --- Challenge: search one event by ID ---
async function searchEventById() {
    const id = eventIdInput.value.trim();

    // Reset previous search output
    searchResult.innerHTML = "";

    if (id === "") {
        searchStatusText.textContent = "Please enter an event ID.";
        return;
    }

    searchStatusText.textContent = `Searching for ${id}...`;

    try {
        const response = await fetch(`${API_BASE_URL}/events/${id}`);

        // A missing event returns 404 - show a friendly message instead of crashing
        if (response.status === 404) {
            searchStatusText.textContent = `No event found with ID "${id}".`;
            return;
        }

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const event = await response.json();

        const listItem = document.createElement("li");
        listItem.textContent = formatEvent(event);
        searchResult.appendChild(listItem);

        searchStatusText.textContent = `Found event ${id}.`;
    } catch (error) {
        searchStatusText.textContent = "Error searching event: " + error.message;
    }
}

// --- Wire up the buttons ---
loadButton.addEventListener("click", loadEvents);
searchButton.addEventListener("click", searchEventById);
