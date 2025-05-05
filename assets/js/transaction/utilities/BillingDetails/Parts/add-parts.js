
// ii = Item itemInformation
// is = Item Serial
async function initializeAddParts(transId,iiTableName, isTableName,isForm,isModal,itemBrand, itemModel, itemDescription, iiModal, isModal){
    var iitableData = crudiAjax({},"/transaction/parts/add/partsInfromation/populate","post")
    initBootstrapTable(
        iiTableName, //table name
        ['Id', 'Description', 'Brand', 'Model'], //TableHead
        ['Id'], // hidden columns
        ['Id', 'Description', 'Brand', 'Model'], // datafield
        iitableData, // table data
        true // with search
    )

    $(iiTableName).on('click-row.bs.table', async function (e, row, $element, field) {
        // 'row' contains the data for the clicked row
        // Open a modal using jQuery
        $(isModal).modal('show'); // show item serial modal
        $(iiModal).modal('toggle'); // hide item information modal

        // =================================================
        // Populate Serial List Table
        // =================================================
        // populate item information on serial table
        $(itemBrand).text(row.Brand)
        $(itemModel).text(row.Model)
        $(itemDescription).text(row.Description)

        var isTableData = crudiAjax(row._id,"/transaction/parts/add/partsInformation/serial/populate","post")
        initBootstrapTable(
            isTableName, //table name
            ['Id', 'Serial', 'Description'], //TableHead
            ['Id'], // hidden columns
            ['Id', 'Serial', 'Description'], // datafield
            isTableData, // table data
            true // with search
        )

        // Add click event to select a row in the serial table
        $(isTableName +' tbody').on('click', 'tr', function () {
            // Remove 'selected' class from all rows
            $(isTableName +'tbody tr').removeClass('selected');
            // Add 'selected' class to the clicked row
            $(this).addClass('selected');
        });
    });
    return addParts(transId,isForm,isTableName,isModal)
}   

// save serial to transaction

function addParts(transId,isForm,isTableName,isModal){
    return new Promise(function(resolve,reject){
        try {
            $(isForm).on('submit',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var serialId = $(isTableName).DataTable().row('.selected').data().DT_RowId;
                    var data = {
                        Parts: serialId,
                        transId: transId
                    }
                    console.log(data)
                    // save to database
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(await crudiAjax(data, '/transaction/parts/add', 'post'))
                    $(".toast").find(".toast-title").text("Add transportation")
                    // Clear the form
                    $(isForm)[0].reset();
                    // close modal   
                    $(isModal).modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is remove
                    
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}