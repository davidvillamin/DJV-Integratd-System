// tsc = transaction service charge
function addServiceCharge(transId,tscForm,tscModal){
    return new Promise(function(resolve,reject){
        try {
            $(tscForm).on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.ServiceCharge = {
                        Description: $('#tscaDescription').val(),
                        Price: $('#tscaPrice').val(),
                    }
                    data.transId = transId
                    // save to database
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(await crudiAjax(data, '/transaction/serviceCharge/add', 'post'))
                    $(".toast").find(".toast-title").text("Add transportation")
                    // Clear the form
                    $(tscForm)[0].reset();
                    // close modal   
                    $(tscModal).modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is remove
                    
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}
