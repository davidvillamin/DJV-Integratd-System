var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(async function(){
     // initialize toast
     $(".toast").toast({
        delay: 5000
    });

    //population of data
    var deviceinformationData = await crudiAjax({id: id}, "/device/deviceinformation/view/populate", 'Post');
    dvPopulateData(deviceinformationData); // populate data

    // initialize datatable (for serial list on view)
    var dTable = $('#dViewTable').DataTable({
        data: crudiAjax(id, "/device/view/serial/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
    })

    //initialize bDTable for add serial
    $('#dcSerialTable').bootstrapTable()

    //on enter or click on add (add serial on the list)
    // enter
    $('#dcSerial').on('keypress',function(k){
        if (k.which == 13) {
            dvcsAddTableData(deviceinformationData)
        }
    })

    // add button 
    $('#dcAdd').on('click',function(){
        dvcsAddTableData(deviceinformationData)
    })

    //disable enter event on form
    $('#dCreate').on('keypress',function(e){
        if (e.which === 13 && e.target.nodeName !== 'text' && e.target.type !== 'submit') {
            e.preventDefault();
        } 
    })

    //save serial
    $('#dCreate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {}

            //get data on bBTable
            data.data = $('#dcSerialTable').bootstrapTable('getData')
            data.id = id

            dTable.clear().rows.add(crudiAjax(data, "/device/serial/create", "Post")).draw()
            $('#dCreate')[0].reset();
            //reset table
            $('#dcSerialTable').bootstrapTable('removeAll')

            $('#dCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly created a device information!")
            $(".toast").find(".toast-title").text("New device information")
        }
    })
})
//create serial (list )
function dcsAddTableData(partsInfo){
    // prevent empty data
    var inputs = ["#dcSuppliersPrice", "#dcRetailPrice", "#dcSerial"];
    var allFilled = true

    inputs.forEach(function(input){
        if ($(input).val() === '') {
          allFilled = false;
        }
    });

    if (allFilled){
        $('#dcSerialTable').bootstrapTable('append',{
            Brand: deviceInfo.Brand,
            Model: deviceInfo.Model,
            Description: deviceInfo.Description,
            deviceinformation: id,
            
        })
        $('#dcSerial').val('') //reset value of serial
    }
}

function dvPopulateData(data){
    $('.dvName').text(data.Brand + ' ' + data.Model )
    $('#dvDescription').text(data.Description)
}