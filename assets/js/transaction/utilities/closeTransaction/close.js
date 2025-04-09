function closeTransaction(id){
    return new Promise (function(resolve, reject){
        try {
            $('#tihvctUpdate').on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.data = {
                        Date:$('#tihvctDate').val(),
                        Technician:$('#tihvctTechnician :selected').text(),
                    }
                    data.id = id
                    //save data
                    // var toastMessage = await crudiAjax(data, "/transaction/inhouse/view/release/update", 'Post');
                    // clear data
                    $('#tihvrelUpdate')[0].reset();
                    // close modal   
                    $('#tihvrelModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is remove
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("Edit transaction")
                    resolve()
                }
            })
        } catch (error) {
            reject()
        }
    })
}