var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(async function(){

    
    
    
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
     // initialize toast
     $(".toast").toast({
        delay: 5000
    });

    //======================================================
    // Populate device information
    //======================================================
    //populate device information
    var deviceInformationData = await crudiAjax({id: id}, "/device/deviceinformation/view/populate", 'Post');   
    dvPopulateData(deviceInformationData); // populate data

    var dTable = $('#diViewTable').DataTable({
        data: crudiAjax({}, "/device/serial/table", "POST"),
        // pageLength: 5, // set to display 5 items
        // lengthMenu: [5, 10, 25, 50, 100] // entries per page options
    })
    
    $("#dvsCreateModal").on('click', async function(){
        deviceCreate(dTable)
    })
    
    deviceCreate().then(function(){
        dvi(dTable)
    })
    
    
    
})

function dvPopulateData(data){
    $('.dvName').text(data.Brand + ' ' + data.Model )
}