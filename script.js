// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

// Load saved theme on page load
let isDark = localStorage.getItem('theme') === 'dark';

// Apply theme on load
if (isDark) {
    html.classList.add('dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
} else {
    html.classList.remove('dark');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
}

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    html.classList.toggle('dark');
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
    
    // Save theme preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Form Validation and Search Functionality
const searchForm = document.getElementById('searchForm');
const originInput = document.getElementById('origin');
const destinationInput = document.getElementById('destination');
const departDateInput = document.getElementById('departDate');
const returnDateInput = document.getElementById('returnDate');
const formMessage = document.getElementById('formMessage');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
departDateInput.min = today;
returnDateInput.min = today;

// Real-time validation
departDateInput.addEventListener('change', () => {
    if (returnDateInput.value && departDateInput.value > returnDateInput.value) {
        showError('departError', 'Departure date must be before return date');
        returnDateInput.value = '';
    } else {
        hideError('departError');
    }
    returnDateInput.min = departDateInput.value;
});

returnDateInput.addEventListener('change', () => {
    if (departDateInput.value && returnDateInput.value < departDateInput.value) {
        showError('returnError', 'Return date must be after departure date');
    } else {
        hideError('returnError');
    }
});

// Form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous errors
    hideAllErrors();
    
    // Validate form
    let isValid = true;
    
    if (originInput.value.trim().length < 3) {
        showError('originError', 'Please enter a valid origin (min 3 characters)');
        isValid = false;
    }
    
    if (destinationInput.value.trim().length < 3) {
        showError('destinationError', 'Please enter a valid destination (min 3 characters)');
        isValid = false;
    }
    
    if (originInput.value.toLowerCase() === destinationInput.value.toLowerCase()) {
        showError('destinationError', 'Origin and destination cannot be the same');
        isValid = false;
    }
    
    if (!departDateInput.value) {
        showError('departError', 'Please select a departure date');
        isValid = false;
    }
    
    if (returnDateInput.value && returnDateInput.value < departDateInput.value) {
        showError('returnError', 'Return date must be after departure date');
        isValid = false;
    }
    
    if (isValid) {
        formMessage.textContent = 'Searching flights...';
        formMessage.className = 'p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
        formMessage.classList.remove('hidden');

        setTimeout(() => {
            currentFlights = generateFlightResults();
            displayFlightResults(currentFlights);
            
            formMessage.textContent = `✓ Found ${currentFlights.length} flights!`;
            formMessage.className = 'p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 success-badge';
            
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 3000);
        }, 1500);
    }
});

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.classList.add('hidden');
}

function hideAllErrors() {
    ['originError', 'destinationError', 'departError', 'returnError'].forEach(hideError);
}

// Generate mock flight data
function generateFlightResults() {
    const airlines = ['Emirates', 'Qatar Airways', 'British Airways', 'Lufthansa', 'Singapore Airlines', 'Delta'];
    const origin = originInput.value;
    const destination = destinationInput.value;
    const flights = [];
    
    for (let i = 0; i < 6; i++) {
        const departTime = `${String(6 + i * 2).padStart(2, '0')}:${['00', '30'][Math.floor(Math.random() * 2)]}`;
        const duration = 5 + Math.floor(Math.random() * 10);
        const arrivalHour = (6 + i * 2 + duration) % 24;
        const arrivalTime = `${String(arrivalHour).padStart(2, '0')}:${['00', '30'][Math.floor(Math.random() * 2)]}`;
        const price = 350 + Math.floor(Math.random() * 800);
        const stops = Math.floor(Math.random() * 3);
        
        flights.push({
            id: i + 1,
            airline: airlines[Math.floor(Math.random() * airlines.length)],
            origin: origin,
            destination: destination,
            departTime: departTime,
            arrivalTime: arrivalTime,
            duration: duration,
            price: price,
            stops: stops,
            class: document.getElementById('class').value
        });
    }
    
    return flights;
}

// Display flight results with DOM manipulation
function displayFlightResults(flights) {
    const resultsSection = document.getElementById('resultsSection');
    const flightResults = document.getElementById('flightResults');
    const searchStats = document.getElementById('searchStats');
    
    // Clear previous results
    flightResults.innerHTML = '';
    
    // Calculate statistics
    const prices = flights.map(f => f.price);
    const durations = flights.map(f => f.duration);
    const bestPrice = Math.min(...prices);
    const avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
    
    // Update statistics
    document.getElementById('flightsFound').textContent = flights.length;
    document.getElementById('bestPrice').textContent = `$${bestPrice}`;
    document.getElementById('avgDuration').textContent = `${avgDuration}h`;
    
    // Show sections
    searchStats.classList.remove('hidden');
    resultsSection.classList.remove('hidden');
    
    // Create flight cards
    flights.forEach((flight, index) => {
        const flightCard = createFlightCard(flight, index);
        flightResults.appendChild(flightCard);
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Create individual flight card
function createFlightCard(flight, index) {
    const card = document.createElement('div');
    card.className = 'flight-card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const stopsBadge = flight.stops === 0 
        ? '<span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">Non-stop</span>'
        : `<span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-semibold">${flight.stops} Stop${flight.stops > 1 ? 's' : ''}</span>`;
    
    card.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex-1">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-2xl">
                        ✈️
                    </div>
                    <div>
                        <h4 class="font-bold text-lg text-gray-800 dark:text-white">${flight.airline}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}</p>
                    </div>
                </div>
                
                <div class="flex items-center space-x-6">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-gray-800 dark:text-white">${flight.departTime}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">${flight.origin}</div>
                    </div>
                    
                    <div class="flex-1 text-center">
                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">${flight.duration}h</div>
                        <div class="h-0.5 bg-gray-300 dark:bg-gray-600 relative">
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                ${stopsBadge}
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <div class="text-2xl font-bold text-gray-800 dark:text-white">${flight.arrivalTime}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">${flight.destination}</div>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-col items-end space-y-2">
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">$${flight.price}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">per person</div>
                <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 btn-hover font-semibold" onclick="bookFlight(${flight.id})">
                    Select Flight
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Sorting functionality
let currentFlights = [];

document.getElementById('sortPrice').addEventListener('click', () => {
    if (currentFlights.length > 0) {
        currentFlights.sort((a, b) => a.price - b.price);
        displayFlightResults(currentFlights);
    }
});

document.getElementById('sortDuration').addEventListener('click', () => {
    if (currentFlights.length > 0) {
        currentFlights.sort((a, b) => a.duration - b.duration);
        displayFlightResults(currentFlights);
    }
});

// Book flight function
function bookFlight(flightId) {
    const flight = currentFlights.find(f => f.id === flightId);
    
    if (flight) {
        const confirmMsg = `Book this ${flight.airline} flight for ${flight.price}?\n\n` +
                          `${flight.origin} → ${flight.destination}\n` +
                          `Departure: ${flight.departTime}\n` +
                          `Class: ${flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}`;
        
        if (confirm(confirmMsg)) {
            alert('✓ Booking Successful!\n\nYour flight has been booked. Redirecting to My Bookings...');
            
            // Redirect to bookings page after short delay
            setTimeout(() => {
                window.location.href = 'bookings.html';
            }, 1000);
        }
    }
}