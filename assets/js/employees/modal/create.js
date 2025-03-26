function createEmployee() {
    return new Promise(function(resolve, reject) {
        try {
            $('#eicCreate').on('submit',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Name:$('#eicName').val(),
                        Address:$('#eicAddress').val(),
                        JobTitle:$('#eicJob').val(),
                        ContactDetails:  []
                    }

                    // Initialize ContactDetails as an empty array
                    $('.eicContactNumber').each(function(){
                        data.ContactDetails.push({
                            ContactNumber: Number($(this).val()) // Corrected $(this).find().val() to $(this).val()
                        });
                    })
                    
                    console.log(data);
                    

                    crudiAjax(data, "/employees/create", "Post")
                    $('#eicCreate')[0].reset();
                    // // close modal   
                    $('#eCreateEmployee').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // // show toast
                    $(".toast").toast("show").find(".toast-body").text("You have successfully created a new employee!")
                    $(".toast").find(".toast-title").text("New Client")

                    resolve()
                }

            })

        } catch(error) {
            reject(error)
        }
    })
}