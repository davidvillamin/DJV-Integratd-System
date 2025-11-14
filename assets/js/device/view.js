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

    // device edit
    editDevice(deviceId).then(function(){
        initialize()
        editDevice(deviceId);
    })

    // device notes
    deviceNotes(deviceId).then(function(){
        initialize()        
        deviceNotes(deviceId);
    })

    // image
    deviceImage(deviceId).then(function(){
        initialize()
        deviceImage(deviceId);
    })
})

async function initialize(){
    var deviceData = await crudiAjax({deviceId: deviceId}, "/device/getOneData", 'Post');   
    // populate device data
    $('#dvdName').html(deviceData.Name ? deviceData.Name : '<p class="fst-italic mb-0">No Name available.</p>');
    $('#dvdType').html(deviceData.Type ? deviceData.Type : '<p class="fst-italic mb-0">No Type available.</p>');
    $('#dvdBrand').html(deviceData.Brand ? deviceData.Brand : '<p class="fst-italic mb-0">No Brand available.</p>');
    $('#dvdModel').html(deviceData.Model ? deviceData.Model : '<p class="fst-italic mb-0">No Model available.</p>');
    $('#dvdSerial').html(deviceData.noSerial ? '<p class="fst-italic mb-0">Serial Not Available.</p>' : deviceData.Serial);
    $('#dvdCreatedDate').html(deviceData.CreatedDate ? moment(deviceData.CreatedDate).format("MMM-DD-YYYY  hh:mm A") : '<p class="fst-italic mb-0">No Created Date available.</p>');

    //populate client data
    $('#dvcName').html(deviceData.Client.FullName ? deviceData.Client.FullName : '<p class="fst-italic mb-0">No Name available.</p>');
    $('#dvcBusiness').html(deviceData.Client.BusinessName ? deviceData.Client.BusinessName : '<p class="fst-italic mb-0">No Business available.</p>');
    $('#dvcEmail').html(deviceData.Client.Email ? deviceData.Client.Email : '<p class="fst-italic mb-0">No Email available.</p>');
    $('#dvcAddress').html(deviceData.Client.Address.FullAddress ? deviceData.Client.Address.FullAddress : '<p class="fst-italic mb-0">No Address available.</p>');
    $('#dvcCreatedDate').html(deviceData.Client.CreatedDate ? moment(deviceData.Client.CreatedDate).format("MMM-DD-YYYY  hh:mm A") : '<p class="fst-italic mb-0">No Created Date available.</p>');
    
    deviceData.Client.ContactDetails.forEach(function(contact){
        contact ? $('#dvcContactNumber').append(" " + contact): '<p class="fst-italic mb-0">No Contact Numbers available.</p>';
    });

    // populate notes for device
    $('#dvNotes').html(deviceData.Notes ? deviceData.Notes : '<p class="fst-italic mb-0">No Notes available.</p>');

    // edit client from device view
    editClient(deviceData.Client._id).then(function(){
        initialize();
    })
}