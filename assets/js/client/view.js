var id                                              = window.location.href.split('/')[window.location.href.split('/').length - 1]              

$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
    
    //population of data
    var currentClient = crudiAjax({id: id}, "/client/view/ajax", 'Post')
    $('#cvFullName').text(currentClient.FullName)

    if (currentClient.Email === undefined || currentClient.Email === null || currentClient.Email === ""){
        currentClient.Email =  "Email not provided"
    }
    if (currentClient.Address.FullAddress === undefined || currentClient.Address.FullAddress === null || currentClient.Address.FullAddress === ""){
        currentClient.Address.FullAddress =  "Address not provided"
    }
    if (currentClient.Notes === undefined || currentClient.Notes === null || currentClient.Notes === ""){
        // currentClient.Notes =  "<p class='fst-italic'>No notes available.</p>"
        currentClient.Notes =  "No notes available."
    }
    
    var contactNumbers = ""
    currentClient.ContactDetails.forEach(function(number, index){
        contactNumbers += number
        if (index < currentClient.ContactDetails.length - 1){
            contactNumbers += "<br>"
        }
    })
    
    $('#cvEmail').text(currentClient.Email)
    $('#cvAddress').text(currentClient.Address.FullAddress)
    $('#cvCreatedDate').text(moment(currentClient.CreatedDate).format("MMM-DD-YYYY  hh:mm A"))
    $('#cvContactNumber').text(contactNumbers)
    
    $('#cvNotes').text(currentClient.Notes)

})