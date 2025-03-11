function addTranspoTable(){
    //initialize table and add color for footer
    $("#tihvtTable").on('post-body.bs.table', function () {
        var rows = $(this).find('tbody tr');
        rows.each(function () {
            var description = $(this).find('td').eq(0).html();
            if (description.includes("<strong>Total</strong>")) {
                $(this).css('background-color', 'yellow');
            }
        });
    });
    var footer = {
        Description: "<strong>Total</strong>",
        Price: 0
    }
    var tbl = $("#tihvtTable").bootstrapTable();
    tbl.bootstrapTable("append",footer)

    $('#tihvbtAdd').on('submit',async function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var newData = {
                Description: $('#tihvbtDescription').val(),
                Price: $('#tihvbtPrice').val(),
            }
            var oldData = tbl.bootstrapTable('getData');
            oldData.pop(); // Remove the last row (footer)
            oldData.push(newData); // Add the new data
            var total = oldData.reduce((sum, row) => sum + parseFloat(row.Price), 0); // Calculate the new total
            oldData.push({
                Description: "<strong>Total</strong>",
                Price: total
            }); // Add the footer back with the new total
            tbl.bootstrapTable('load', oldData); // Reload the table with the updated data

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