$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });

    $("#sbemployees").removeClass("collapsed");
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable for the main employee list
    $('#eiTable').DataTable({
        data: crudiAjax({},"/employees/populate/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100] // entries per page options
    });

    

    createEmployee();

    calendarTable()

    $('#eiWeeklyAttendanceTable').DataTable({
        data: crudiAjax({}, "/employees/populate/employee/weeklyAttendance", "POST"),
        paging: false,       // Keep original settings
        searching: false,
        info: false,
        ordering: false,     // Set to true if you want users to sort by columns
        // scrollX: true,    // Consider adding if the 7 days make the table wide
        language: {
            emptyTable: "No weekly attendance data available." // Or "Loading..." if using ajax
        },
        columnDefs: [
            {
                targets: '_all', // Apply text-center to all columns initially
                className: 'text-center'
            },
            {
                targets: [1, 2, 3, 4, 5, 6, 7], // Target columns for Sunday to Saturday (index 1 to 7)
                createdCell: function (td, cellData, rowData, row, col) {
                    // td: The <td> element
                    // cellData: The data for the cell ('P', 'A', or '-')
                    // rowData: The data for the entire row
                    // row: The row index
                    // col: The column index

                    // Remove default text-center if we apply a background,
                    // as badge/specific styling might handle alignment.
                    // Or keep it if you want the P/A centered within the colored cell.
                    // $(td).removeClass('text-center'); // Optional: remove if badge handles centering

                    if (cellData === 'P') {
                        // Apply green background and white text directly to the cell
                        $(td).addClass('bg-success text-white');
                        // Optional: If you prefer a badge look instead of full cell background:
                        // $(td).html('<span class="badge bg-success w-100">P</span>');
                    } else if (cellData === 'A') {
                        // Apply red background and white text directly to the cell
                        $(td).addClass('bg-danger text-white');
                         // Optional: If you prefer a badge look instead of full cell background:
                        // $(td).html('<span class="badge bg-danger w-100">A</span>');
                    } else if (cellData === ' ') {
                        $(td).addClass('bg-dark text-white'); // Optional: Style for Sunday
                    }
                    else {
                        // Optional: Style the '-' cells if needed, e.g., muted text
                        $(td).addClass('text-muted');
                    }
                }
            },
            {
                targets: 0, // Target the first column (Employee Name)
                className: 'text-start' // Ensure employee name is left-aligned
            }
        ]
    });

});

function calendarTable() {
    // const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // No longer needed for this format

    const $headerRow = $("#eiWeeklyAttendanceTable thead tr"); // Correct selector

    if ($headerRow.length === 0) {
        console.error("Header row (thead tr) not found in #eiWeeklyAttendanceTable.");
        return; // Exit if the header row doesn't exist
    }

    // Clear any existing day headers (assuming first th is 'Employee')
    $headerRow.find('th:gt(0)').remove(); // Remove all th elements except the first one

    // Get the start of the current week (Sunday) using moment.js
    const startOfWeek = moment().startOf('week'); // moment's default start of week is Sunday

    // Append the 7 days starting from Sunday
    for (let i = 0; i < 7; i++) {
        // Calculate the date for the current day in the loop
        const currentDay = moment(startOfWeek).add(i, 'days');
        // Format the date as ddd-MM-YYYY (e.g., Sun-07-2024)
        // Note: 'ddd' gives abbreviated day name (Sun, Mon, etc.)
        // Use 'dddd' for full name (Sunday, Monday, etc.) if needed.
        const formattedDate = currentDay.format('DD-MM-YYYY'); // Use moment's format

        const $newTh = $('<th>');             // Create a new <th> element using jQuery
        $newTh.addClass('rotate-header text-center'); // Add text-center class for alignment
        // Set the formatted date inside the span
        $newTh.html(`<span>${formattedDate}</span>`); // Use the formatted date

        $headerRow.append($newTh);
    }
}

