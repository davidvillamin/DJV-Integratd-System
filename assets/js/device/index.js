$(function(){
    
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    loadingScreen();
    
    //remove class collapsed after click on sidebar
    $("#sbdevice").removeClass("collapsed");
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#diTable').DataTable({
        data: crudiAjax({}, "/device/index/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100] // entries per page options
    })

    deviceCreate().then(function(){
        // reload datatable
        dTable.clear().rows.add(crudiAjax({}, "/device/index/table", "POST")).draw();
    })

})


