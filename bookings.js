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

// Mock booking data
const mockBookings = [
    {
        id: 'BK001',
        bookingReference: 'SKY789ABC',
        status: 'upcoming',
        airline: 'Emirates',
        flightNumber: 'EK215',
        origin: 'New York (JFK)',
        destination: 'Dubai (DXB)',
        departDate: '2025-11-15',
        departTime: '14:30',
        arrivalDate: '2025-11-16',
        arrivalTime: '10:45',
        duration: '12h 15m',
        class: 'Business',
        passengers: 2,
        totalPrice: 3450,
        bookedDate: '2025-10-01'
    },
    {
        id: 'BK002',
        bookingReference: 'SKY456DEF',
        status: 'upcoming',
        airline: 'British Airways',
        flightNumber: 'BA178',
        origin: 'London (LHR)',
        destination: 'New York (JFK)',
        departDate: '2025-12-20',
        departTime: '09:00',
        arrivalDate: '2025-12-20',
        arrivalTime: '12:30',
        duration: '8h 30m',
        class: 'Economy',
        passengers: 1,
        totalPrice: 680,
        bookedDate: '2025-10-05'
    },
    {
        id: 'BK003',
        bookingReference: 'SKY123GHI',
        status: 'completed',
        airline: 'Qatar Airways',
        flightNumber: 'QR701',
        origin: 'Paris (CDG)',
        destination: 'Tokyo (NRT)',
        departDate: '2025-09-10',
        departTime: '19:45',
        arrivalDate: '2025-09-11',
        arrivalTime: '15:20',
        duration: '11h 35m',
        class: 'Premium Economy',
        passengers: 2,
        totalPrice: 2100,
        bookedDate: '2025-08-15'
    },
    {
        id: 'BK004',
        bookingReference: 'SKY999JKL',
        status: 'upcoming',
        airline: 'Singapore Airlines',
        flightNumber: 'SQ25',
        origin: 'Singapore (SIN)',
        destination: 'Los Angeles (LAX)',
        departDate: '2025-11-28',
        departTime: '23:55',
        arrivalDate: '2025-11-28',
        arrivalTime: '20:10',
        duration: '15h 15m',
        class: 'First Class',
        passengers: 1,
        totalPrice: 8500,
        bookedDate: '2025-10-10'
    },
    {
        id: 'BK005',
        bookingReference: 'SKY555MNO',
        status: 'cancelled',
        airline: 'Lufthansa',
        flightNumber: 'LH456',
        origin: 'Frankfurt (FRA)',
        destination: 'Mumbai (BOM)',
        departDate: '2025-10-20',
        departTime: '16:20',
        arrivalDate: '2025-10-21',
        arrivalTime: '04:30',
        duration: '7h 10m',
        class: 'Economy',
        passengers: 3,
        totalPrice: 1890,
        bookedDate: '2025-09-25'
    }
];

// Current filter
let currentFilter = 'all';
let allBookings = mockBookings;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayBookings(allBookings);
    updateSummaryCards();
    setupFilterButtons();
    setupModal();
});

// Display bookings
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    const emptyState = document.getElementById('emptyState');
    
    bookingsList.innerHTML = '';
    
    if (bookings.length === 0) {
        bookingsList.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    bookingsList.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    bookings.forEach((booking, index) => {
        const bookingCard = createBookingCard(booking, index);
        bookingsList.appendChild(bookingCard);
    });
}

// Create booking card
function createBookingCard(booking, index) {
    const card = document.createElement('div');
    card.className = 'flight-card bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const statusColors = {
        upcoming: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
        completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
        cancelled: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    };
    
    const statusIcons = {
        upcoming: '✈️',
        completed: '✓',
        cancelled: '✕'
    };
    
    card.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <div class="flex items-center space-x-3 mb-2">
                        <span class="text-2xl">${statusIcons[booking.status]}</span>
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white">${booking.airline}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Booking Ref: ${booking.bookingReference}</p>
                        </div>
                    </div>
                </div>
                <span class="px-4 py-2 rounded-full text-sm font-semibold ${statusColors[booking.status]}">
                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Departure</p>
                    <p class="text-2xl font-bold text-gray-800 dark:text-white">${booking.departTime}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">${booking.origin}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">${formatDate(booking.departDate)}</p>
                </div>
                
                <div class="text-center flex flex-col justify-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${booking.duration}</p>
                    <div class="flex items-center justify-center">
                        <div class="h-0.5 flex-1 bg-gray-300 dark:bg-gray-600"></div>
                        <svg class="w-6 h-6 mx-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                        <div class="h-0.5 flex-1 bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Flight ${booking.flightNumber}</p>
                </div>
                
                <div class="text-right">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Arrival</p>
                    <p class="text-2xl font-bold text-gray-800 dark:text-white">${booking.arrivalTime}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">${booking.destination}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">${formatDate(booking.arrivalDate)}</p>
                </div>
            </div>
            
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>👤 ${booking.passengers} Passenger${booking.passengers > 1 ? 's' : ''}</span>
                    <span>💺 ${booking.class}</span>
                    <span class="font-semibold text-blue-600 dark:text-blue-400">$${booking.totalPrice}</span>
                </div>
                
                <div class="flex gap-2">
                    <button onclick="viewDetails('${booking.id}')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 btn-hover text-sm font-semibold">
                        View Details
                    </button>
                    ${booking.status === 'upcoming' ? `
                        <button onclick="cancelBooking('${booking.id}')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 btn-hover text-sm font-semibold">
                            Cancel
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update summary cards
function updateSummaryCards() {
    const upcoming = allBookings.filter(b => b.status === 'upcoming').length;
    const completed = allBookings.filter(b => b.status === 'completed').length;
    const total = allBookings.length;
    
    document.getElementById('upcomingCount').textContent = upcoming;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = total;
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = {
        filterAll: 'all',
        filterUpcoming: 'upcoming',
        filterCompleted: 'completed',
        filterCancelled: 'cancelled'
    };
    
    Object.keys(filterButtons).forEach(buttonId => {
        document.getElementById(buttonId).addEventListener('click', () => {
            currentFilter = filterButtons[buttonId];
            
            // Update button styles
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.className = 'filter-btn px-6 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
            });
            
            document.getElementById(buttonId).className = 'filter-btn px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors';
            
            // Filter bookings
            const filtered = currentFilter === 'all' 
                ? allBookings 
                : allBookings.filter(b => b.status === currentFilter);
            
            displayBookings(filtered);
        });
    });
}

// Setup modal
function setupModal() {
    const modal = document.getElementById('detailModal');
    const closeBtn = document.getElementById('closeModal');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

// View booking details
function viewDetails(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const modal = document.getElementById('detailModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-2xl font-bold mb-1">${booking.airline}</h4>
                        <p class="text-blue-100">Flight ${booking.flightNumber}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-3xl font-bold">$${booking.totalPrice}</p>
                        <p class="text-blue-100 text-sm">Total Cost</p>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Booking Reference</p>
                    <p class="text-lg font-bold text-gray-800 dark:text-white">${booking.bookingReference}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Booked On</p>
                    <p class="text-lg font-bold text-gray-800 dark:text-white">${formatDate(booking.bookedDate)}</p>
                </div>
            </div>
            
            <div class="border-t border-b border-gray-200 dark:border-gray-700 py-6">
                <h5 class="font-bold text-gray-800 dark:text-white mb-4">Flight Details</h5>
                <div class="space-y-4">
                    <div class="flex justify-between">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Departure</p>
                            <p class="text-xl font-bold text-gray-800 dark:text-white">${booking.departTime}</p>
                            <p class="text-gray-600 dark:text-gray-300">${booking.origin}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${formatDate(booking.departDate)}</p>
                        </div>
                        <div class="text-center self-center">
                            <p class="text-sm text-gray-500 dark:text-gray-400">${booking.duration}</p>
                            <div class="text-2xl">→</div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Arrival</p>
                            <p class="text-xl font-bold text-gray-800 dark:text-white">${booking.arrivalTime}</p>
                            <p class="text-gray-600 dark:text-gray-300">${booking.destination}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${formatDate(booking.arrivalDate)}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Passengers</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-white">${booking.passengers} Passenger${booking.passengers > 1 ? 's' : ''}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Class</p>
                    <p class="text-lg font-semibold text-gray-800 dark:text-white">${booking.class}</p>
                </div>
            </div>
            
            ${booking.status === 'upcoming' ? `
                <div class="flex gap-3">
                    <button onclick="downloadTicket('${booking.id}')" class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 btn-hover font-semibold">
                        📥 Download Ticket
                    </button>
                    <button onclick="cancelBooking('${booking.id}')" class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 btn-hover font-semibold">
                        Cancel Booking
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Cancel booking
function cancelBooking(bookingId) {
    const confirmed = confirm('Are you sure you want to cancel this booking?');
    if (!confirmed) return;
    
    const booking = allBookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'cancelled';
        
        // Close modal if open
        document.getElementById('detailModal').classList.add('hidden');
        
        // Refresh display
        const filtered = currentFilter === 'all' 
            ? allBookings 
            : allBookings.filter(b => b.status === currentFilter);
        
        displayBookings(filtered);
        updateSummaryCards();
        
        alert('Booking cancelled successfully. Refund will be processed within 7-10 business days.');
    }
}

// Download ticket
function downloadTicket(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (booking) {
        alert(`Downloading e-ticket for booking ${booking.bookingReference}...\n\nIn a full application, this would generate and download a PDF ticket.`);
    }
}