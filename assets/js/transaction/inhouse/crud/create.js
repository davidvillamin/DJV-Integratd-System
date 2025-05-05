function initCreateTransactionInhouse(){
    // Check if Quill is already initialized for this element
    if (!window.quillInstances["tihcNotes"]) {
        window.quillInstances["tihcNotes"] = quillInit("tihcNotes");
    }
    var tihcQuill = window.quillInstances["tihcNotes"];
    
    // populate add transations client list
    var tihcClientList = crudiAjax({}, "/transaction/inhouse/create/clientList", "POST")
    $("#tihcClientName").append(tihcClientList.map(function(client){
        return new Option(client.Name, client._id)
    }))

    return createTransactionInhouse(tihcQuill)
}

async function createTransactionInhouse(tihcQuill){
    return new Promise(function(resolve, reject){
        try {
            // add transactions
            $('#tihCreate :submit').on('click',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var tihc = {}
                    tihc.data = {
                        TransactionType: "Inhouse",
                        JobOrder:$('#tihcJobOrderNumber').val(),
                        RecieveDate:$('#tihcRecieveDate').val(),
                        Device:$('#tihcDevice').val(),
                        SerialNumber:$('#tihcSerial').val(),
                        Notes: tihcQuill.getContents(),
                        Client:$('#tihcClientName :selected').val(),
                        Tags: ["Pending"],
                        isClosed: false,
                        RecievedBy: $("#tihcRecievedBy :selected").val(),
                    }
                    tihc.clientId = $("#tihcClientName :selected").val()
                    
                    // show toast and save transaction
                    $(".toast").toast("show").find(".toast-body").text(crudiAjax(tihc, "/transaction/inhouse/create", "Post"))
                    $(".toast").find(".toast-title").text("New transaction")
                    
                    // clear form
                    $('#tihCreate')[0].reset();
                    // clear quill
                    $(".ql-editor").html("")
                    // close modal   
                    $('#tihCreateModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}