// prefix legends
//   iv = inventory
//   ivc = inventory create

$(function(){
    
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });

    //remove class collapsed after click on sidebar
    $("#sbinventory").removeClass("collapsed");

    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#iiiiIndexTable').DataTable({
        data: crudiAjax({}, "/inventory/index/populate/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    //create parts information
    createItemInformation().then(function(){
        // reload datatable
        dTable.clear().rows.add(crudiAjax({}, "/inventory/index/populate/table", "POST")).draw();
    })
})