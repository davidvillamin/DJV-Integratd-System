async function initializeProductNotesEdit(Notes, productId) {
    return new Promise(function(resolve, reject) {
        try {
            // add data on notes
            $('#tpneNotes').val(Notes);

            // submit edit notes form
            $('#ipnEdit').on('submit', async function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Notes: $('#tpneNotes').val(),
                        ProductId: productId
                    }
                    var toastMessage = await crudiAjax(data, "/inventory/product/notes/edit", 'Post');
                    $('#ipnEdit')[0].reset();
                    $('#ipnEditModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("Product notes updated successfully!")
                    resolve()
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}
