var clientId                                              = window.location.href.split('/')[window.location.href.split('/').length - 1]              

$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    loadingScreen();

    // initialize toast
    $(".toast").toast({
        delay: 5000
    });
    
    //Initialize data
    initializeData();
})

function initializeData(){
    //population of data
    var currentClient = crudiAjax({clientId: clientId}, "/client/view/ajax", 'Post')

    $('#cvFullName').text(currentClient.FullName)
    $('#cvEmail').text(currentClient.Email ? currentClient.Email : 'Email Not Available');
    $('#cvAddress').text(currentClient.Address.FullAddress ? currentClient.Address.FullAddress : 'Address Not Available');
    $('#cvCreatedDate').text(currentClient.CreatedDate ? moment(currentClient.CreatedDate).format("MMM-DD-YYYY  hh:mm A") : 'Created Date Not Available');
    
    currentClient.ContactDetails.forEach(function(contact){
        contact ? $('#cvContactNumber').append(" " + contact): 'Contact Number Not Available';
    });
    
    $('#cvEmail').text(currentClient.Email)
    $('#cvAddress').text(currentClient.Address.FullAddress)
    $('#cvCreatedDate').text(moment(currentClient.CreatedDate).format("MMM-DD-YYYY  hh:mm A"))
    $('#cvContactNumber').text(currentClient.ContactDetails.join(", ") ? currentClient.ContactDetails.join(", ") : 'No Contact Number Available');

    $('#cvNotes').text(currentClient.Notes ? currentClient.Notes : 'No Notes Available');

    // initialize edit client modal data
    clientEdit(currentClient).then(function(){
        // listeners for edit client modal
        initializeData();
    })

    //devices table
    // clear first the table body
    $('#cvDeviceTable tbody').empty();
    currentClient.Devices.forEach(function(device){
        var deviceRow = "<tr>\
            <td> <a href='/device/view/" + device._id + "'>" + device.Name + "</a></td>\
            <td>" + device.Serial + "</td>\
        </tr>"
        $('#cvDeviceTable tbody').append(deviceRow);
    });

    deviceCreate().then(function(){
        // reload after creating device
        initializeData();
    })
}