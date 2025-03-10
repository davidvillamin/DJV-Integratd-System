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
    $('#ccName').text(currentClient.Name)
    $('#ccoName').text(currentClient.Name)
    $('#ccAddress').text(currentClient.Address)
    $('#ccoAddress').text(currentClient.Address)
    $('#ccoNotes').text(currentClient.Notes)
    $('#ccoContactPerson').text(currentClient.ContactPerson)
    $('#ccoContactNumber').text(currentClient.ContactNumber)
    $('#ccoEmail').text(currentClient.Email)
})