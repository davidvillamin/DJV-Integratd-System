function inhouseComplete(inhouseId){
    return new Promise(function(resolve, reject){
        try {
            $('#tihdmComplete').off('click').on('click', async function(){
                if (confirm("Are you sure you want to change the status to Complete?")){
                    // check if balance is zero
                    var balance = parseFloat($('#tihoBalance').text().replace(/[^0-9.-]+/g,""));
                    if (balance !== 0) {
                        alert("Balance must be zero before marking as Complete.");
                        return;
                    } else {
                        // proceed to change status
                        var toastMessage = await crudiAjax({inhouseId: inhouseId}, "/transaction/inhouse/complete/save", "POST");
                        // toaster
                        $(".toast").toast("show").find(".toast-body").text(toastMessage)
                        $(".toast").find(".toast-title").text("Status Updated")
                    }
                }
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}