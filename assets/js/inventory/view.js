var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(async function(){
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

    //population of data
    var itemInformationData = await crudiAjax({id: id}, "/inventory/iteminformation/view/populate", 'Post');
    pvPopulateData(itemInformationData); // populate data

    // initialize datatable (for serial list on view)
    var dTable = $('#iviiTable').DataTable({
        data: crudiAjax(id, "/inventory/view/populate/serial/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    // ==================================================================================
    // Serial
    // ==================================================================================
    // Initialize add serial
    //inventory / serial / crud / create
    initializeAddSerial()
    // save serial
    addSerial()
    //save serial
})

//create serial (list )
function pvcsAddTableData(partsInfo){
    // prevent empty data
    var inputs = ["#ivcSuppliersPrice", "#ivcRetailPrice", "#ivcSerial"];
    var allFilled = true

    inputs.forEach(function(input){
        if ($(input).val() === '') {
          allFilled = false;
        }
    });

    if (allFilled){
        $('#ivcSerialTable').bootstrapTable('append',{
            Brand: partsInfo.Brand,
            Model: partsInfo.Model,
            Description: partsInfo.Description,
            partinformation: id,
            Serial: $('#ivcSerial').val(),
            SupplierPrice: $('#ivcSuppliersPrice').val(),
            RetailPrice: $('#ivcRetailPrice').val()
        })
        $('#ivcSerial').val('') //reset value of serial
    }
}

function pvPopulateData(data){
    $('.iviiptName').text(data.Brand + ' ' + data.Model )
    $('#iviiDescription').text(data.Description)
}