var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(async function(){
     // initialize toast
     $(".toast").toast({
        delay: 5000
    });

    //population of data
    var partsinformationData = await crudiAjax({id: id}, "/parts/partsinformation/view/populate", 'Post');
    pvPopulateData(partsinformationData); // populate data

    // initialize datatable (for serial list on view)
    var dTable = $('#pViewTable').DataTable({
        data: crudiAjax(id, "/parts/view/populate/serial/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    //initialize bDTable for add serial
    $('#pscSerialTable').bootstrapTable()

    //on enter or click on add (add serial on the list)
    // enter
    $('#pscSerial').on('keypress',function(k){
        if (k.which == 13) {
            pvcsAddTableData(partsinformationData)
        }
    })

    // add button 
    $('#pscAdd').on('click',function(){
        pvcsAddTableData(partsinformationData)
    })

    //disable enter event on form
    $('#psCreate').on('keypress',function(e){
        if (e.which === 13 && e.target.nodeName !== 'text' && e.target.type !== 'submit') {
            e.preventDefault();
        } 
    })

    //save serial
    $('#psCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {}

            //get data on bBTable
            data.data = $('#pscSerialTable').bootstrapTable('getData')
            data.id = id

            dTable.clear().rows.add(crudiAjax(data, "/parts/serial/create", "Post")).draw()
            $('#psCreate')[0].reset();
            //reset table
            $('#pscSerialTable').bootstrapTable('removeAll')

            $('#psCreateModal').modal('toggle'); // fix modal toggle method
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
    var inputs = ["#pscSuppliersPrice", "#pscRetailPrice", "#pscSerial"];
    var allFilled = true

    inputs.forEach(function(input){
        if ($(input).val() === '') {
          allFilled = false;
        }
    });

    if (allFilled){
        $('#pscSerialTable').bootstrapTable('append',{
            Brand: partsInfo.Brand,
            Model: partsInfo.Model,
            Description: partsInfo.Description,
            partinformation: id,
            Serial: $('#pscSerial').val(),
            SupplierPrice: $('#pscSuppliersPrice').val(),
            RetailPrice: $('#pscRetailPrice').val()
        })
        $('#pscSerial').val('') //reset value of serial
    }
}

function pvPopulateData(data){
    $('.pivName').text(data.Brand + ' ' + data.Model )
    $('#pivDescription').text(data.Description)
}