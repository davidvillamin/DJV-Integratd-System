function editRepair(id){
    return new Promise(async function(resolve, reject){
        try {
            // poppulate data
            var currentTransaction = await crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post');
            //Report Edit click populate details
            $('#tihvRepairEdit').on('click',function(){
                $('#tihvreJobOrderNumber').val(currentTransaction.JobOrder)
                $('#tihvreRecieveDate').val(moment(currentTransaction.RecieveDate).format('YYYY-MM-DD') )
                $('#tihvreDevice').val(currentTransaction.Device)
                $('#tihvreSerial').val(currentTransaction.SerialNumber)
                // this option will be not available until the technician db is created
                // $('#tihvreTechnician').val(currentTransaction.Technician)
            })


            //update repair accordion
            $('#tihvrEdit').on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
                    
                    data.data = {
                        JobOrder:$('#tihvreJobOrderNumber').val(),
                        RecieveDate:$('#tihvreRecieveDate').val(),
                        Device:$('#tihvreDevice').val(),
                        SerialNumber:$('#tihvreSerial').val(),
                        Technician: $("#tihvreTechnician option:selected").val(),
                        TempStatus: []
                    }
                    // alert($('#tihvrTechnician option:selected').val())
                    if ( $('#tihvreTechnician option:selected').val() != 'Technician'){
                        data.data.TempStatus.push("InProgress")
                    }
                    data.id = id
                    //save data
                    var toastMessage = await crudiAjax(data, "/transaction/inhouse/edit", 'Post');
                    // clear data
                    $('#tihvrEdit')[0].reset();
                    // close modal   
                    $('#tihvrEditModal').modal('toggle'); // fix modal toggle method
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