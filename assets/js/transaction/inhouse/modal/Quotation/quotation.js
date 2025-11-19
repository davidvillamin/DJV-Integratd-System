function inhouseQuotation(){
    return new Promise(function(resolve, reject){
        try {
            // Preview Image Quotation
            $('#tihqImage').off('change').on('change', function(){
                var file = this.files[0];
                img2b64(file).then(function(base64String){
                    $('#tihqPreview').attr('src', base64String);
                });
            });

            //save Quotation Image
            $('#tihQuotationForm').off('submit').on('submit', async function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.data = {
                        Title: $('#tihqTitle').val(),
                        base64String: await img2b64($('#tihqImage')[0].files[0]),
                    }
                    data.inhouseId = inhouseId;
                    var toastMessage = await crudiAjax(data, "/transaction/inhouse/quotation/save", "POST");
                    // close modal
                    $('#tihQuotationModal').modal('hide');
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("Quotation image saved successfully!")
                }
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}