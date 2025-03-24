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

    var employee = crudiAjax({id:id},"/employees/view/populate/ajax", "POST")
    
    // View Populate Data   
    $('#eiName').text(employee.Name)
    $('#eiAddress').text(employee.Address)
    $('#eiJob').text(employee.Job)
    $('#eiContactNumber').text(employee.ContactNumber)
    
    // Edit Modal Populate Data
   
    $('#eieName').val(employee.Name)
    $('#eieJob').val(employee.Job)
    $('#eieContactNumber').val(employee.ContactNumber)
    $('#eieAddress').val(employee.Address)
})