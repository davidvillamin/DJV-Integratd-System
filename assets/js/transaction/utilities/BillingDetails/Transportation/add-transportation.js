// tta = transaction transportation add
function addTransportation(transId,ttaForm,ttaModal){
    return new Promise(function(resolve,reject){
        try {
            $(ttaForm).on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.transportation = {
                        Description: $('#ttaDescription').val(),
                        Quantity: $('#ttaQuantity').val(),
                        Price: $('#ttaPrice').val(),
                    }
                    data.transId = transId
                    // save to database
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(await crudiAjax(data, '/transaction/transportation/add', 'post'))
                    $(".toast").find(".toast-title").text("Add transportation")
                    // Clear the form
                    $(ttaForm)[0].reset();
                    // close modal   
                    $(ttaModal).modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is remove
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}