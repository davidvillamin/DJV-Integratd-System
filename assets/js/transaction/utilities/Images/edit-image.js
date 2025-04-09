function initializeEditImage(){
    // add click event for edit icon
    $('.tihviEdit').on('click', function(event) {
        event.stopPropagation(); // prevent triggering the parent list item click
        $('#tihvieImageTitle').val($(this).closest('.tihviListItem').attr('data-title'))
        $('#tihvieDescription').val($(this).closest('.tihviListItem').attr('data-desc'))
        $('#tihvieId').val($(this).closest('.tihviListItem').attr('data-id'))

        // add link on the image preview
        $('#tihviePreviewModal').attr('src', $(this).closest('.tihviListItem').attr('data-b64'));
        
        // Trigger the parent list item click
        $(this).closest('.tihviListItem').trigger('click');
        // add preivew function
        addImageInitialize("tihvieImage","tihviePreviewModal")
    });
}

function saveEditImage(){
    return new Promise(async function(resolve, reject){
        try {
            //update repair accordion
            $('#tihviEdit').on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    data.data = {
                        Title:$('#tihvieImageTitle').val(),
                        Description:$('#tihvieDescription').val()
                    }
                    data.id = id
                    data.imgId = $('#tihvieId').val()
                    
                    if (!$('#tihvieImage')[0].files.length) {
                        //no files selected on input file
                        data.data.base64String = $('#tihviePreviewModal').attr('src')
                    } else {
                        // if there is new file 
                        data.data.base64String = await img2b64($('#tihvieImage')[0].files[0])
                    }
                    //save data
                    var toastMessage = await crudiAjax(data, "/transaction/inhouse/edit/image/edit", 'Post');
                    // clear data
                    $('#tihviEdit')[0].reset();
                    // close modal   
                    $('#tihviEditModal').modal('toggle'); // fix modal toggle method
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