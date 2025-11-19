function inhousePreAssessment(inhouseId) {
    return new Promise(async function(resolve, reject) {
        try {
            // get data to populate notes modal
            var inhouseData = await crudiAjax({inhouseId:inhouseId},"/transaction/inhouse/getOneData","POST");
            $('#tihpaNotes').val(inhouseData.PreAssessmentNotes);
            // submit edit notes form
            $('#tihPreAssessmentForm').on('submit', async function(e) {
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Notes: $('#tihpaNotes').val()
                    }
                    data.inhouseId = inhouseId;
                    var toastMessage = await crudiAjax(data, "/transaction/inhouse/preassessment/edit", 'Post');
                    $('#tihPreAssessmentForm')[0].reset();
                    $('#tihPreAssessmentModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("Device notes updated successfully!")
                    resolve()
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}