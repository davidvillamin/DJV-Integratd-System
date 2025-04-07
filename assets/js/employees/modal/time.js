function EmployeeTimeTable() {


    $('#timeinBtn').on('click', function () {
        var button = $(this);
        var currentText = button.text().trim();
        var data = {
            Time: [],
            id: id // Assuming 'id' is defined in the scope
        };
    
        if (currentText.includes("Time In")) {
            data.Time.push({
                TimeIn: moment().toDate(),
            });
            button.text('Time Out');
        } else if (currentText.includes("Time Out")){ // Implicitly handles "Time Out"
            data.Time.push({
                TimeOut: moment().toDate(),
            });
            button.prop('disabled', true); // Disable the button after clicking "Time Out"
        }
    
        crudiAjax(data, "/employees/employeesinformation/time", 'PUT');
        console.log(data);
    });
}