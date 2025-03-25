$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
    
    //remove class collapsed after click on sidebar
    $("#sbinhouse").removeClass("collapsed");
    
    var quill = quillInit("tihcNotes")
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#tihIndexTable').DataTable({
        data: crudiAjax({}, "/transaction/inhouse/index/poplate/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    // populate add transations client list
    $("#tihcClientName").append(crudiAjax({}, "/transaction/inhouse/create/clientList", "POST"))
    
    // save transaction
    createTransactionInhouse(quill).then(function(){
        dTable.clear().rows.add(crudiAjax({}, "/transaction/inhouse/index/poplate/table", "POST")).draw()
    })
})