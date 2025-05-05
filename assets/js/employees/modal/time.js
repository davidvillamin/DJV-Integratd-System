// c:\Users\Acer\OneDrive\Desktop\NiceAdmin\DJV-Integratd-System\assets\js\employees\modal\time.js

function EmployeeTimeTable() {

    $('#timeinBtn').off('click').on('click', function () { // Use .off('click').on('click') to prevent multiple bindings
        var button = $(this);
        var currentText = button.text().trim();
        var data = {
            Time: [],
            id: id // Assuming 'id' is defined in the scope where EmployeeTimeTable is called
        };

        const now = moment();
        const today = moment().startOf('day');
        // Define the allowed time window for Time In
        const timeInStart = moment(today).hour(7).minute(0).second(0); // 7:00 AM today
        const timeInEnd = moment(today).hour(13).minute(0).second(0); // 1:00 PM today

        if (currentText.includes("Time In")) {
            // **** ADD TIME WINDOW CHECK ****
            if (!now.isBetween(timeInStart, timeInEnd, null, '[)')) { // Check if current time is NOT between 7:00 AM (inclusive) and 1:00 PM (exclusive)
                alert("Time In is only allowed between 7:00 AM and 1:00 PM.");
                console.log("Time In attempt outside allowed window blocked.");
                return; // Stop processing the click
            }
            // **** END TIME WINDOW CHECK ****

            // Proceed with Time In
            data.Time.push({
                TimeIn: now.toDate(), // Use current time
            });
            button.text('Time Out'); // Change button text
            button.prop('disabled', false); // Ensure button is enabled for the Time Out click
            console.log("Processing Time In...");

        } else if (currentText.includes("Time Out")){
            // Proceed with Time Out
            // Ideally, the backend should handle finding the correct record to update.
            // Sending TimeOut like this relies on the backend to merge it correctly.
            data.Time.push({
                TimeOut: now.toDate(), // Use current time
            });
            button.prop('disabled', true); // Disable the button immediately after clicking "Time Out"
            console.log("Processing Time Out...");
        }

        // Only send AJAX if data was actually added (either TimeIn or TimeOut)
        if (data.Time.length > 0) {
            console.log("Sending time data:", data);
            // *** IMPORTANT: Backend route /employees/employeesinformation/time needs modification ***
            // It should find the existing Time record for today and ADD the TimeOut,
            // rather than just pushing a new object which might create duplicates or incorrect entries.
            crudiAjax(data, "/employees/employeesinformation/time", 'PUT')
                .then(response => {
                    console.log("Time update successful:", response);
                    // Optionally refresh data or update UI further if needed
                })
                .catch(error => {
                    console.error("Time update failed:", error);
                    // Re-enable button or revert text if the backend call fails?
                    // Example: button.prop('disabled', false); // Re-enable on error
                    alert("Failed to record time. Please try again.");
                });
        } else {
            console.log("No time data action taken.");
        }
    });
}
