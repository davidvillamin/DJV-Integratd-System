function deviceImage(deviceId) {
    return new Promise(async function(resolve, reject) {
        try {
            // get data to populate image modal
            var deviceData = await crudiAjax({deviceId:deviceId},"/device/getOneData","POST");
            // populate image list
            imageList(deviceData);

            // clear form
            $('#diClear').off('click').on('click', function(){
                $('#diPreview').attr('src', '/assets/img/no-image.jpg');
                $('#diImageId').val('');
                $('#dImageEdit')[0].reset();
                // hide delete button
                $('#diDelete').hide();
                $('#diClear').hide();
            });

            // delete image
            $('#diDelete').off('click').on('click', async function(){
                //get image id
                var data = {
                    imageId: $('#diImageId').val(),
                    deviceId: deviceId
                }
                var toastMessage = await crudiAjax(data, "/device/image/delete", "POST");
                // hide delete button
                $('#diDelete').hide();
                $('#diPreview').attr('src', '/assets/img/no-image.jpg');
                $('#diImageId').val('');
                $('#diClear').hide(); // hide clear button
                // reset form
                $('#dImageEdit')[0].reset();
                var updatedDeviceData = await crudiAjax({deviceId:deviceId},"/device/getOneData","POST");
                // refetch updated device data and repopulate image list
                imageList(updatedDeviceData);
                $(".toast").toast("show").find(".toast-body").text(toastMessage)
                $(".toast").find(".toast-title").text("Product image deleted successfully!")
                resolve()
            });

            // change preview image on file select
            $('#diImage').off('change').on('change', function(){
                var file = this.files[0];
                img2b64(file).then(function(base64String){
                    $('#diPreview').attr('src', base64String);
                });
            });

            // save image 
            $('#dImageEdit').off('submit').on('submit', async function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.data = {
                        Title: $('#diTitle').val(),
                        Description: $('#diDescription').val(),
                        base64String: await img2b64($('#diImage')[0].files[0]),
                    }
                    data.imageId = $('#diImageId').val();
                    data.deviceId = deviceId;
                    var toastMessage = await crudiAjax(data, "/device/image/edit", 'Post');
                    // show toast
                    $('#diPreview').attr('src', '/assets/img/no-image.jpg');
                    $('#diImageId').val('');
                    //reset form
                    $('#diEdit')[0].reset();
                    var updatedDeviceData = await crudiAjax({deviceId:deviceId},"/device/getOneData","POST");
                    // refetch updated device data and repopulate image list
                    imageList(updatedDeviceData);
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

function imageList(deviceData){
    $('#diImageList').empty();
    if (deviceData.Images.length === 0) {
        $('#diImageList').html('<p class="text-muted">No images available.</p>');
    } else {
        deviceData.Images.map(function(image){
            var listItem = $('<li class="list-group-item list-group-item-action d-flex justify-content-between" aria-current="true">' 
                + image.Title + '</li>');

            listItem.on('click', function(){
                $('#diPreview').attr('src', image.base64String);
                $('#diTitle').val(image.Title);
                $('#diDescription').val(image.Description);
                $('#diImageId').val(image._id);
                // unhide delete and clear button
                $('#diDelete').show();
                $('#diClear').show();
            });
            $('#diImageList').append(listItem);
        });
    }
}