$(function(){
    var quill = quillInit("toscNotes")
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#tosIndexTable').DataTable({
        data: crudiAjax({}, "/transaction/onsite/index/poplate/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    // populate add transations client list
    $("#toscClientName").append(crudiAjax({}, "/transaction/onsite/create/clientList", "POST"))

    // add transactions
    $('#tosCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {
                TransactionType: "onsite",
                JobOrder:$('#toscJobOrderNumber').val(),
                RecieveDate:$('#toscRecieveDate').val(),
                Device:$('#toscDevice').val(),
                SerialNumber:$('#toscSerial').val(),
                Notes: quill.getContents(),
                Client:$('#toscClientName').val(),
                TempStatus: [] 
            }
            data.TempStatus.push('Pending')
            // repopulate table
            dTable.clear().rows.add(crudiAjax(data, "/transaction/onsite/create/ajax", "Post")).draw()
            // clear form
            $('#tosCreate')[0].reset();
            // clear quill
            $(".ql-editor").html("")
            // close modal   
            $('#tosCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly created a new transaction!")
            $(".toast").find(".toast-title").text("New transaction")
        }
    })
})