var devId = window.location.href.split('/')[window.location.href.split('/').length - 1];
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

    //populate data
    dvPopulateData();
})

async function dvPopulateData(dTable){
    var deviceData = await crudiAjax({id: devId}, "/device/view/populate", 'Post');   
    
    // populate device data
    $('#dvDeviceName').text(deviceData.Name)
    $('#dvType').text(deviceData.Type)
    $('#dvBrand').text(deviceData.Brand)
    $('#dvModel').text(deviceData.Model)
    $('#dvSerial').text(deviceData.withSerial ? deviceData.Serial : 'Serial Not Available');
    $('#dvCreatedDate').text(deviceData.CreatedDate ? moment(deviceData.CreatedDate).format("MMM-DD-YYYY  hh:mm A") : 'Created Date Not Available');

    //populate client data
    $('#dvcName').text(deviceData.Client.FullName ? deviceData.Client.FullName : 'Name Not Available');
    $('#dvcEmail').text(deviceData.Client.Email ? deviceData.Client.Email : 'Email Not Available');
    $('#dvcAddress').text(deviceData.Client.Address.FullAddress ? deviceData.Client.Address.FullAddress : 'Address Not Available');
    $('#dvcCreatedDate').text(deviceData.Client.CreatedDate ? moment(deviceData.Client.CreatedDate).format("MMM-DD-YYYY  hh:mm A") : 'Created Date Not Available');
    
    deviceData.Client.ContactDetails.forEach(function(contact){
        contact ? $('#dvcContactNumber').append(" " + contact): 'Contact Number Not Available';
    });

    // initialize device notes
    let dvNotes = new Quill('#dvNotes', {
        theme: 'snow',
        modules: { toolbar: false },
        readOnly: true
    });
    
}