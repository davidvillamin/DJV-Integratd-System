$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
    
    //remove class collapsed after click on sidebar
    $("#sbClient").removeClass("collapsed");
    
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#ciTable').DataTable({
        data: crudiAjax({}, "/client/index/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100] // entries per page options
    })

    createClient().then(function(){
        // reload datatable
        dTable.clear().rows.add(crudiAjax({}, "/client/index/table", "POST")).draw();
    })
});

