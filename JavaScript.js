var flights = jsonFlights;
var currentPage = 1;
var rowsPerPage = 10;
var totalPages = Math.ceil(flights.length / rowsPerPage);
var filteredFlights = flights; // Initialize filteredFlights with all flights

function displayFlights(page) {
    var startIndex = (page - 1) * rowsPerPage;
    var endIndex = Math.min(startIndex + rowsPerPage, filteredFlights.length);
    var tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear previous rows

    for (var i = startIndex; i < endIndex; i++) {
        var flight = filteredFlights[i];
        var row = tableBody.insertRow();
        row.dataset.type = flight.type; // Set data-status attribute
        row.insertCell(0).textContent = flight.operatorShort;
        if (isPrime(flight.number)) { // Prime numbers
            row.insertCell(1).innerHTML = `<a href="https://prime-numbers.fandom.com/wiki/${flight.number}" target="_blank" title="${flight.number}.PrimeNumber">${flight.number}</a>`;
        } else {
            row.insertCell(1).textContent = flight.number;
        }
        row.insertCell(2).textContent = new Date(flight.schedueTime).toLocaleTimeString();
        var actualTimeCell = row.insertCell(3);
        actualTimeCell.textContent = new Date(flight.actualTime).toLocaleTimeString();
        // Compare scheduled time with actual time
        if (flight.schedueTime !== flight.actualTime) {
            actualTimeCell.style.color = 'red'; // Set color to red if times don't match
        } else {
            actualTimeCell.style.color = 'green'; // Set color to green if times match
        }
        // Wrap country names in anchor tags with Wikipedia URLs
        row.insertCell(4).innerHTML = `<a href="https://en.wikipedia.org/wiki/${flight.country.toLowerCase()}" target="_blank" title="${flight.country}.wikipedia">${flight.country}</a>`;
        // Wrap city names in anchor tags with Wikipedia URLs
        row.insertCell(5).innerHTML = `<a href="https://en.wikipedia.org/wiki/${flight.city.toLowerCase()}" target="_blank" title="${flight.city}.wikipedia">${flight.city}</a>`;
        row.insertCell(6).textContent = flight.status;
    }
    // Reapply event listeners and styles
    attachEventListeners();
    applyStyles();
}

//check if num is prime func
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
        i += 6;
    }
    return true;
}

//update the pagination func
function updatePagination() {
    totalPages = Math.ceil(filteredFlights.length / rowsPerPage);
    var pageSelect = document.getElementById('pageSelect');
    pageSelect.innerHTML = '';
    for (var i = 1; i <= totalPages; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.textContent = 'דף ' + i;
        pageSelect.appendChild(option);
    }
    pageSelect.value = currentPage;
}

// show all flight details func
function attachEventListeners() {
    // Get the flight details div
    var flightDetailsDiv = document.getElementById('flightDetails');

    // Add click event listener to table rows (except the first row)
    document.querySelectorAll('#FlightTable tbody tr:not(.firstRow)').forEach(function (row) {
        row.addEventListener('click', function () {
            // Get the flight number from the clicked row
            var flightNumber = parseInt(row.cells[1].textContent);

            // Find the flight details based on the flight number
            var flight = flights.find(function (flight) {
                return flight.number === flightNumber;
            });

            // Create HTML content for flight details
            var flightDetailsHTML = `
                                                <h2>פרטי טיסה</h2>
                                                <p>שם חברת התעופה מקוצר: ${flight.operatorShort}</p>
                                                <p>מספר טיסה: ${flight.number}</p>
                                                <p>חברת התעופה: ${flight.operatorLong}</p>
                                                <p>זמן מתוכנן: ${new Date(flight.schedueTime).toLocaleString()}</p>
                                                <p>זמן בפועל: ${new Date(flight.actualTime).toLocaleString()}</p>
                                                <p>סוג (A/D): ${flight.type}</p>
                                                <p>עיר: ${flight.city}</p>
                                                <p>מדינה: ${flight.country}</p>
                                                <p>טרמינל: ${flight.terminal}</p>
                                                <p>דלפק: ${flight.counter}</p>
                                                <p>אזור: ${flight.zone}</p>
                                                <p>סטטוס: ${flight.status}</p>
                                            `;
            flightDetailsDiv.innerHTML = flightDetailsHTML;
            flightDetailsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

//apply styles after every func
function applyStyles() {
    // Styling for rows with status "LANDED"
    document.querySelectorAll('#FlightTable tbody tr[data-type="A"]').forEach(function (row) {
        row.style.backgroundColor = '#cce6ff'; // Light blue
        row.style.backgroundImage = "url('410143-200.png')";
        row.style.backgroundSize = '35px';
        row.style.backgroundRepeat = 'no-repeat';
        row.style.backgroundPosition = 'right center';
        row.style.paddingRight = '20px';
    });
    document.querySelectorAll('#FlightTable tbody tr[data-type="D"]').forEach(function (row) {
        row.style.backgroundColor = 'lightpink'; // Light blue
        row.style.backgroundImage = "url('723963.png');";
        row.style.backgroundSize = '27px';
        row.style.backgroundRepeat = 'no-repeat';
        row.style.backgroundPosition = 'right center';
        row.style.paddingRight = '20px';
    });
}

// Automatic search functionality
document.getElementById('searchInput').addEventListener('input', function () {
    var searchInput = this.value.toLowerCase();
    filteredFlights = flights.filter(function (flight) {
        return (
            flight.number.toString().toLowerCase().includes(searchInput) ||
            new Date(flight.schedueTime).toLocaleString().toLowerCase().includes(searchInput) ||
            new Date(flight.actualTime).toLocaleString().toLowerCase().includes(searchInput) ||
            flight.type.toLowerCase().includes(searchInput) ||
            flight.country.toLowerCase().includes(searchInput) ||
            flight.city.toLowerCase().includes(searchInput) ||
            flight.status.toLowerCase().includes(searchInput) ||
            flight.operatorShort.toLowerCase().includes(searchInput)
        );
    });

    // Update total pages based on filtered flights
    totalPages = Math.ceil(filteredFlights.length / rowsPerPage);

    // Reset current page to 1
    currentPage = 1;

    // Display search results, update pagination, and limit displayed rows
    displayFlights(currentPage);
    updatePagination();
});

// Pagination functionality to go to previous page
document.getElementById('prevPage').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        displayFlights(currentPage);
        updatePagination();
    }
});

// Pagination functionality to go to next page
document.getElementById('nextPage').addEventListener('click', function () {
    if (currentPage < totalPages) {
        currentPage++;
        displayFlights(currentPage);
        updatePagination();
    }
});

// Pagination functionality to go to selected page
document.getElementById('pageSelect').addEventListener('change', function () {
    currentPage = parseInt(this.value);
    displayFlights(currentPage);
    updatePagination();
});

function attachEventListeners() {
    // Get the flight details div
    var flightDetailsDiv = document.getElementById('flightDetails');

    // Add click event listener to table rows (except the first row) for show details
    document.querySelectorAll('#FlightTable tbody tr:not(.firstRow)').forEach(function (row) {
        // Mouseover event for hover effect
        row.addEventListener('mouseover', function () {
            this.style.backgroundColor = 'lightgreen'; // Darker background color on hover
        });

        // Mouseout event for hover effect
        row.addEventListener('mouseout', function () {
            this.style.backgroundColor = ''; // Reset background color on mouseout
        });

        // Click event for show details
        row.addEventListener('click', function () {
            // Get the flight number from the clicked row
            var flightNumber = parseInt(this.cells[1].textContent);

            // Find the flight details based on the flight number
            var flight = flights.find(function (flight) {
                return flight.number === flightNumber;
            });

            // Create HTML content for flight details
            var flightDetailsHTML = `
                                                <h2>פרטי טיסה</h2>
                                                <p>שם חברת התעופה מקוצר: ${flight.operatorShort}</p>
                                                <p>מספר טיסה: ${flight.number}</p>
                                                <p>חברת התעופה: ${flight.operatorLong}</p>
                                                <p>זמן מתוכנן: ${new Date(flight.schedueTime).toLocaleString()}</p>
                                                <p>זמן בפועל: ${new Date(flight.actualTime).toLocaleString()}</p>
                                                <p>סוג (A/D): ${flight.type}</p>
                                                <p>עיר: ${flight.city}</p>
                                                <p>מדינה: ${flight.country}</p>
                                                <p>טרמינל: ${flight.terminal}</p>
                                                <p>דלפק: ${flight.counter}</p>
                                                <p>אזור: ${flight.zone}</p>
                                                <p>סטטוס: ${flight.status}</p>

                            `;
            flightDetailsDiv.innerHTML = flightDetailsHTML;
            flightDetailsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}
//Show or hide the sort buttons
function toggleSortButtons() {
    var sortButtons = document.querySelector('.sort-buttons');
    sortButtons.style.display = sortButtons.style.display === 'none' ? 'block' : 'none';
}

// Sorting function
function sortTable(attribute) {
    if (attribute === 'number') {
        // For sorting flight numbers, convert them to numbers before sorting
        filteredFlights.sort((a, b) => parseInt(a[attribute]) - parseInt(b[attribute]));
    } else {
        // For other attributes, sort them as strings
        filteredFlights.sort((a, b) => a[attribute].localeCompare(b[attribute]));
    }
    // Display sorted flights and update pagunation
    currentPage = 1;
    displayFlights(currentPage);
    updatePagination();
}

// Reset button function
function resetTable() {
    location.reload();
}

// Toggle functionality buttons
function toggleFunctionality() {
    var funcButtons = document.querySelector('.func-buttons');
    funcButtons.style.display = funcButtons.style.display === 'none' ? 'block' : 'none';
}

//func to return all the flights with the actual time is different from the scheduled time
function TimeDifferent() {
    filteredFlights = flights.filter(function (flight) {
        return flight.schedueTime !== flight.actualTime;
    });

    // Update total pages based on filtered flights
    totalPages = Math.ceil(filteredFlights.length / rowsPerPage);

    // Reset current page to 1
    currentPage = 1;

    // Display filtered flights, update pagination, and limit displayed rows
    displayFlights(currentPage);
    updatePagination();
}

//func to return all the flights with the actual time is same as the scheduled time
function TimeNotDifferent() {
    filteredFlights = flights.filter(function (flight) {
        return flight.schedueTime == flight.actualTime;
    });

    // Update total pages based on filtered flights
    totalPages = Math.ceil(filteredFlights.length / rowsPerPage);

    // Reset current page to 1
    currentPage = 1;

    // Display filtered flights, update pagination, and limit displayed rows
    displayFlights(currentPage);
    updatePagination();
}

// Function to show flight distribution graph
function showFlightDistribution() {
    var graph = document.getElementById('flightDistributionGraph');
    // Extract hours from flight schedule times
    const scheduleHours = filteredFlights.map(flight => new Date(flight.schedueTime).getHours());

    // Count frequency of each hour
    const hourCounts = {};
    scheduleHours.forEach(hour => {
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Create data for the Plotly graph
    const data = [{
        x: Object.keys(hourCounts),
        y: Object.values(hourCounts),
        type: 'bar'
    }];

    // Create layout for the Plotly graph
    const layout = {
        title: 'תפלגות שעות לפי מספר טיסות',
        xaxis: {
            title: 'שעה'
        },
        yaxis: {
            title: 'מספר טיסות'
        }
    };
    // Plot the graph
    Plotly.newPlot('flightDistributionGraph', data, layout);
    graph.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

//show flights with prime number only
function showPrimeFlights() {
    // Filter flights based on prime flight numbers
    filteredFlights = flights.filter(function (flight) {
        return isPrime(flight.number);
    });

    // Update total pages based on filtered flights
    totalPages = Math.ceil(filteredFlights.length / rowsPerPage);

    // Reset current page to 1
    currentPage = 1;

    // Display filtered flights, update pagination, and limit displayed rows
    displayFlights(currentPage);
    updatePagination();
}

// Initial display of flights and pagination
displayFlights(currentPage);
updatePagination();