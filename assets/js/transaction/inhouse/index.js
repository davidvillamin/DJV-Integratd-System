$(async function(){
    // hide loading screen
    loadingScreen();

    //for selection on side bar
    $("#sbinhouse").removeClass("collapsed");
    
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });
    // initialize datatable
    var dTable = $('#tihIndexTable').DataTable({
        data: crudiAjax({}, "/transaction/inhouse/index", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    // //create parts information
    // inventoryProductCreate().then(function(){
    //     // reload datatable
    //     dTable.clear().rows.add(crudiAjax({}, "/inventory/index/table", "POST")).draw();
    // })
})

