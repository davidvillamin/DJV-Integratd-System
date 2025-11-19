function inhouseApproval(inhouseId){
    return new Promise(function(resolve, reject){
        try {
            // Preview Image Approval
            $('#tihaImage').off('change').on('change', function(){
                var file = this.files[0];
                img2b64(file).then(function(base64String){
                    $('#tihaPreview').attr('src', base64String);
                });
            });

            //save Approval Image
            $('#tihApprovalForm').off('submit').on('submit', async function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.data = {
                        Title: $('#tihaTitle').val(),
                        base64String: await img2b64($('#tihaImage')[0].files[0]),
                    }
                    data.inhouseId = inhouseId;
                    var toastMessage = await crudiAjax(data, "/transaction/inhouse/approval/save", "POST");
                    // close modal
                    $('#tihApprovalModal').modal('hide');
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("Approval image saved successfully!")
                }
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}