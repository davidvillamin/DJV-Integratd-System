function clientNotes(clientId) {
    return new Promise(async function(resolve, reject) {
        try {
            // get data to populate notes modal
            var clientData = await crudiAjax({clientId:clientId},"/client/getOneData","POST");
            $('#cnNotes').val(clientData.Notes);
            // submit edit notes form
            $('#cEditNotes').on('submit', async function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Notes: $('#cnNotes').val()
                    }
                    data.clientId = clientId;
                    var toastMessage = await crudiAjax(data, "/client/notes", 'Post');
                    $('#cEditNotes')[0].reset();
                    $('#cEditNotesModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("Client notes updated successfully!")
                    resolve()
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}