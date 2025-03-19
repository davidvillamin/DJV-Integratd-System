function initializeEditTags(data){
    // hide all tags first on start
    $('#tihvteSample .badge').hide();
    //add on toggle effects
    $('#tihvteSwitch input[type="checkbox"]').on('change', function() {
        $('.' + $(this).attr('name')).toggle(this.checked);
    });

    //initialize value on tags
    data.TempStatus.forEach(function(status){
        // add also on edit tags (enable all data)
        $("." + status).show(); // unhide tags
        $("#tihvteSwitch input[name=" + status + "]").prop('checked', true); //  check the checkbox on edit tags
    })
    data.FixedStatus.forEach(function(status){
        // add also on edit tags (enable all data)
        $("." + status).show(); // unhide tags
        $("#tihvteSwitch input[name=" + status + "]").prop('checked', true); //  check the checkbox on edit tags
    })
}

function updateTags(id){
    return new Promise(async function(resolve, reject){
        try {
            //update repair accordion
            $('#tihvtEdit').on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        id: id,
                        tagsTempList: [],
                        tagsFixedList: []
                    }
                    $('.tagsTemp').each(function() {
                        if ($(this).is(":checked")){
                            data.tagsTempList.push($(this).attr('name'))
                        }
                    });
                    $('.tagsFixed').each(function() {
                        if ($(this).is(":checked")){
                            data.tagsFixedList.push($(this).attr('name'))
                        }
                    });
                    //save data
                    var toastMessage = await crudiAjax(data, "/transaction/inhouse/view/tags/update", 'Post');
                    // clear data
                    $('#tihvtEdit')[0].reset();
                    // close modal   
                    $('#tihvtEditModal').modal('toggle'); // fix modal toggle method
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