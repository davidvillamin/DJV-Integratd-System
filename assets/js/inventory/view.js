var productId = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    loadingScreen();
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });
    ivPopulateData()

})

// iv = inventory view
async function ivPopulateData(){
    var data = await crudiAjax({id:productId},"/inventory/product/view/populate","POST")

    $('#ivProductName').text(data.Name)
    $('#ivProductCode').text(data.Code)
    $('#ivType').text(data.Type)
    $('#ivBrand').text(data.Brand)
    $('#ivModel').text(data.Model)
    $('#ivDescription').text(data.Description)
    $('#ivWithSerial').text(data.withSerial ? 'Yes' : 'No')
    $('#ivIdealPrice').text(data.idealPrice ? formatCurrency(data.idealPrice) : 'No Ideal Price set');

    // populate details 
    $('#dvNotes').text(data.Notes ? data.Notes : 'No Notes available');
    
    //set add supply modal
    // set modal target based on whether product uses serials or not
    var addTarget = data.withSerial ? '#isaWithSerialModal' : '#isaWithoutSerialModal';
    $('#ivAddSupply').attr('data-bs-target', addTarget).attr('data-target', addTarget);


    //set edit supply modal
    // set modal target based on whether product uses serials or not
    var editTarget = data.withSerial ? '#iseWithSerialModal' : '#iseWithoutSerialModal';
    $('#ivEditSupply').attr('data-bs-target', editTarget).attr('data-target', editTarget);
    
    // supply with serial number functions
    if (data.withSerial){
        addSupplyWithSerial(data.Code,productId)
        populateIvWithSerialSupplyTable(data.Supply)
    } else {
        addSupplyWithoutSerial(data.Code,productId)
        populateIvWithoutSerialSupplyTable(data.Supply)
    }

    // initialize product notes modal
    initializeProductNotesEdit(data.Notes, productId).then( function(){
        ivPopulateData()
    });

    // initialize image modal
    initImageEditModal(data.Images, productId).then( function(){
        ivPopulateData()
    });

    // populate image list
    if (data.Images.length === 0) {
        $('#ivImageList').html('<p class="text-muted">No images available.</p>');
    } else {
        // clear existing images
        $('#ivImageList').empty();
        data.Images.forEach(function(image) {
            $('#ivImageList').append('<img src="' + image.base64String + '" class="img-thumbnail" />');
        });
    }

    // initialize edit product modal
    initProductEditModal(data,productId).then( function(){
        ivPopulateData()
    });

    // for edit supply modal, populate serial numbers dropdown
    initEditSupplyModal(data.Supply).then( function(){
        ivPopulateData()
    });
}
// populate inventory view supply table
async function populateIvWithSerialSupplyTable(supplyData){
    // change data format for bootstrap table
    supplyData = supplyData.map(function(item){
        item.DateAcquired = moment(item.DateAcquired).format("MMM DD YYYY");
        return item;
    })
    await initBootstrapTable(
        "#ivSupplyTable",                                                             // tableName
        ["Date", "Serial", "Status", "id","Cost","Product", "ProductCode", ],         // tableHead
        ["id", "Cost", "Product", "ProductCode"],                                     // hiddenColumns (hide ID column)
        ["DateAcquired", "Serial", "Status", "id","Cost","Product", "ProductCode"],   // dataField
        supplyData,                                                                   // tableData
        true,                                                                         // withSearch (enable search)
    );

    // add click event listener for row clicks
    $("#ivSupplyTable").on('click-row.bs.table', function (e, row, $element) {
        // Remove selection from ALL rows first
        $("#ivSupplyTable tbody tr").removeClass('table-row-selected');
        $("#ivSupplyTable tbody tr td").removeAttr('style');
        $("#ivSupplyTable tbody tr").css('background-color', '').css('color', '');
        
        // Add selection to the clicked row only
        $element.addClass('table-row-selected');

        $('#ivSupplyId').val(row._id);
        $('#ivSupplierName').text(row.Supplier.Name ? row.Supplier.Name : 'No Supplier Name available');
        $('#ivSupplierAddress').text(row.Supplier.Address ? row.Supplier.Address : 'No Supplier Address available');
        $('#ivORNumber').text(row.Supplier.OR ? row.Supplier.OR : 'No OR Number available');
        $('#ivDate').text(row.Supplier.ORDate ? moment(row.Supplier.ORDate).format("MMM/DD/YYYY") : 'No Date available');
        $('#ivWarranty').text(row.Supplier.Warranty ? row.Supplier.Warranty : 'No Warranty available');
        $('#ivCost').text(formatCurrency(row.Cost) ? formatCurrency(row.Cost) : 'No Cost available');
        $('#ivNotes').text(row.Supplier.Notes ? row.Supplier.Notes : 'No Notes available');
        $('#ivSerialNumber').text(row.Serial);

        // unhide edit supply button
        $('#ivEditSupply').attr('hidden', false);
    });
}

async function populateIvWithoutSerialSupplyTable(supplyData){
    // change data format for bootstrap table
    supplyData = supplyData.map(function(item){
        item.DateAcquired = moment(item.DateAcquired).format("MMM DD YYYY");
        return item;
    })
    await initBootstrapTable(
        "#ivSupplyTable",                                                   // tableName
        ["Date", "Status", "id","Cost","Product", "ProductCode", ],         // tableHead
        ["id", "Cost", "Product", "ProductCode"],                           // hiddenColumns (hide ID column)
        ["DateAcquired", "Status", "id","Cost","Product", "ProductCode"],   // dataField
        supplyData,                                                         // tableData
        true,                                                               // withSearch (enable search)
    );
    // add click event listener for row clicks
    $("#ivSupplyTable").on('click-row.bs.table', function (e, row, $element) {
        // Remove selection from ALL rows first
        $("#ivSupplyTable tbody tr").removeClass('table-row-selected');
        $("#ivSupplyTable tbody tr td").removeAttr('style');
        $("#ivSupplyTable tbody tr").css('background-color', '').css('color', '');
        
        // Add selection to the clicked row only
        $element.addClass('table-row-selected');
        
        $('#ivSupplyId').val(row._id);
        $('#ivSupplierName').text(row.Supplier.Name ? row.Supplier.Name : 'No Supplier Name available');
        $('#ivSupplierAddress').text(row.Supplier.Address ? row.Supplier.Address : 'No Supplier Address available');
        $('#ivORNumber').text(row.Supplier.OR ? row.Supplier.OR : 'No OR Number available');
        $('#ivDate').text(row.Supplier.ORDate ? moment(row.Supplier.ORDate).format("MMM/DD/YYYY") : 'No Date available');
        $('#ivWarranty').text(row.Supplier.Warranty ? row.Supplier.Warranty : 'No Warranty available');
        $('#ivCost').text(formatCurrency(row.Cost) ? formatCurrency(row.Cost) : 'No Cost available');
        $('#ivNotes').text(row.Supplier.Notes ? row.Supplier.Notes : 'No Notes available');
        $('#ivSerialNumber').text("No Serial Available");

        // unhide edit supply button
        $('#ivEditSupply').attr('hidden', false);
    });
}

