function initializeAddParts(){
    // check if table existed
    if ($.fn.DataTable.isDataTable('#tihvbiisItemInformationTable')) {
        $('#tihvbiisItemInformationTable').DataTable().clear().destroy();
    }
    
    // populate all item information
    var iiTable = $('#tihvbiisItemInformationTable').DataTable( {
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
        data: crudiAjax({},"/transaction/inhouse/view/parts/add/partsInfromation/populate","post"),
        columns: [
            { data: '_id' },
            { data: 'Description' },
            { data: 'Brand' },
            { data: 'Model' }
        ]
    })

    $('#tihvbiisItemInformationTable tbody').on('click', 'tr',async function () {
        var rowData = iiTable.row(this).data();
        // add higlight effect on selected table
        // Remove 'selected' class from all rows
        $('#tihvbiisItemInformationTable tbody tr').removeClass('selected');
        // Add 'selected' class to the clicked row
        $(this).addClass('selected');

        // Open a modal using jQuery
        $('#tihvbiisAddModal').modal('show');
        $('#tihvbiiAddModal').modal('toggle'); // hide item information modal

        // check if table existed
        if ($.fn.DataTable.isDataTable('#tihvbiisSerialTable')) {
            $('#tihvbiisSerialTable').DataTable().clear().destroy();
        }
        // populate data of serial list
        $("#tihvbiisSerialTable").DataTable({
            pageLength: 5, // set to display 5 items
            lengthMenu: [5, 10, 25, 50, 100], // entries per page options
            data: await crudiAjax(rowData._id,"/transaction/inhouse/view/parts/add/partsInformation/serial/populate","post"),
            columns: [
                {data: "_id"},
                {data: "Serial"},
                {data: "Description"}
            ]
        })

        // populate item information on serial table
        $('#tihvbiisBrand').text(rowData.Brand)
        $('#tihvbiisModel').text(rowData.Model)
        $('#tihvbiisDescription').text(rowData.Description)

        // Add click event to select a row in the serial table
        $('#tihvbiisSerialTable tbody').on('click', 'tr', function () {
            // Remove 'selected' class from all rows
            $('#tihvbiisSerialTable tbody tr').removeClass('selected');
            // Add 'selected' class to the clicked row
            $(this).addClass('selected');
        });
    });
}   

// save serial to transaction
function addParts(id){
    return new Promise(function(resolve,reject){
        try {
            $('#tihvbiisAdd').on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var serialId = $('#tihvbiisSerialTable').DataTable().row('.selected').data();
                    
                    var data = {
                        Parts: serialId._id,
                        id: id
                    }
                
                    // // save to database
                    var crudiAjaxResult = await crudiAjax(data, '/transaction/inhouse/view/billing/parts/add', 'post')
                    // Clear the form
                    $('#tihvbiisAdd')[0].reset();
                    // close modal   
                    $('#tihvbiisAddModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is remove
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
                    $(".toast").find(".toast-title").text("Add transportation")
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}