function createEmployee() {
    return new Promise(function(resolve, reject) {
        try {
            $('#eiCreate').on('submit',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Name:$('#eicName').val(),
                        Address:$('#eicAddress').val(),
                        Job:$('#eicJob').val()
                    }

                    var crudiAjaxResult = crudiAjax(data, "/employees/create", "Post")
                    $('#eiCreate')[0].reset();
                    // // close modal   
                    $('#eCreateEmployee').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // // show toast
                    $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
                    $(".toast").find(".toast-title").text("New Client")

                    resolve()
                }

            })

        } catch(error) {
            reject(error)
        }
    })
}