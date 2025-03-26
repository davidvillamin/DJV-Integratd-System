var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
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

    // var employee = crudiAjax({id:id},"/employees/view/populate/ajax", "POST")

    // var employee = crudiAjax({}, "/employees/populate/table/view", 'POST')
    // employeeData(employee);
    editEmployee()
    
    // View Populate Data   

    // $('#eiName').val(employee.Name)
    // $('#eiJob').val(employee.Job)
    // $('#eiContactNumber').val(employee.ContactNumber)
    // $('#eiAddress').val(employee.Address)
    

    
    
    // // // Edit Modal Populate Data
   
    // $('#eieName').val(employee.Name)
    // $('#eieJob').val(employee.Job)
    // $('#eieContactNumber').val(employee.ContactNumber)
    // $('#eieAddress').val(employee.Address)
})

