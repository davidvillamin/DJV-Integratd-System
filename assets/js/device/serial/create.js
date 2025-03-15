function deviceViewSerial() {
    
    
    return new Promise(function(resolve, reject) {
        try {
            // create transaction
            $('#dvsCreateModal :submit').on('click',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    
                    // get form data
                    
                    // // save data on a variable for confirmation
                    var crudiAjaxResult = crudiAjax(data, "/device/serial/view", "Post")
                    // // clear form
                    $('#dvsCreate')[0].reset();
                    // // close modal   
                    $('#dvsCreateModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // // show toast
                    $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
                    $(".toast").find(".toast-title").text("Updated Serial number")
                  
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })



}