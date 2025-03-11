// prefix legends
//   iv = inventory
//   ivc = inventory create

$(function(){
    
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });

    //remove class collapsed after click on sidebar
    $("#sbinventory").removeClass("collapsed");

    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#ivIndexTable').DataTable({
        data: crudiAjax({}, "/parts/index/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    //create parts information
    $('#ivCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {
                Brand: $('#ivcBrand').val(),
                Model: $('#ivcModel').val(),
                Description: $('#ivcDescription').val(),
            }
            dTable.clear().rows.add(crudiAjax(data, "/parts/partsinformation/create", "Post")).draw()
            $('#ivCreate')[0].reset();

            $('#ivCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly created a parts information!")
            $(".toast").find(".toast-title").text("New parts information")
        }
    })
})