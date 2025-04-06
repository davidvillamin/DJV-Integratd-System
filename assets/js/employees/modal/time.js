function EmployeeTimeTable() {


    $('#timeinBtn').on('click', function () {
        // Check the current text of the button
        var currentText = $(this).text().trim();
        var data = {};
             // Add the employee ID to the data object
            data.Time = []
            $(this).currentText === "Time Out" ? $(this).text('Time In') : $(this).text('Time Out')
        switch (currentText) {
            case "Time Out":
                $(this).text('Time In'); // Change the button text to "Time In"
                data.Time.push({
                    TimeOut: moment().format('YYYY-MM-DD HH:mm:ss'),
                    Status: "Time Out" // Changed to "Time Out"
                })
                break;
            case "Time In":
                $(this).text('Time Out'); // Change the button text to "Time Out"
                data.Time.push({
                    TimeIn: moment().format('YYYY-MM-DD HH:mm:ss'),
                    Status: "Time In" // Changed to "Time Out"
                })
                break;
            default:
                break;
        }
        data.id = id;
        crudiAjax(data, "/employees/employeesinformation/edit", 'PUT');
        console.log( data);
        // // show toast
        $(".toast").toast("show").find(".toast-body").text("You have successfully Timed Out!");
        $(".toast").find(".toast-title").text("Time Out success");
    });
}