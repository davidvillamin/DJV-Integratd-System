var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(async function(){

    var initialTransactionData = await crudiAjax({id:id}, "/transaction/report/initial", 'Post');
    initialPrint(initialTransactionData);
    // console.log(initialTransactionData);
    

})

function initialPrint(itable){
    $('#tihvpJobOrder').text(itable.JobOrder);
    $('#tihvpReceivedDate').text(itable.RecieveDate);
    $('#tihvpDevice').text(itable.Device);
    $('#tihvpSerialNumber').text(itable.SerialNumber);
    $('#tihvpCLientName').text(itable.Client.Name);
    $('#tihvpAddress').text(itable.Client.Address);
    $('#tihvpContactDetails').text(itable.Client.ContactDetails);
    $('#tihvpEmail').text(itable.Client.Email);
    
}


