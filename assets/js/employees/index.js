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

    // initialize datatable
    var dTable = $('#eiTable').DataTable({
        data: crudiAjax({},"/employees/populate/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100] // entries per page options
    })

    

    createEmployee()



    //add eventlistener on click to launch the create client function on client\crud\create.js
    // TODO: fix promise for create client on initialize table.
    
})