function initDeleteTransactionInhouse(tihId, clientId, jobOrderNumber){
    // populate data on edit modal
    $("#tihdId").val(tihId);
    $("#tihdClientId").val(clientId);
    $("#tihdJobOrderNumber").text(jobOrderNumber);
    return deleteTransactionInhouse()
}

function deleteTransactionInhouse(){
    return new Promise(function(resolve, reject){
        try {
            // add transactions
            $('#tihDelete :submit').on('click',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var tihe = {}
                    tihe.tihId = $("#tihdId").val()
                    tihe.clientId = $('#tihdClientId').val()

                    console.log(tihe)
                    // show toast and save transaction
                    $(".toast").toast("show").find(".toast-body").text(crudiAjax(tihe, "/transaction/inhouse/delete", "delete"))
                    $(".toast").find(".toast-title").text("Edit transaction")
                    
                    // clear form
                    $('#tihDelete')[0].reset();
                    // clear quill
                    $(".ql-editor").html("")
                    // close modal   
                    $('#tihDeleteModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}