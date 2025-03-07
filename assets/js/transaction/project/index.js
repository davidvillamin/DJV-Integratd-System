$(function(){
    var quill = quillInit("tpcNotes")
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#tpIndexTable').DataTable({
        data: crudiAjax({}, "/transaction/onsite/index/poplate/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    // populate add transations client list
    $("#tpcClientName").append(crudiAjax({}, "/transaction/project/create/clientList", "POST"))

    // add transactions
    $('#tpCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {
                TransactionType: "project",
                JobOrder:$('#tpcJobOrderNumber').val(),
                RecieveDate:$('#tpcRecieveDate').val(),
                Device:$('#tpcDevice').val(),
                SerialNumber:$('#tpcSerial').val(),
                Notes: quill.getContents(),
                Client:$('#tpcClientName').val(),
                TempStatus: [] 
            }
            data.TempStatus.push('Pending')
            // repopulate table
            dTable.clear().rows.add(crudiAjax(data, "/transaction/onsite/create/ajax", "Post")).draw()
            // clear form
            $('#tpCreate')[0].reset();
            // clear quill
            $(".ql-editor").html("")
            // close modal   
            $('#tpCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly created a new transaction!")
            $(".toast").find(".toast-title").text("New transaction")
        }
    })
})