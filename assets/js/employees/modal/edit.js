
function editEmployees(){
    return new Promise(async function(resolve, reject)  {
        try {

            $('#eieModal :submit').on('click', async function(e) {
                if ($(this).closest('form').is(':valid') === true) {
                    e.preventDefault();
                    employee.data = {
                        Name: $('#eieName').val(),
                        ContactNumber: $('#eieContactNumber').val(),
                        Job: $('#eieJob').val(),
                        Address: $('#eieAddress').val()
                    }
                    await crudiAjax(employee, "/employees/edit", 'Post')
                    // close modal   
                    $('#eEditEmployee').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text("You have successfuly edited a client!")
                    $(".toast").find(".toast-title").text("Edit Client")

                    resolve();
                }
            })
        
        }catch (error){
            reject(error)
        }
    })
}