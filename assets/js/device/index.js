$(function(){
    
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
    
    //remove class collapsed after click on sidebar
    $("#sbdevice").removeClass("collapsed");
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#diTable').DataTable({
        data: crudiAjax({}, "/device/deviceinformation/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100] // entries per page options
    })


    //add eventlistener on click to launch the create client function on client\crud\create.js
    // $("#diCreate").on('click', async function(){
        
    // })

    deviceCreate().then(function(){
        // reload datatable
        dTable.clear().rows.add(crudiAjax({}, "/inventory/index/populate/table", "POST")).draw();
    })

    
})

function initializeTable(dTable){
    // populate table
    var newData = crudiAjax({}, "/device/deviceinformation/table", "POST");
    dTable.clear().rows.add(newData).draw();
    
}

