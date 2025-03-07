$(function(){
    var quill = quillInit("tscNotes")
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#tsIndexTable').DataTable({
        data: crudiAjax({}, "/transaction/onsite/index/poplate/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    // populate add transations client list
    $("#tscClientName").append(crudiAjax({}, "/transaction/sales/create/clientList", "POST"))

    // add transactions
    $('#tsCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {
                TransactionType: "sales",
                JobOrder:$('#tscJobOrderNumber').val(),
                RecieveDate:$('#tscRecieveDate').val(),
                Device:$('#tscDevice').val(),
                SerialNumber:$('#tscSerial').val(),
                Notes: quill.getContents(),
                Client:$('#tscClientName').val(),
                TempStatus: [] 
            }
            data.TempStatus.push('Pending')
            // repopulate table
            dTable.clear().rows.add(crudiAjax(data, "/transaction/onsite/create/ajax", "Post")).draw()
            // clear form
            $('#tsCreate')[0].reset();
            // clear quill
            $(".ql-editor").html("")
            // close modal   
            $('#tsCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly created a new transaction!")
            $(".toast").find(".toast-title").text("New transaction")
        }
    })
})