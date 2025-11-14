function clientImage(clientId) {
    return new Promise(async function(resolve, reject) {
        try {
            // get data to populate image modal
            var clientData = await crudiAjax({clientId:clientId},"/client/getOneData","POST");
            // populate image list
            imageList(clientData);

            // clear form
            $('#ciClear').off('click').on('click', function(){
                $('#ciPreview').attr('src', '/assets/img/no-image.jpg');
                $('#ciImageId').val('');
                $('#cImageEdit')[0].reset();
                // hide delete button
                $('#ciDelete').hide();
                $('#ciClear').hide();
            });

            // delete image
            $('#ciDelete').off('click').on('click', async function(){
                //get image id
                var data = {
                    imageId: $('#ciImageId').val(),
                    clientId: clientId
                }
                var toastMessage = await crudiAjax(data, "/client/image/delete", "POST");
                // hide delete button
                $('#ciDelete').hide();
                $('#ciPreview').attr('src', '/assets/img/no-image.jpg');
                $('#ciImageId').val('');
                $('#ciClear').hide(); // hide clear button
                // reset form
                $('#cImageEdit')[0].reset();
                var updatedClientData = await crudiAjax({clientId:clientId},"/client/getOneData","POST");
                // refetch updated client data and repopulate image list
                imageList(updatedClientData);
                $(".toast").toast("show").find(".toast-body").text(toastMessage)
                $(".toast").find(".toast-title").text("Product image deleted successfully!")
                resolve()
            });

            // change preview image on file select
            $('#ciImage').off('change').on('change', function(){
                var file = this.files[0];
                img2b64(file).then(function(base64String){
                    $('#ciPreview').attr('src', base64String);
                });
            });

            // save image 
            $('#cImageEdit').off('submit').on('submit', async function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.data = {
                        Title: $('#ciTitle').val(),
                        Description: $('#ciDescription').val(),
                        base64String: await img2b64($('#ciImage')[0].files[0]),
                    }
                    data.imageId = $('#ciImageId').val();
                    data.clientId = clientId;
                    var toastMessage = await crudiAjax(data, "/client/image/edit", 'Post');
                    // show toast
                    $('#ciPreview').attr('src', '/assets/img/no-image.jpg');
                    $('#ciImageId').val('');
                    //reset form
                    $('#cImageEdit')[0].reset();
                    var updatedClientData = await crudiAjax({clientId:clientId},"/client/getOneData","POST");
                    // refetch updated client data and repopulate image list
                    imageList(updatedClientData);
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("Product image updated successfully!")
                    resolve()
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

function imageList(clientData){
    $('#ciImageList').empty();
    if (clientData.Images.length === 0) {
        $('#ciImageList').html('<p class="text-muted">No images available.</p>');
    } else {
        clientData.Images.map(function(image){
            var listItem = $('<li class="list-group-item list-group-item-action d-flex justify-content-between" aria-current="true">' 
                + image.Title + '</li>');

            listItem.on('click', function(){
                $('#ciPreview').attr('src', image.base64String);
                $('#ciTitle').val(image.Title);
                $('#ciDescription').val(image.Description);
                $('#ciImageId').val(image._id);
                // unhide delete and clear button
                $('#ciDelete').show();
                $('#ciClear').show();
            });
            $('#ciImageList').append(listItem);
        });
    }
}