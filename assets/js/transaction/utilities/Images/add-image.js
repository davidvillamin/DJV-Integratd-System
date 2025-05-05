function addImageInitialize(input,target){
    // add functionality when you select and image it will display a preview on the side
    $("#" + input + "").on('change',async function(e) {
        await img2b64(e.target.files[0]).then(function(base64String){
            $("#" + target + "").attr('src', base64String);
        })
    });
}

function addImage(transId){ // transaction ID
    return new Promise(async function(resolve, reject){
        try {
            //update repair accordion
            $('#tuiAdd').on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    
                    data.image = {
                        Title:$('#tuiaTitle').val(),
                        Description:$('#tuiaDescription').val(),
                        base64String: await img2b64($('#tuiaImage')[0].files[0])
                    }
                    data.transId = transId;
                    // show toast and save data
                    $(".toast").toast("show").find(".toast-body").text(crudiAjax(data, "/transaction/inhouse/edit/image/add", 'Post'))
                    $(".toast").find(".toast-title").text("Add Image")

                    $('#tuiAdd')[0].reset(); // reset data of form
                    $('#tuiAddModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is remove
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

