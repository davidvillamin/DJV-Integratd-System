function addPayment(id){
    return new Promise(function(resolve,reject){
        try {
            $('#tihvbpayAdd').on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.Payment = {
                        Date: $('#tihvbpayDate').val(),
                        Description: $('#tihvbpayDescription').val(),
                        Amount: $('#tihvbpayAmount').val(),
                    }
                    data.id = id
                    // save to database
                    var crudiAjaxResult = await crudiAjax(data, '/transaction/inhouse/view/billing/payment/add', 'post')
                    // Clear the form
                    $('#tihvbpayAdd')[0].reset();
                    // close modal   
                    $('#tihvbpayAddModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is remove
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
                    $(".toast").find(".toast-title").text("Add transportation")
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}