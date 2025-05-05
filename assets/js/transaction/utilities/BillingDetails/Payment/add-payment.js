function addPayment(transId,tpayForm,tpayModal){
    return new Promise(function(resolve,reject){
        try {
            $(tpayForm).on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.Payment = {
                        Date: $('#tpayDate').val(),
                        Description: $('#tpayDescription').val(),
                        Amount: $('#tpayAmount').val(),
                    }
                    data.transId = transId
                    // save to database
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(await crudiAjax(data, '/transaction/payment/add', 'post'))
                    $(".toast").find(".toast-title").text("Add transportation")
                    // Clear the form
                    $(tpayForm)[0].reset();
                    // close modal   
                    $(tpayModal).modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is remove
              
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}