const events = [
  {
    id: "EV001",
    title: "Tech Career Fair",
    date: "2026-08-10",
    venue: "Kuala Lumpur Convention Centre",
    availableSeats: 120
  },
  {
    id: "EV002",
    title: "Web Development Bootcamp",
    date: "2026-08-15",
    venue: "Digital Learning Hub",
    availableSeats: 35
  },
  {
    id: "EV003",
    title: "AI for Business Workshop",
    date: "2026-08-20",
    venue: "Innovation Centre",
    availableSeats: 50
  }
];

// Write your code below this line

// 1 + 2. Select the HTML elements
const eventList = document.getElementById("eventList");
const statusText = document.getElementById("statusText");

// 3 + 4. Display every event as a list item
events.forEach((event) => {
  const listItem = document.createElement("li");

  // Base text: title - date - venue - seats available
  let text =
    event.title +
    " - " +
    event.date +
    " - " +
    event.venue +
    " - " +
    event.availableSeats +
    " seats available";

  // Challenge task: flag events with fewer than 50 available seats
  if (event.availableSeats < 50) {
    text += " - Limited seats";
  }

  listItem.textContent = text;
  eventList.appendChild(listItem);
});

// 5. Update the status message after displaying the events
statusText.textContent = events.length + " event(s) displayed.";
