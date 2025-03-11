function createClient(dTable){

    listenerContactNumberAdd();
    listenerContactNumberDelete();
    
    $('#ivCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var contactNumbers = [];
            // populate all contact number and compress it to an array
            $('.ivContactNumber').each(function() {
                contactNumbers.push($(this).val());
            });
    
            var data = {
                Name:$('#ivName').val(),
                Address:$('#ivAddress').val(),
                Email:$('#ivEmail').val(),
                isIndividual:true,
                isMale:$('input[name="ivGender"]:checked').val(),
                Notes: $("#ivNotes").val(),
                ContactDetails: contactNumbers,
            }
    
            // save data on a variable for confirmation
            var crudiAjaxResult = crudiAjax(data, "/parts/create", "Post")
            // re initialize table
            initializeTable(dTable)
            // clear form
            $('#ivCreateIndividual')[0].reset();
            // close modal   
            $('#ivCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
            $(".toast").find(".toast-title").text("New inventory")
        }
    })

    //==================================================================
    // for Individual
    function listenerContactNumberAdd() {
        //cciContactNumberAdd = Client Create Individual Contact Number
        $(".ivContactNumberAdd").off('click').on('click', function(){
            var newContactGroup = $('.ivContactNumberGroup').first().clone();
            newContactGroup.find('input').val('');
            newContactGroup.insertBefore($(this).closest('.ivContactNumberGroup'));
            listenerContactNumberAdd(); // re-attach listener to new elements
            listenerContactNumberDelete(); // re-attach delete listener to new elements
        });
    }

    function listenerContactNumberDelete() {
        // cciContactNumberDelete = Client Create Indivial Contact Number Delete
        $(".ivContactNumberDelete").off('click').on('click', function(){
            if ($('.ivContactNumberGroup').length > 1) {
                $(this).closest('.ivContactNumberGroup').remove();
        }
    });
}

}


