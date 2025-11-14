function inhouseImage(inhouseId) {
    return new Promise(async function(resolve, reject) {
        try {
            // get data to populate image modal
            var inhouseData = await crudiAjax({inhouseId:inhouseId},"/transaction/inhouse/getOneData","POST");
            // populate image list
            imageList(inhouseData);

            // clear form
            $('#tihiClear').off('click').on('click', function(){
                $('#tihiPreview').attr('src', '/assets/img/no-image.jpg');
                $('#tihiImageId').val('');
                $('#tihImageEdit')[0].reset();
                // hide delete button
                $('#tihiDelete').hide();
                $('#tihiClear').hide();
            });

            // delete image
            $('#tihiDelete').off('click').on('click', async function(){
                //get image id
                var data = {
                    imageId: $('#tihiImageId').val(),
                    inhouseId: inhouseId
                }
                var toastMessage = await crudiAjax(data, "/transaction/inhouse/image/delete", "POST");
                // hide delete button
                $('#tihiDelete').hide();
                $('#tihiPreview').attr('src', '/assets/img/no-image.jpg');
                $('#tihiImageId').val('');
                $('#tihiClear').hide(); // hide clear button
                // reset form
                $('#tihImageEdit')[0].reset();
                var updatedInhouseData = await crudiAjax({inhouseId:inhouseId},"/transaction/inhouse/getOneData","POST");
                // refetch updated inhouse data and repopulate image list
                imageList(updatedInhouseData);
                $(".toast").toast("show").find(".toast-body").text(toastMessage)
                $(".toast").find(".toast-title").text("Product image deleted successfully!")
                resolve()
            });

            // change preview image on file select
            $('#tihiImage').off('change').on('change', function(){
                var file = this.files[0];
                img2b64(file).then(function(base64String){
                    $('#tihiPreview').attr('src', base64String);
                });
            });

            // save image 
            $('#tihImageEdit').off('submit').on('submit', async function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.data = {
                        Title: $('#tihiTitle').val(),
                        Description: $('#tihiDescription').val(),
                        base64String: await img2b64($('#tihiImage')[0].files[0]),
                    }
                    data.imageId = $('#tihiImageId').val();
                    data.inhouseId = inhouseId;
                    var toastMessage = await crudiAjax(data, "/transaction/inhouse/image/edit", 'Post');
                    // show toast
                    $('#tihiPreview').attr('src', '/assets/img/no-image.jpg');
                    $('#tihiImageId').val('');
                    //reset form
                    $('#tihImageEdit')[0].reset();
                    var updatedInhouseData = await crudiAjax({inhouseId:inhouseId},"/transaction/inhouse/getOneData","POST");
                    // refetch updated inhouse data and repopulate image list
                    imageList(updatedInhouseData);
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

function imageList(inhouseData){
    $('#tihiImageList').empty();
    if (inhouseData.Images.length === 0) {
        $('#tihiImageList').html('<p class="text-muted">No images available.</p>');
    } else {
        inhouseData.Images.map(function(image){
            var listItem = $('<li class="list-group-item list-group-item-action d-flex justify-content-between" aria-current="true">' 
                + image.Title + '</li>');

            listItem.on('click', function(){
                $('#tihiPreview').attr('src', image.base64String);
                $('#tihiTitle').val(image.Title);
                $('#tihiDescription').val(image.Description);
                $('#tihiImageId').val(image._id);
                // unhide delete and clear button
                $('#tihiDelete').show();
                $('#tihiClear').show();
            });
            $('#tihiImageList').append(listItem);
        });
    }
}