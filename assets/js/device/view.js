var deviceId = window.location.href.split('/')[window.location.href.split('/').length - 1];
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

    //populate data
    initialize();
})

async function initialize(){
    var deviceData = await crudiAjax({id: deviceId}, "/device/view/populate", 'Post');   
    
    // populate device data
    $('#dvDeviceName').html(deviceData.Name ? deviceData.Name : '<p class="fst-italic mb-0">No Name available.</p>');
    $('#dvType').html(deviceData.Type ? deviceData.Type : '<p class="fst-italic mb-0">No Type available.</p>');
    $('#dvBrand').html(deviceData.Brand ? deviceData.Brand : '<p class="fst-italic mb-0">No Brand available.</p>');
    $('#dvModel').html(deviceData.Model ? deviceData.Model : '<p class="fst-italic mb-0">No Model available.</p>');
    $('#dvSerial').html(deviceData.withSerial ? deviceData.Serial : '<p class="fst-italic mb-0">Serial Not Available.</p>');
    $('#dvCreatedDate').html(deviceData.CreatedDate ? moment(deviceData.CreatedDate).format("MMM-DD-YYYY  hh:mm A") : '<p class="fst-italic mb-0">No Created Date available.</p>');

    //populate client data
    $('#dvcName').html(deviceData.Client.FullName ? deviceData.Client.FullName : '<p class="fst-italic mb-0">No Name available.</p>');
    $('#dvcBusiness').html(deviceData.Client.BusinessName ? deviceData.Client.BusinessName : '<p class="fst-italic mb-0">No Business available.</p>');
    $('#dvcEmail').html(deviceData.Client.Email ? deviceData.Client.Email : '<p class="fst-italic mb-0">No Email available.</p>');
    $('#dvcAddress').html(deviceData.Client.Address.FullAddress ? deviceData.Client.Address.FullAddress : '<p class="fst-italic mb-0">No Address available.</p>');
    $('#dvcCreatedDate').html(deviceData.Client.CreatedDate ? moment(deviceData.Client.CreatedDate).format("MMM-DD-YYYY  hh:mm A") : '<p class="fst-italic mb-0">No Created Date available.</p>');
    
    deviceData.Client.ContactDetails.forEach(function(contact){
        contact ? $('#dvcContactNumber').append(" " + contact): '<p class="fst-italic mb-0">No Contact Numbers available.</p>';
    });

    // populate notes
    $('#dvNotes').html(deviceData.Notes ? deviceData.Notes : '<p class="fst-italic mb-0">No Notes available.</p>');
    
    // edit device
    deviceEdit(deviceId);
}