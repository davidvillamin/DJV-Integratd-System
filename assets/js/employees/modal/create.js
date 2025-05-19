function createEmployee() {
    return new Promise(function(resolve, reject) {
        try {

            // eic = Employee Information Create
            
            $('#eicCreate').on('submit',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Name:$('.eicName').val(),  
                        Address:    [{
                            AddressLine: String
                        }],
                        JobTitle:$('.eicJob').val(),
                        ContactDetails:  [{
                            ContactNumber: String
                        }],
                    }
                    $('.eicContactNumber').each(function(index) {
                        data.ContactDetails[index].ContactNumber = $(this).val();
                    });
                    $('.eicAddress').each(function(index) {
                        data.Address[index].AddressLine = $(this).val(); 
                            
                    });
                    

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
// ei = Employee Information
