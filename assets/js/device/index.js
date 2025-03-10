$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
    
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#dIndexTable').DataTable({
        // data: crudiAjax({}, "/device/populate/index/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    //create parts information
    $('#dCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {
                Brand: $('#dcBrand').val(),
                Model: $('#dcModel').val(),
                Description: $('#dcDescription').val(),
            }
            dTable.clear().rows.add(crudiAjax(data, "/device/deviceinformation/create", "Post")).draw()
            $('#dCreate')[0].reset();

            $('#dCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly created a device information!")
            $(".toast").find(".toast-title").text("New device information")
        }
    })
})