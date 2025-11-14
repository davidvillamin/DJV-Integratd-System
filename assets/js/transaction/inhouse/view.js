var inhouseId = window.location.href.split('/')[window.location.href.split('/').length - 1];

$(async function(){
    //======================================================
    // Loading Screen / toast / Quill
    //======================================================
    // hide loading screen
    loadingScreen();

    // collapse sidebar nav link and set active link
    $("#forms-nav-transaction").addClass("show");
    $("#sbinhouse").removeClass("collapsed");

    // initialize toast
    $(".toast").toast({
        delay: 5000
    });
    
    initialize(inhouseId);

    // image modal
    inhouseImage(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update image list
        inhouseImage(inhouseId);
    })

});

async function initialize(inhouseId) {
    var transactionData = await crudiAjax({inhouseId: inhouseId}, "/transaction/inhouse/getOneData", "POST");
    console.log(transactionData);
    // populate client fields
    $("#tihName").text(transactionData.Name); // transaction inhouse name
    $("#tihcName").text(transactionData.Client.FullName); // transaction inhouse client name
    $("#tihcEmail").text(transactionData.Client.Email);

    $("#tihcContactNumber").text('')
    if (transactionData.Client.ContactDetails.length > 0){
        if (transactionData.Client.ContactDetails.length === 1) {
            $("#tihcContactNumber").text(transactionData.Client.ContactDetails[0]);
            return;
        } else {
            transactionData.Client.ContactDetails.forEach(function(number){
                $("#tihcContactNumber").append(number + ", ");
            });
        }
    }

    $("#tihcAddress").text(transactionData.Client.Address.FullAddress);
    $("#tihcCreatedDate").text(moment(transactionData.CreatedAt).format("MMMM Do YYYY"));
    $("#tihcNotes").html(transactionData.Client.Notes ? transactionData.Client.Notes : '<p class="fst-italic mb-0">No notes available.</p>');

    // populate device fields
    $("#tihdName").text(transactionData.Device.Name);
    $("#tihdBrand").text(transactionData.Device.Brand);
    $("#tihdModel").text(transactionData.Device.Model);
    $("#tihdSerialNumber").text(transactionData.Device.Serial);
    $("#tihdCreatedDate").text(moment(transactionData.Device.CreatedDate).format("MMMM Do YYYY"));

    // transaction populate

    // destroy and reinitialize quill
    if (window.quillInstance) {
        window.quillInstance.disable();
        delete window.quillInstance;
    }

    // clean quill container and any toolbars
    $('#tihServiceReport').empty().removeClass().removeAttr('data-gramm data-gramm_editor data-enable-grammarly');
    $('#tihServiceReport').siblings('.ql-toolbar').remove();

    // initialize quill for service report
    window.quillInstance = new Quill('#tihServiceReport', {
        theme: 'snow',
    });
    // add contents on quill
    if (transactionData.ServiceReport) {
        window.quillInstance.setContents(transactionData.ServiceReport);
    }

    // populate image list
    $('#tihImageList').empty();
    if (transactionData.Images.length === 0) {
        $('#tihImageList').html('<p class="fst-italic mb-0">No images available.</p>');
    } else {
        // clear existing images
        transactionData.Images.forEach(function(image) {
            $('#tihImageList').append('<img src="' + image.base64String + '" class="img-thumbnail img-fluid rounded mb-2" />');
        });
    }

    // notes
    $('#tihNotes').html(transactionData.Notes ? transactionData.Notes : '<p class="fst-italic mb-0">No notes available.</p>');
    // documents
    // $('#tihDocuments').html('<p class="fst-italic mb-0">No documents available.</p>');
    $('#tihDocuments').html(transactionData.Documents ? transactionData.Documents : '<p class="fst-italic mb-0">No documents available.</p>');

    // initialize calendar
    var initialDates = [
        { // Client Created Date
            date: moment(transactionData.CreatedDate).format('YYYY-MM-DD'), 
            title: 'Transaction Created', 
            color: 'success'
        },
    ];

    $('#miniCalendar').miniCalendar({
        clickable: false, // Disable clicking on calendar dates
        showToday: true,
        initialDates: initialDates
    });

    // client edit
    editClient(transactionData.Client._id).then(function(){
        initialize(inhouseId); // re-initialize to update client info
        editClient(transactionData.Client._id)
    })

    // device edit
    editDevice(transactionData.Device._id).then(function(){
        initialize(inhouseId); // re-initialize to update device info
        editDevice(transactionData.Device._id)
    })

    // populate sales table
    // i need the salesReportTable to finish first before adding click event
    // await salesReportTable(transactionData);
    salesReportTable(transactionData).then(function(){
        // legend: tihs - transaction inhouse sales
        // product
        initTihsProductModal(inhouseId);
        // supply
        // add click event to supply add button 
        $('.tihAddSupply').on('click', async function () {
            // get the closest tr and get the productSupplyId data attribute using attr method
            var data = {
                productSupplyId: $(this).closest('tr').attr('data-productSupplyId'),
                productId: $(this).closest('tr').attr('data-productId')
            }
            initTihsSupplyEditModal(data);
        });
        // expenses
        initTihsExpensesModal(inhouseId);
        // payment
        initTihsPaymentModal(inhouseId);
        // service charge
        initTihsServiceChargeEditModal(inhouseId);
    })

    // compute total amount for overview
    var totalAmount = 0;
    // transactionData.Supplies.forEach(function(supply){
    //     totalAmount += supply.SRP;
    // });
    // transactionData.ServiceCharge.forEach(function(serviceCharge){
    //     totalAmount += serviceCharge.Amount;
    // });

    $("#tihoTotal").text(formatCurrency(totalAmount));


}

async function salesReportTable(transactionData) {
    return new Promise((resolve) => {
        var salesTable = $("#tihSalesTable tbody");
        salesTable.empty(); // clear table first
        var totalProducts = 0;
        var totalExpenses = 0;
        var totalPayments = 0;
        var totalServiceCharge = 0;

        if (transactionData.Product.length > 0) {
            // table section for products
            salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Product")));
            transactionData.Product.forEach(function(product) {
                var row = $("<tr data-productSupplyId='" + product._id + "' data-productId='" + product.Product._id + "'>");
                row.append($("<td>").text(product.Product.Code));
                row.append($("<td>").text(product.Product.Name));
                row.append($("<td>").html(' <div class="d-flex justify-content-around">\
                            ' + formatCurrency(0) + '\
                            <i class="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>\
                            <ul class="dropdown-menu">\
                                <li><button class="dropdown-item tihAddSupply" type="button" data-bs-target="#tihSupplyModal" data-bs-toggle="modal">Action</button></li>\
                                <li><a class="dropdown-item" data-bs-target="#tihDeleteModal" data-bs-toggle="modal">Delete</a></li>\
                                </ul>\
                                </div>'));
                                salesTable.append(row);
                                // add to total supplies
                                // totalSupplies += product.SRP;
                                // <li><a class="dropdown-item tihAddSupply" data-bs-target="#tihSupplyModal" data-bs-toggle="modal">Add Supply</a></li>\
            });
            // append total supplies in one column 1 total supplies and column 2 and 3 the total supplies amount
            var totalRow = $("<tr class='table-secondary'>");
            totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            totalRow.append($("<th>").text(formatCurrency(totalProducts)));
            salesTable.append(totalRow);
        } else {
            salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Product")));
            salesTable.append($("<tr>").append($("<td colspan='3' class='text-center'>").text("There are no data available.")));
            // add also the total row with 0 amount
            var totalRow = $("<tr class='table-secondary'>");
            totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            totalRow.append($("<th>").text(formatCurrency(totalProducts)));
            salesTable.append(totalRow);
        }

        // populate expenses table

        if (transactionData.Expense.length > 0) {
            salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Expenses")));
            transactionData.Expense.forEach(function(expense) {
                var row = $("<tr>");
                row.append($("<td>").text('EXPXXXXX'));
                row.append($("<td>").text(expense.Name));
                row.append($("<td>").text(formatCurrency(expense.Amount)));
                salesTable.append(row);
                // add total expenses
                totalExpenses += expense.Amount;
            });
            // append total expenses in one column 1 total expenses and column 2 and 3 the total expenses amount
            var totalRow = $("<tr class='table-secondary'>");
            totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            totalRow.append($("<th>").text(formatCurrency(totalExpenses)));
            salesTable.append(totalRow);
        } else {
            salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Expenses")));
            salesTable.append($("<tr>").append($("<td colspan='3' class='text-center'>").text("There are no data available.")));
            // add also the total row with 0 amount
            var totalRow = $("<tr class='table-secondary'>");
            totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            totalRow.append($("<th>").text(formatCurrency(totalExpenses)));
            salesTable.append(totalRow);
        }

        // populate payment table

        if (transactionData.Payment.length > 0) {
            salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Payments")));
            transactionData.Payment.forEach(function(payment) {
                var row = $("<tr>");
                row.append($("<td>").text('PAYXXXXX'));
                row.append($("<td>").text(payment.Name));
                row.append($("<td>").text(formatCurrency(payment.Amount)));
                salesTable.append(row);
                // add total expenses
                totalPayments += payment.Amount;
            });
            // append total expenses in one column 1 total expenses and column 2 and 3 the total expenses amount
            var totalRow = $("<tr class='table-secondary'>");
            totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            totalRow.append($("<th>").text(formatCurrency(totalPayments)));
            salesTable.append(totalRow);
        } else {
            salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Payments")));
            salesTable.append($("<tr>").append($("<td colspan='3' class='text-center'>").text("There are no data available.")));
            // add also the total row with 0 amount
            var totalRow = $("<tr class='table-secondary'>");
            totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            totalRow.append($("<th>").text(formatCurrency(totalPayments)));
            salesTable.append(totalRow);
        }

        // populate service charge table

        if (transactionData.ServiceCharge.length > 0) {
            salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Service Charges")));
            transactionData.ServiceCharge.forEach(function(serviceCharge) {
                var row = $("<tr>");
                row.append($("<td>").text('SRVXXXXX'));
                row.append($("<td>").text(serviceCharge.Name));
                row.append($("<td>").text(formatCurrency(serviceCharge.Amount)));
                salesTable.append(row);
                // add total service charge
                totalServiceCharge += serviceCharge.Amount;
            });
            // append total service charges in one column 1 total service charges and column 2 and 3 the total service charges amount
            var totalRow = $("<tr class='table-secondary'>");
            totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            totalRow.append($("<th>").text(formatCurrency(totalServiceCharge)));
            salesTable.append(totalRow);
        } else {
            salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Service Charges")));
            salesTable.append($("<tr>").append($("<td colspan='3' class='text-center'>").text("There are no data available.")));
            // add also the total row with 0 amount
            var totalRow = $("<tr class='table-secondary'>");
            totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            totalRow.append($("<th>").text(formatCurrency(totalServiceCharge)));
            salesTable.append(totalRow);
        }
        
        // Resolve the promise after all DOM operations are complete
        resolve();
    });
}
