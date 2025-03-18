function deviceCreate() {
    
    
    return new Promise(function(resolve, reject) {
        try {
            // create transaction
            $('#diCreate :submit').on('click',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Brand:$('#dicBrand').val(),
                        Model:$('#dicModel').val(),
                        Serial:$('#dicSerial').val(),
                        Notes:$('#dicNotes').val(),
                    }
                    // // save data on a variable for confirmation
                    var crudiAjaxResult = crudiAjax(data, "/device/create", "Post")
                    // re initializeTable
                    
                    // // clear form
                    $('#diCreate')[0].reset();
                    // // close modal   
                    $('#diCreateModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // // show toast
                    $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
                    $(".toast").find(".toast-title").text("New Client")
                  
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })



}