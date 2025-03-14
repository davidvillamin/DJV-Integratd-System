
// ivii = inventory view item information
function createItemInformation(){
    return new Promise(function(resolve, reject){
        try {
            $('#iiiCreate').on('submit',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Brand: $('#iiiBrand').val(),
                        Model: $('#iiiModel').val(),
                        Description: $('#iiiDescription').val(),
                    }
                    var toastMessage = crudiAjax(data, "/inventory/iteminformation/create", 'Post');
                    $('#iiiCreate')[0].reset();
                    $('#iiiCreateModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("New parts information")
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}