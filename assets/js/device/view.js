var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(async function(){
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

    var dTable = $('#diViewTable').DataTable({
        data: crudiAjax({}, "/device/deviceinformation/view/populate", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100] // entries per page options
    }) 
    var deviceInformationData = await crudiAjax({id: id}, "/device/deviceinformation/view/name", 'Post');   
    dvPopulateData(deviceInformationData);

    // $('#diViewTable .dvDeleteDevice').on('click', async function(){
    //     // var deviceId = $(this).data('Serial');
    //     var result = await crudiAjax({ id: id }, "/device/deviceinformation/delete", "POST");
        // dTable.row($(this)).remove().draw();
    // });
    
})

function dvPopulateData(dTable){
    $('.dvName').text(dTable.Brand + ' ' + dTable.Serial )
    
    
}