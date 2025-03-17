function addTransportation(id){
    return new Promise(function(resolve,reject){
        try {
            $('#tihvbtAdd').on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.transportation = {
                        Description: $('#tihvbtDescription').val(),
                        Quantity: $('#tihvbtQuantity').val(),
                        UnitPrice: $('#tihvbtUnitPrice').val(),
                        Price: $('#tihvbtPrice').val(),
                    }
                    data.id = id
                    // save to database
                    var crudiAjaxResult = await crudiAjax(data, '/transaction/inhouse/view/billing/transportation/add', 'post')
                    // Clear the form
                    $('#tihvbtAdd')[0].reset();
                    // close modal   
                    $('#tihvbtAddModal').modal('toggle'); // fix modal toggle method
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