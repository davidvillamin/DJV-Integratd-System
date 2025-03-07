$(function(){
    var quill = quillInit("tihcNotes")
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#tihIndexTable').DataTable({
        data: crudiAjax({}, "/transaction/inhouse/index/poplate/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    // populate add transations client list
    $("#tihcClientName").append(crudiAjax({}, "/transaction/inhouse/create/clientList", "POST"))

    // add transactions
    $('#tihCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {
                TransactionType: "Inhouse",
                JobOrder:$('#tihcJobOrderNumber').val(),
                RecieveDate:$('#tihcRecieveDate').val(),
                Device:$('#tihcDevice').val(),
                SerialNumber:$('#tihcSerial').val(),
                Notes: quill.getContents(),
                Client:$('#tihcClientName').val(),
                TempStatus: [] 
            }
            data.TempStatus.push('Pending')
            // repopulate table
            dTable.clear().rows.add(crudiAjax(data, "/transaction/inhouse/create/ajax", "Post")).draw()
            // clear form
            $('#tihCreate')[0].reset();
            // clear quill
            $(".ql-editor").html("")
            // close modal   
            $('#tihCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly created a new transaction!")
            $(".toast").find(".toast-title").text("New transaction")
        }
    })
})