function initEditTransactionInhouse(transaction){
    // initialize quill
    if (!window.quillInstances["tiheNotes"]) {
        // Quill is not initialized, initialize it
        window.quillInstances["tiheNotes"] = quillInit("tiheNotes");
    } 

    var tiheQuill = window.quillInstances["tiheNotes"];

    // populate add transations client list
    var tiheClientList = crudiAjax({}, "/transaction/inhouse/create/clientList", "POST")
    $("#tiheClientName").append(tiheClientList.map(function(client){
        return new Option(client.Name, client._id)
    }))

    // populate data
    $("#tiheId").val(transaction._id);
    $("#tiheClientOldId").val(transaction.Client._id);
    $("#tiheJobOrderNumber").val(transaction.JobOrder);
    $("#tiheRecieveDate").val(moment(transaction.RecieveDate).format("YYYY-MM-DD"));
    $('#tiheRecievedBy option[value="' + transaction.RecievedBy + '"]' ).prop('selected', true);
    $("#tiheClientName").val(transaction.Client._id);
    $("#tiheDevice").val(transaction.Device);
    $("#tiheSerial").val(transaction.SerialNumber);
    tiheQuill.setContents(transaction.Notes)

    return editTransactionInhouse(tiheQuill)
}

async function editTransactionInhouse(tiheQuill){
    return new Promise(function(resolve, reject){
        try {
            // add transactions
            $('#tihEdit :submit').on('click',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var tihe = {}
                    tihe.tihId = $("#tiheId").val()
                    tihe.clientId = $('#tiheClientName').val()
                    tihe.clientOldId = $('#tiheClientOldId').val()
                    tihe.data = {
                        TransactionType: "Inhouse",
                        JobOrder:$('#tiheJobOrderNumber').val(),
                        RecieveDate:$('#tiheRecieveDate').val(),
                        Device:$('#tiheDevice').val(),
                        SerialNumber:$('#tiheSerial').val(),
                        Notes: tiheQuill.getContents(),
                        Client:$('#tiheClientName').val(),
                        RecievedBy: $("#tiheRecievedBy :selected").val(),
                    }
                    // show toast and save transaction
                    $(".toast").toast("show").find(".toast-body").text(crudiAjax(tihe, "/transaction/inhouse/edit", "PUT"))
                    $(".toast").find(".toast-title").text("Edit transaction")
                    
                    // clear form
                    $('#tihEdit')[0].reset();
                    // clear quill
                    $(".ql-editor").html("")
                    // close modal   
                    $('#tihEditModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}