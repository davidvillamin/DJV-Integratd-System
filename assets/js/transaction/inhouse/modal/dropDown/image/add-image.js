function addImagePreview(){
    $("#tihviImage").on('change',async function(e) {
        await img2b64(e.target.files[0]).then(function(base64String){
            $("#tihviPreviewModal").attr('src', base64String);
        })
    });
}

function addImage(id){
    return new Promise(async function(resolve, reject){
        try {
            //update repair accordion
            $('#tihviAdd').on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    
                    data.data = {
                        Title:$('#tihviImageTitle').val(),
                        Description:$('#tihviDescription').val(),
                        base64String: await img2b64($('#tihviImage')[0].files[0])
                    }
                    data.id = id
                    //save data
                    var toastMessage = await crudiAjax(data, "/transaction/inhouse/edit/image/add", 'Post');
                    // clear data
                    $('#tihviAdd')[0].reset();
                    // close modal   
                    $('#tihviAddModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is remove
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("Edit transaction")
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

function img2b64(file){
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        
        reader.onloadend = function() {
            var base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
            base64String = 'data:image/png;base64,' + base64String;
            resolve(base64String);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}