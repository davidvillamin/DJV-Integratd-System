var productId = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(function(){
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
    ivPopulateData()

})

// iv = inventory view
async function ivPopulateData(){
    var data = crudiAjax({id:productId},"/inventory/product/view/populate","POST")
    console.log(data)
    $('#ivProductName').text(data.Name)
    $('#ivProductCode').text(data.Code)
    $('#ivType').text(data.Type)
    $('#ivBrand').text(data.Brand)
    $('#ivModel').text(data.Model)
    $('#ivDescription').text(data.Description)
    $('#ivWithSerial').text(data.withSerial ? 'Yes' : 'No')
    
    //set add supply modal
    // set modal target based on whether product uses serials or not
    var target = data.withSerial ? '#isaWithSerialModal' : '#isaWithoutSerialModal';
    $('#ivAddSupply').attr('data-bs-target', target).attr('data-target', target);
    
    // supply with serial number functions
    if (data.withSerial){
        addSupplyWithSerial(data.Code,productId)
        populateIvWithSerialSupplyTable(data.Supply)
    } else {
        addSupplyWithoutSerial(data.Code,productId)
        populateIvWithoutSerialSupplyTable(data.Supply)
    }

}
    
// populate inventory view supply table
function populateIvWithSerialSupplyTable(supplyData){
    // Apply hover and cursor styles directly to table rows
    $('#ivSupplyTable tbody tr').css({
        'cursor': 'pointer'
    });

    // Add hover event handlers for dynamic styling
    $('#ivSupplyTable').on('mouseenter', 'tbody tr', function() {
        if (!$(this).hasClass('table-selected')) {
            $(this).css('background-color', '#f8f9fa');
        }
    }).on('mouseleave', 'tbody tr', function() {
        if (!$(this).hasClass('table-selected')) {
            $(this).css('background-color', '');
        }
    });

    // delegated click handler so it works for rows added later
    $('#ivSupplyTable').on('click', 'tbody tr', function () {
        // toggle selection (single-select)
        $(this).addClass('table-selected').siblings().removeClass('table-selected');
        
        // Apply selected styling
        $(this).css('background-color', '#e9f5ff');
        $(this).siblings().css('background-color', '');
        // populate supply details panel
        $('#ivSupplierName').text($(this).data('suppliername') || 'No Supplier Name available');
        $('#ivSupplierAddress').text($(this).data('supplieraddress') || 'No Supplier Address available');
        $('#ivORNumber').text($(this).data('supplieror') || 'No OR Number available');
        $('#ivDate').text($(this).data('supplierordate') ? moment($(this).data('supplierordate')).format("MMM/DD/YYYY") : 'No Date available');
        $('#ivWarranty').text($(this).data('supplierwarranty') || 'No Warranty available');
        $('#ivCost').text(formatCurrency($(this).data('cost')) || 'No Cost available');
        $('#ivNotes').text($(this).data('notes') || 'No Notes available');

        $('#ivSerialNumber').text($(this).data('serial') || 'No Serial available');
    });

    var table = $('#ivSupplyTable');
    table.append("<thead>\
            <tr>\
                <th>Purchased Date</th>\
                <th>Serial Number</th>\
                <th>Status</th>\
            </tr>\
        </thead><tbody></tbody>");
    if (supplyData.length === 0){
        table.find("tbody").append("<tr><td colspan='3' class='text-center'>No Data Available</td></tr>");
    } else {
        supplyData.forEach(function(item){
            var row = "<tr \
                data-serial='"+item.Serial+"' \
                data-acquired-date='"+moment(item.DateAcquired).format("MMM/DD/YYYY")+"'\
                data-supplierName='"+item.Supplier.Name+"' \
                data-supplierAddress='"+item.Supplier.Address+"'\
                data-supplierOR='"+item.Supplier.OR+"'\
                data-supplierORDate='"+item.Supplier.ORDate+"'\
                data-supplierWarranty='"+item.Supplier.Warranty+"'\
                data-supplierNotes='"+item.Supplier.Notes+"'\
                data-cost='"+item.Cost+"'\
                data-status='"+item.Status+"'>\
                <td>"+moment(item.DateAcquired).format("MMM/DD/YYYY")+"</td>\
                <td>"+item.Serial+"</td>\
                <td>"+item.Status+"</td>\
            </tr>";
            table.find("tbody").append(row);
        });
    }
}

function populateIvWithoutSerialSupplyTable(supplyData){
    // Apply hover and cursor styles directly to table rows
    $('#ivSupplyTable tbody tr').css({
        'cursor': 'pointer'
    });

    // Add hover event handlers for dynamic styling
    $('#ivSupplyTable').on('mouseenter', 'tbody tr', function() {
        if (!$(this).hasClass('table-selected')) {
            $(this).css('background-color', '#f8f9fa');
        }
    }).on('mouseleave', 'tbody tr', function() {
        if (!$(this).hasClass('table-selected')) {
            $(this).css('background-color', '');
        }
    });

    // delegated click handler so it works for rows added later
    $('#ivSupplyTable').on('click', 'tbody tr', function () {
        // toggle selection (single-select)
        $(this).addClass('table-selected').siblings().removeClass('table-selected');
        
        // Apply selected styling
        $(this).css('background-color', '#e9f5ff');
        $(this).siblings().css('background-color', '');
        // populate supply details panel
        $('#ivSupplierName').text($(this).data('suppliername') || 'No Supplier Name available');
        $('#ivSupplierAddress').text($(this).data('supplieraddress') || 'No Supplier Address available');
        $('#ivORNumber').text($(this).data('supplieror') || 'No OR Number available');
        $('#ivDate').text($(this).data('supplierordate') ? moment($(this).data('supplierordate')).format("MMM/DD/YYYY") : 'No Date available');
        $('#ivWarranty').text($(this).data('supplierwarranty') || 'No Warranty available');
        $('#ivCost').text(formatCurrency($(this).data('cost')) || 'No Cost available');
        $('#ivNotes').text($(this).data('notes') || 'No Notes available');

        $('#ivSerialNumber').text('No Serial available');
    });



    var table = $('#ivSupplyTable');
    table.append("<thead>\
            <tr>\
                <th>Purchased Date</th>\
                <th>Status</th>\
            </tr>\
        </thead><tbody></tbody>");
    if (supplyData.length === 0){
        table.find("tbody").append("<tr><td colspan='2' class='text-center'>No Data Available</td></tr>");
    } else {
        supplyData.forEach(function(item){
            var row = "<tr\
                data-serial='"+item.Serial+"' \
                data-acquired-date='"+moment(item.DateAcquired).format("MMM/DD/YYYY")+"'\
                data-supplierName='"+item.Supplier.Name+"' \
                data-supplierAddress='"+item.Supplier.Address+"'\
                data-supplierOR='"+item.Supplier.OR+"'\
                data-supplierORDate='"+item.Supplier.ORDate+"'\
                data-supplierWarranty='"+item.Supplier.Warranty+"'\
                data-supplierNotes='"+item.Supplier.Notes+"'\
                data-cost='"+item.Cost+"'\
                data-status='"+item.Status+"'>\
                <td>"+moment(item.DateAcquired).format("MMM/DD/YYYY")+"</td>\
                <td>"+item.Status+"</td>\
            </tr>";
            table.find("tbody").append(row);
        });
    }
}

