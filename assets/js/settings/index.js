$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });

    //remove class collapsed after click on sidebar
    $("#sbsettings").removeClass("collapsed");
    
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datata
    // ble
    var dTable = $('#piIndexTable').DataTable({
        data: crudiAjax({}, "/parts/index/populate/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    //create parts information
    $('#piCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {
                Brand: $('#picBrand').val(),
                Model: $('#picModel').val(),
                Description: $('#picDescription').val(),
            }
            dTable.clear().rows.add(crudiAjax(data, "/parts/partsinformation/create", "Post")).draw()
            $('#piCreate')[0].reset();

            $('#piCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly created a parts information!")
            $(".toast").find(".toast-title").text("New parts information")
        }
    })
})