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
    var partsinformationData = await crudiAjax({id: id}, "/parts/partsinformation/view/populate", 'Post');
    pvPopulateData(partsinformationData); // populate data

    // initialize datatable (for serial list on view)
    var dTable = $('#ivViewTable').DataTable({
        data: crudiAjax(id, "/parts/view/populate/serial/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    //initialize bDTable for add serial
    $('#ivcSerialTable').bootstrapTable()

    //on enter or click on add (add serial on the list)
    // enter
    $('#ivcSerial').on('keypress',function(k){
        if (k.which == 13) {
            ivcsAddTableData(partsinformationData)
        }
    })

    // add button 
    $('#ivcAdd').on('click',function(){
        ivcsAddTableData(partsinformationData)
    })

    //disable enter event on form
    $('#ivCreate').on('keypress',function(e){
        if (e.which === 13 && e.target.nodeName !== 'text' && e.target.type !== 'submit') {
            e.preventDefault();
        } 
    })

    //save serial
    $('#ivCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {}

            //get data on bBTable
            data.data = $('#ivcSerialTable').bootstrapTable('getData')
            data.id = id

            dTable.clear().rows.add(crudiAjax(data, "/parts/serial/create", "Post")).draw()
            $('#ivCreate')[0].reset();
            //reset table
            $('#ivcSerialTable').bootstrapTable('removeAll')

            $('#ivCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly created a parts information!")
            $(".toast").find(".toast-title").text("New parts information")
        }
    })
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
    $('.ivName').text(data.Brand + ' ' + data.Model )
    $('#ivDescription').text(data.Description)
}