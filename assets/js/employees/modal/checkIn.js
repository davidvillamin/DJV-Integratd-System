function checkInEmployee() {
    return new Promise(function(resolve, reject) {
        try {
            $('#timeinBtn').on('click', function() {
                // Get the current time
                const currentTime = new Date().toLocaleString();

                // Prepare data for the request
                var data = {
                    id: id,
                    timeIn: currentTime
                };

                // Send a request to your server to save the time in
                crudiAjax(data, "/employees/timein", 'Post')
                    .then(function(response) {
                        console.log("Time in saved successfully:", response);

                        // Reload the attendance data and update the table
                        crudiAjax({ id: id }, "/employees/attendance", 'Post')
                            .then(function(employeeAttendance) {
                                $('#attendanceTable').DataTable().destroy(); // Destroy existing datatable
                                populateAttendanceTable(employeeAttendance);
                                resolve();
                            })
                            .catch(function(error) {
                                console.error("Error loading attendance data:", error);
                                reject(error);
                            });
                    })
                    .catch(function(error) {
                        console.error("Error saving time in:", error);
                        reject(error);
                    });
            });
        } catch (error) {
            reject(error);
        }
    });
}