
function initializeAddSerial(){
    //initialize bDTable for add serial
    $('#iviiTable').bootstrapTable()

    //on enter or click on add (add serial on the list)
    // enter
    $('#ivcSerial').on('keypress',function(k){
        if (k.which == 13) {
            ivcsAddTableData(itemInformationData)
        }
    })

    // add button 
    $('#ivcAdd').on('click',function(){
        ivcsAddTableData(itemInformationData)
    })

    //disable enter event on form
    $('#ivCreate').on('keypress',function(e){
        if (e.which === 13 && e.target.nodeName !== 'text' && e.target.type !== 'submit') {
            e.preventDefault();
        } 
    })
}

function addSerial(){
    return new Promise(function(resolve, reject){
        try {
            $('#ivCreate :submit').on('click',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {}
        
                    //get data on bBTable
                    data.data = $('#ivcSerialTable').bootstrapTable('getData')
                    data.id = id
        
                    dTable.clear().rows.add(crudiAjax(data, "/inventory/serial/create", "Post")).draw()
                    $('#ivCreate')[0].reset();
                    //reset table
                    $('#ivcSerialTable').bootstrapTable('removeAll')
        
                    $('#ivCreateModal').modal('toggle'); // fix modal toggle method
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