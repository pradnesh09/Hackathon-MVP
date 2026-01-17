// Mocked data
const turfs = {
  "Community Turf A": [
    { time: "4:00 – 5:00 PM", status: "available", occupancy: 20 },
    { time: "5:00 – 6:00 PM", status: "moderate", occupancy: 50 },
    { time: "6:00 – 7:00 PM", status: "full", occupancy: 90 },
  ],
  "Community Turf B": [
    { time: "4:00 – 5:00 PM", status: "moderate", occupancy: 60 },
    { time: "5:00 – 6:00 PM", status: "available", occupancy: 10 },
    { time: "6:00 – 7:00 PM", status: "full", occupancy: 95 },
  ],
};

let bookingHistory = [];

const statusMap = {
  available: { class: "green", label: "Low Crowd", button: "Book", buttonClass: "book-btn" },
  moderate: { class: "yellow", label: "Moderate Crowd", button: "Book", buttonClass: "book-btn" },
  full: { class: "red", label: "Full", button: "Join Waitlist", buttonClass: "waitlist-btn" },
};

// Render turfs
function renderTurfs() {
  const container = document.getElementById("turf-cards");
  container.innerHTML = "";
  Object.keys(turfs).forEach(turf => {
    const div = document.createElement("div");
    div.className = "turf-card";
    div.textContent = turf;
    div.onclick = () => openTurf(turf);
    container.appendChild(div);
  });
}

// Filter turfs
function filterTurfs() {
  const query = document.getElementById("turf-search").value.toLowerCase();
  const cards = document.querySelectorAll(".turf-card");
  cards.forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(query) ? "flex" : "none";
  });
}

// AI recommendation
function getAIRecommendation(slots) {
  return slots.find(slot => slot.status === "available") || slots[0];
}

// Render slots + heatmap
function renderSlots(turfName) {
  const turfSection = document.getElementById("slots");
  const turfTitle = document.getElementById("turf-name");
  const slotsContainer = document.querySelector(".slots-container");
  const aiText = document.querySelector(".ai");

  turfSection.classList.remove("hidden");
  document.getElementById("turf-list").classList.add("hidden");
  turfTitle.textContent = turfName;
  slotsContainer.innerHTML = "";

  turfs[turfName].forEach(slot => {
    const div = document.createElement("div");
    const statusInfo = statusMap[slot.status];

    div.className = `slot ${statusInfo.class}`;
    div.innerHTML = `
      ${slot.time}
      <button class="${statusInfo.buttonClass}" onclick="bookSlot('${turfName}','${slot.time}')">
        ${statusInfo.button}
      </button>
      <div class="heatmap"><div class="heatmap-fill" style="width:${slot.occupancy}%; background-color:rgba(255,255,255,0.7);"></div></div>
    `;
    slotsContainer.appendChild(div);
  });

  // AI recommendation
  const recommended = getAIRecommendation(turfs[turfName]);
  aiText.textContent = `⭐ Recommended by AI: ${recommended.time} (${statusMap[recommended.status].label})`;
}

// Open turf
function openTurf(turfName) {
  renderSlots(turfName);
}

// Book a slot
function bookSlot(turfName, slotTime) {
  const slot = turfs[turfName].find(s => s.time === slotTime);
  if (!slot) return;

  if (slot.status === "full") {
    alert("📋 You joined the waitlist!");
  } else {
    alert(`✅ Booked ${slotTime} at ${turfName}!`);
    slot.status = "full";
    slot.occupancy = 100; // fill slot completely
    bookingHistory.push(`${turfName} - ${slotTime}`);
  }

  renderSlots(turfName);
}

// Back button
function goBack() {
  document.getElementById("slots").classList.add("hidden");
  document.getElementById("turf-list").classList.remove("hidden");
}

// Booking history
function openHistory() {
  document.getElementById("history").classList.remove("hidden");
  document.getElementById("turf-list").classList.add("hidden");
  document.getElementById("slots").classList.add("hidden");

  const list = document.getElementById("booking-list");
  list.innerHTML = "";
  bookingHistory.forEach(b => {
    const li = document.createElement("li");
    li.textContent = b;
    list.appendChild(li);
  });
}

function closeHistory() {
  document.getElementById("history").classList.add("hidden");
  document.getElementById("turf-list").classList.remove("hidden");
}

// Initialize
renderTurfs();
