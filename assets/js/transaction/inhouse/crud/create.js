async function createTransactionInhouse(quill){
    return new Promise(function(resolve, reject){
        try {
            // add transactions
            $('#tihCreate :submit').on('click',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        TransactionType: "Inhouse",
                        JobOrder:$('#tihcJobOrderNumber').val(),
                        RecieveDate:$('#tihcRecieveDate').val(),
                        Device:$('#tihcDevice').val(),
                        SerialNumber:$('#tihcSerial').val(),
                        Notes: quill.getContents(),
                        Client:$('#tihcClientName').val(),
                        TempStatus: [],
                        isClosed: false,
                        TempStatus: ["Pending"]
                    }
                    // repopulate table
                    var tosterMessage = crudiAjax(data, "/transaction/inhouse/create/ajax", "Post")
                    
                    // clear form
                    $('#tihCreate')[0].reset();
                    // clear quill
                    $(".ql-editor").html("")
                    // close modal   
                    $('#tihCreateModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(tosterMessage)
                    $(".toast").find(".toast-title").text("New transaction")
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}