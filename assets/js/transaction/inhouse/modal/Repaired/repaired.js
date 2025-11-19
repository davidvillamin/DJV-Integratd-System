function inhouseRepaired(inhouseId){
    return new Promise(function(resolve, reject){
        try {
            $('#tihdmRepaired').off('click').on('click', async function(){
                if (confirm("Are you sure you want to change the status to Repaired?")){
                    var toastMessage = await crudiAjax({inhouseId: inhouseId}, "/transaction/inhouse/repaired/save", "POST");
                    // toaster
                    $(".toast").toast("show").find(".toast-body").text(toastMessage)
                    $(".toast").find(".toast-title").text("Status Updated")
                }
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}