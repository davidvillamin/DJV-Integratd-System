
function initializeAddSerial(itemInformationData,id){
    //initialize bDTable for add serial
    $('#iiisTable').bootstrapTable()

    //on enter or click on add (add serial on the list)
    // enter
    $('#iiisSerial').on('keypress',function(k){
        if (k.which == 13) {
            iiisAddTableData(itemInformationData,id)
        }
    })

    // add button 
    $('#iiisAdd').on('click',function(){
        iiisAddTableData(itemInformationData,id)
    })

    //disable enter event on form
    $('#iiisCreate').on('keypress',function(e){
        if (e.which === 13 && e.target.nodeName !== 'text' && e.target.type !== 'submit') {
            e.preventDefault();
        } 
    })
}

function addSerial(dTable){
    return new Promise(function(resolve, reject){
        try {
            $('#iiisCreate :submit').on('click',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
        
                    // Get data on bDTable including hidden rows
                    data.data = $('#iiisTable').bootstrapTable('getData', { includeHiddenRows: true }); 
                    data.id = id
        
                    dTable.clear().rows.add(crudiAjax(data, "/inventory/serial/create", "Post")).draw()
                    $('#iiisCreate')[0].reset();
                    //reset table
                    $('#iiisTable').bootstrapTable('removeAll')
        
                    $('#iiisCreateModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text("You have successfuly created a parts information!")
                    $(".toast").find(".toast-title").text("New parts information")
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

//create serial (list )
function iiisAddTableData(partsInfo,id){
    // prevent empty data
    var inputs = ["#iiisSuppliersPrice", "#iiisRetailPrice", "#iiisSerial"];
    var allFilled = true

    inputs.forEach(function(input){
        if ($(input).val() === '') {
          allFilled = false;
        }
    });

    if (allFilled){
        $('#iiisTable').bootstrapTable('append',{
            Brand: partsInfo.Brand,
            Model: partsInfo.Model,
            Description: partsInfo.Description,
            ItemInformation: id,
            Serial: $('#iiisSerial').val(),
            SupplierPrice: $('#iiisSuppliersPrice').val(),
            RetailPrice: $('#iiisRetailPrice').val()
        })
        $('#iiisSerial').val('') //reset value of serial
    }
}