function addTranspoTable(){
    // initialize table
    var tbl = $("#tihvbtTable").bootstrapTable();

    $('#tihvbtAdd').on('submit',async function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var newData = {
                Description: "<i class='bi bi-trash text-danger tihvbtDelete'></i>\
                            <i class='bi bi-pencil-square text-warning tihvbtEdit'></i>   " 
                            + $('#tihvbtDescription').val(),
                Quantity: $('#tihvbtQuantity').val(),
                UnitPrice: $('#tihvbtUnitPrice').val(),
                Price: $('#tihvbtPrice').val(),
            }

            tbl.bootstrapTable("append",newData)
            // save to database
            
            // Clear the form
            $('#tihvbtAdd')[0].reset();
            // close modal   
            $('#tihvbtAddModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is remove
            // show toast
            $(".toast").toast("show").find(".toast-body").text("Transportation value added")
            $(".toast").find(".toast-title").text("Add transportation")
        }
    })
}