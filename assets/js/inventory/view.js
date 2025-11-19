var productId = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    loadingScreen();
    //remove class collapsed after click on sidebar
    $("#sbinventory").removeClass("collapsed");
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });
    initialize()

    // add product
    inventoryProductCreate().then(function(){
        initialize();
        inventoryProductCreate()
    })
    // edit product modal
    inventoryProductEdit(productId).then( function(){
        initialize()
        inventoryProductEdit(productId)
    });
    // add supply
    inventorySupplyCreate(productId).then( function(){
        initialize()
        inventorySupplyCreate(productId)
    });
    // for edit supply the it will be run by initialize
    
    // initialize product notes modal
    inventoryNotes(productId).then( function(){
        initialize()
        inventoryNotes(productId)
    });

    // initialize image modal
    inventoryImage(productId).then( function(){
        initialize()
        inventoryImage(productId)
    });
})

// iv = inventory view
async function initialize(){
    var data = await crudiAjax({productId:productId},"/inventory/product/getOneData","POST")
    // if no prouduct name add no name available
    $('#ivpName').html(data.Name ? data.Name : '<p class="fst-italic mb-0">No Name available.</p>')
    $('#ivpCode').html(data.Code ? data.Code : '<p class="fst-italic mb-0">No Code available.</p>');
    $('#ivpType').html(data.Type ? data.Type : '<p class="fst-italic mb-0">No Type available.</p>');
    $('#ivpBrand').html(data.Brand ? data.Brand : '<p class="fst-italic mb-0">No Brand available.</p>');
    $('#ivpModel').html(data.Model ? data.Model : '<p class="fst-italic mb-0">No Model available.</p>');
    $('#ivpDescription').html(data.Description ? data.Description : '<p class="fst-italic mb-0">No Description available.</p>');
    $('#ivpWithSerial').html(data.withSerial ? 'Yes' : 'No')
    $('#ivpIdealPrice').html(data.idealPrice ? formatCurrency(data.idealPrice) : '<p class="fst-italic mb-0">No Ideal Price set.</p>');

    // populate details 
    $('#ivpNotes').html(data.Notes ? data.Notes : '<p class="fst-italic mb-0">No Notes available.</p>');
    
    //set add supply modal
    // set modal target based on whether product uses serials or not
    var addTarget = data.withSerial ? '#isaWithSerialModal' : '#isaWithoutSerialModal';
    $('#ivAddSupply').attr('data-bs-target', addTarget).attr('data-target', addTarget);


    //set edit supply modal
    // set modal target based on whether product uses serials or not
    var editTarget = data.withSerial ? '#iseWithSerialModal' : '#iseWithoutSerialModal';
    $('#ivEditSupply').attr('data-bs-target', editTarget).attr('data-target', editTarget);
    
    // populate supply table
    if (data.withSerial){
        populateIvWithSerialSupplyTable(data.Supply)
    } else {
        populateIvWithoutSerialSupplyTable(data.Supply)
    }

    // populate image list
    if (data.Images.length === 0) {
        $('#ivImageList').html('<p class="fst-italic mb-0">No images available.</p>');
    } else {
        // clear existing images
        $('#ivImageList').empty();
        data.Images.forEach(function(image) {
            $('#ivImageList').append('<img src="' + image.base64String + '" class="img-thumbnail img-fluid rounded mb-2" />');
        });
    }

    // add click event to edit supply
    $('#ivEditSupply').off('click').on('click', function() {
        var supplyId = $('#ivSupplyId').val();
        if (supplyId) {
            inventorySupplyEdit(supplyId).then(function() {
                initialize();
            });
        }
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
        ["Code" , "Date", "Serial", "Status", "id","Cost","Product", "ProductCode", ],         // tableHead
        ["id", "Cost", "Product", "ProductCode"],                                     // hiddenColumns (hide ID column)
        ["Code", "DateAcquired", "Serial", "Status", "id","Cost","Product", "ProductCode"],   // dataField
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
        ["Code" , "Date", "Status", "id","Cost","Product", "ProductCode", ],         // tableHead
        ["id", "Cost", "Product", "ProductCode"],                           // hiddenColumns (hide ID column)
        ["Code", "DateAcquired", "Status", "id","Cost","Product", "ProductCode"],   // dataField
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

