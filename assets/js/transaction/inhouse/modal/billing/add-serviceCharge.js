function addServiceCharge(id){
    return new Promise(function(resolve,reject){
        try {
            $('#tihvbscAdd').on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.ServiceCharge = {
                        Description: $('#tihvbscDescription').val(),
                        Price: $('#tihvbscPrice').val(),
                    }
                    data.id = id
                    // save to database
                    var crudiAjaxResult = await crudiAjax(data, '/transaction/inhouse/view/billing/serviceCharge/add', 'post')
                    // Clear the form
                    $('#tihvbscAdd')[0].reset();
                    // close modal   
                    $('#tihvbscAddModal').modal('toggle'); // fix modal toggle method
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