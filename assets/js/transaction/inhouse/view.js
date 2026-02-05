var inhouseId = window.location.href.split('/')[window.location.href.split('/').length - 1];
var userRole = document.getElementById('userRole').innerText.split(': ')[1];

// for total computation of sales report
var totalProducts = 0;
var totalExpenses = 0;
var totalPayments = 0;
var totalServiceCharge = 0;

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
    });

    // notes modal
    inhouseNotes(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update notes
        inhouseNotes(inhouseId);
    });

    // pre-assessment modal
    inhousePreAssessment(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update pre-assessment notes
        inhousePreAssessment(inhouseId);
    });
    // product
    addInhouseProduct(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update products
        addInhouseProduct(inhouseId);
    });

    // expenses
    inhouseExpenses(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update expenses
        inhouseExpenses(inhouseId);
    });
    // payment
    inhousePayment(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update payments
        inhousePayment(inhouseId);  
    });
    // service charge
    inhouseServiceCharge(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update service charges
        inhouseServiceCharge(inhouseId);
    });

    // service report
    $('#tihSaveServiceReport').off('click').on('click', async function(){
        var serviceReportData = {
            inhouseId: inhouseId,
            serviceReportContent: window.quillInstance.getContents()
        };
        var response = await crudiAjax(serviceReportData, '/transaction/inhouse/serviceReport/update', 'PUT');
        // toast notification
        $(".toast").toast("show").find(".toast-body").text(response)
        $(".toast").find(".toast-title").text("Supply Added")
        initialize(inhouseId);
    });

    // quotation
    inhouseQuotation().then(function(){ 
        initialize(inhouseId); // re-initialize to update quotation
        inhouseQuotation();
    })

    // approval
    inhouseApproval(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update approval
        inhouseApproval(inhouseId);
    })

    // repaired
    inhouseRepaired(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update repaired
        inhouseRepaired(inhouseId);
    });

    //Released
    inhouseReleased(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update released
        inhouseReleased(inhouseId);
    });

    //complete
    inhouseComplete(inhouseId).then(function(){
        initialize(inhouseId); // re-initialize to update complete
        inhouseComplete(inhouseId);
    });
});

async function initialize(inhouseId) {
    var transactionData = await crudiAjax({inhouseId: inhouseId}, "/transaction/inhouse/getOneData", "POST");

    //======================================================================================================
    // client Details
    //======================================================================================================
    $(".tihName").text(transactionData.Name); 
    $("#tihcName").text(transactionData.Client.FullName);
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

    // client edit
    editClient(transactionData.Client._id).then(function(){
        initialize(inhouseId); // re-initialize to update client info
        editClient(transactionData.Client._id)
    })

    //======================================================================================================
    // device Details
    //======================================================================================================
    $("#tihdName").text(transactionData.Device.Name);
    $("#tihdBrand").text(transactionData.Device.Brand);
    $("#tihdModel").text(transactionData.Device.Model);
    $("#tihdSerialNumber").text(transactionData.Device.Serial);
    $("#tihdCreatedDate").text(moment(transactionData.Device.CreatedDate).format("MMMM Do YYYY"));

    // device edit
    editDevice(transactionData.Device._id).then(function(){
        initialize(inhouseId); // re-initialize to update device info
        editDevice(transactionData.Device._id)
    })

    //======================================================================================================
    // transaction Details
    //======================================================================================================

    // progress bar update
    if (transactionData.statPending) { // pending
        $('#tihPending').removeClass('d-none');
    }
    if (transactionData.statQuotation) { // quotation
        $('#tihQuotation').removeClass('d-none');
    }
    if (transactionData.statApproved) { // approved
        $('#tihApproved').removeClass('d-none');
    }
    if (transactionData.statRepaired) { // repaired
        $('#tihRepaired').removeClass('d-none');
    }
    if (transactionData.statReleased) { // released
        $('#tihReleased').removeClass('d-none');
    }
    if (transactionData.statComplete) { // complete
        $('#tihComplete').removeClass('d-none');
    }

    // quill initialization
    //======================================================================================================
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
    //======================================================================================================

    // image list
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
    $('#tihdQuotation').empty();
    // check if quotation document exists
    if (transactionData.DocumentImages && transactionData.DocumentImages.Quotation !== undefined) {
        $('#tihdQuotation').append('<img src="' + transactionData.DocumentImages.Quotation.base64String + '" class="img-thumbnail img-fluid rounded mb-2" />');
    } else {
        $('#tihdQuotation').html('<p class="fst-italic mb-0">No documents available.</p>');
    }
    $('#tihdApproval').empty();
    if (transactionData.DocumentImages && transactionData.DocumentImages.Approval !== undefined) {
        $('#tihdApproval').append('<img src="' + transactionData.DocumentImages.Approval.base64String + '" class="img-thumbnail img-fluid rounded mb-2" />');
    } else {
        $('#tihdApproval').html('<p class="fst-italic mb-0">No documents available.</p>');
    }

    // pre-assessment notes
    $('#tihPreAssessmentNotes').html(transactionData.PreAssessmentNotes ? transactionData.PreAssessmentNotes : '<p class="fst-italic mb-0">No pre-assessment available.</p>');

    // quill initialization
    //======================================================================================================
    // initialize calendar
    var initialDates = [
        { // Client Created Date
            date: moment(transactionData.CreatedDate).format('YYYY-MM-DD'), 
            title: 'Transaction Created', 
            color: 'success'
        }
    ];

    // Add conditional dates only if they are defined
    if (transactionData.statQuotationDate) {
        initialDates.push({
            date: moment(transactionData.statQuotationDate).format('YYYY-MM-DD'), 
            title: 'Quotation', 
            color: 'success'
        });
    }
    
    if (transactionData.statApprovedDate) {
        initialDates.push({
            date: moment(transactionData.statApprovedDate).format('YYYY-MM-DD'), 
            title: 'Approved',
            color: 'success'
        });
    }
    
    if (transactionData.statRepairedDate) {
        initialDates.push({
            date: moment(transactionData.statRepairedDate).format('YYYY-MM-DD'),
            title: 'Repaired',
            color: 'success'
        });
    }
    
    if (transactionData.statReleasedDate) {
        initialDates.push({
            date: moment(transactionData.statReleasedDate).format('YYYY-MM-DD'),
            title: 'Released',
            color: 'success'
        });
    }
    
    if (transactionData.statCompletedDate) {
        initialDates.push({
            date: moment(transactionData.statCompletedDate).format('YYYY-MM-DD'),
            title: 'Completed',
            color: 'success'
        });
    }

    $('#miniCalendar').miniCalendar({
        clickable: false, // Disable clicking on calendar dates
        showToday: true,
        initialDates: initialDates
    });
    //======================================================================================================
    
    // Sales Table
    //======================================================================================================
    // populate sales table
    await salesReportTable(inhouseId).then(function(){
        // supply add
        // add click event to supply add button 
        $('.tihAddSupply').off('click').on('click', async function () {
            var addSupplyData = {
                productSupplyId: $(this).closest('tr').attr('data-productSupplyId'),
                productId: $(this).closest('tr').attr('data-productId'),
                inhouseId: inhouseId
            }
            inhouseSupply(addSupplyData).then(function(){
                initialize(inhouseId); // re-initialize to update supplies
            });
        });

        // product delete
        $('.tihDeleteProduct').off('click').on('click', async function () {
            var deleteProductData = {
                productId: $(this).closest('tr').attr('data-productSupplyId'),
                inhouseId: inhouseId
            } 
            if (confirm("Are you sure you want to delete this product from the transaction?")) {
                await crudiAjax(deleteProductData, '/transaction/inhouse/product/delete', 'DELETE');
                // re-initialize to update products
                initialize(inhouseId);
            }
        });

        // toggle supply details
        $('.toggle-supply-details').off('click').on('click', function () {
            var $icon = $(this);
            var $supplyRow = $icon.closest('tr').next('.supply-details');
            
            if ($supplyRow.is(':visible')) {
                $supplyRow.hide();
                $icon.removeClass('bi-chevron-up').addClass('bi-chevron-down');
            } else {
                $supplyRow.show();
                $icon.removeClass('bi-chevron-down').addClass('bi-chevron-up');
            }
        });
    });
    $("#tihoTotal").text(formatCurrency(totalProducts + totalServiceCharge)); // total amount due
    $("#tihoPayment").text(formatCurrency(totalPayments)); // total payment
    $("#tihoBalance").text(formatCurrency((totalProducts + totalServiceCharge) - totalPayments)); // balance amount due
}

async function salesReportTable(inhouseId) {
    return new Promise(async function(resolve) {
        var transactionData = await crudiAjax({inhouseId: inhouseId}, "/transaction/inhouse/getOneData", "POST");
        var salesTable = $("#tihSalesTable tbody");
        salesTable.empty(); // clear table first
        // reset totals
        totalProducts = 0;
        totalExpenses = 0;
        totalPayments = 0;
        totalServiceCharge = 0;

        if (transactionData.Product.length > 0) {
            // table section for products
            if (userRole !== 'tech') {
                salesTable.append($("<tr>").append($("<th colspan='4' class='table-primary'>").text("Product")));
            } else {
                salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Product")));
            }
            transactionData.Product.forEach(function(product) {
                var row = $("<tr data-productSupplyId='" + product._id + "' data-productId='" + product.Product._id + "'>");
                row.append($("<td>").text(product.Product.Code));
                row.append($("<td>").text(product.Product.Name));
                
                if (product.Supply){
                    // with supply - add expand/collapse icon
                    row.append($("<td>").html('<i class="bi bi-chevron-down toggle-supply-details me-2" style="cursor: pointer;"></i>Available'));
                    row.append($("<td>").html(' <div class="d-flex justify-content-around">\
                    ' + formatCurrency(product.Supply.SRP) + '\
                    <i class="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>\
                    <ul class="dropdown-menu">\
                        <li><button class="dropdown-item tihAddSupply" type="button" data-bs-target="#tihSupplyModal" data-bs-toggle="modal">Supply</button></li>\
                        <li><a class="dropdown-item tihDeleteProduct">Delete</a></li>\
                        </ul>\
                        </div>'));
                    salesTable.append(row);
                    
                    // add supply details row (initially hidden)
                    var supplyRow = $("<tr class='supply-details table-info' style='display: none;'>");
                    supplyRow.append($("<td>").html('<div class="ps-4">Code: ' + product.Supply.Code + '</div>'));
                    supplyRow.append($("<td>").html('<div class="ps-4">Serial: ' + (product.Supply.Serial ? product.Supply.Serial : "No Serial") + '</div>'));
                    supplyRow.append($("<td>").html('<div class="ps-4">Status: ' + product.Supply.Status + '</div>'));
                    supplyRow.append($("<td>").text(""));
                    salesTable.append(supplyRow);
                    
                    // add total for this product with supply
                    totalProducts += product.Supply.SRP;
                } else {
                    // without supply
                    row.append($("<td>").text("Unavailable"));
                    row.append($("<td>").html(' <div class="d-flex justify-content-around">\
                        ' + formatCurrency(0) + '\
                        <i class="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>\
                        <ul class="dropdown-menu">\
                            <li><button class="dropdown-item tihAddSupply" type="button" data-bs-target="#tihSupplyModal" data-bs-toggle="modal">Supply</button></li>\
                            <li><a class="dropdown-item tihDeleteProduct">Delete</a></li>\
                            </ul>\
                            </div>'));
                    salesTable.append(row);
                }
            });
            // append total supplies in one column 1 total supplies and column 2 and 3 the total supplies amount
            var totalRow = $("<tr class='table-secondary'>");
            if (userRole !== 'tech') {
                totalRow.append($("<th colspan='3' class='text-end'>").text("Total"));
            } else {
                totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            }
            totalRow.append($("<th>").text(formatCurrency(totalProducts)));
            salesTable.append(totalRow);
        } else {
            if (userRole !== 'tech') {
                salesTable.append($("<tr>").append($("<th colspan='4' class='table-primary'>").text("Product")));
                salesTable.append($("<tr>").append($("<td colspan='4' class='text-center'>").text("There are no data available.")));
            } else {
                salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Product")));
                salesTable.append($("<tr>").append($("<td colspan='3' class='text-center'>").text("There are no data available.")));
            }
            // add also the total row with 0 amount
            var totalRow = $("<tr class='table-secondary'>");
            if (userRole !== 'tech') {
                totalRow.append($("<th colspan='3' class='text-end'>").text("Total"));
            } else {
                totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            }
            totalRow.append($("<th>").text(formatCurrency(totalProducts)));
            salesTable.append(totalRow);
        }

        // populate expenses table

        if (transactionData.Expense.length > 0) {
            if (userRole !== 'tech') {
                salesTable.append($("<tr>").append($("<th colspan='4' class='table-primary'>").text("Expenses")));
            } else {
                salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Expenses")));
            }
            transactionData.Expense.forEach(function(expense) {
                var row = $("<tr>");
                row.append($("<td>").text('EXPXXXXX'));
                row.append($("<td>").text(expense.Name));
                if (userRole !== 'tech') {
                    row.append($("<td>").text("")); // empty status column for expenses
                }
                row.append($("<td>").text(formatCurrency(expense.Amount)));
                salesTable.append(row);
                // add total expenses
                totalExpenses += expense.Amount;
            });
            // append total expenses in one column 1 total expenses and column 2 and 3 the total expenses amount
            var totalRow = $("<tr class='table-secondary'>");
            if (userRole !== 'tech') {
                totalRow.append($("<th colspan='3' class='text-end'>").text("Total"));
            } else {
                totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            }
            totalRow.append($("<th>").text(formatCurrency(totalExpenses)));
            salesTable.append(totalRow);
        } else {
            if (userRole !== 'tech') {
                salesTable.append($("<tr>").append($("<th colspan='4' class='table-primary'>").text("Expenses")));
            } else {
                salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Expenses")));
            }
            salesTable.append($("<tr>").append($("<td colspan='3' class='text-center'>").text("There are no data available.")));
            // add also the total row with 0 amount
            var totalRow = $("<tr class='table-secondary'>");
            if (userRole !== 'tech') {
                totalRow.append($("<th colspan='3' class='text-end'>").text("Total"));
            } else {
                totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            }
            totalRow.append($("<th>").text(formatCurrency(totalExpenses)));
            salesTable.append(totalRow);
        }

        // populate payment table

        if (transactionData.Payment.length > 0) {
            if (userRole !== 'tech') {
                salesTable.append($("<tr>").append($("<th colspan='4' class='table-primary'>").text("Payments")));
            } else {
                salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Payments")));
            }
            transactionData.Payment.forEach(function(payment) {
                var row = $("<tr>");
                row.append($("<td>").text('PAYXXXXX'));
                row.append($("<td>").text(payment.Name));
                if (userRole !== 'tech') {
                    row.append($("<td>").text("")); // empty status column for payments
                }
                row.append($("<td>").text(formatCurrency(payment.Amount)));
                salesTable.append(row);
                // add total expenses
                totalPayments += payment.Amount;
            });
            // append total expenses in one column 1 total expenses and column 2 and 3 the total expenses amount
            var totalRow = $("<tr class='table-secondary'>");
            if (userRole !== 'tech') {
                totalRow.append($("<th colspan='3' class='text-end'>").text("Total"));
            } else {
                totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            }
            totalRow.append($("<th>").text(formatCurrency(totalPayments)));
            salesTable.append(totalRow);
        } else {
            if (userRole !== 'tech') {
                salesTable.append($("<tr>").append($("<th colspan='4' class='table-primary'>").text("Payments")));
            } else {
                salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Payments")));
            }
            salesTable.append($("<tr>").append($("<td colspan='3' class='text-center'>").text("There are no data available.")));
            // add also the total row with 0 amount
            var totalRow = $("<tr class='table-secondary'>");
            if (userRole !== 'tech') {
                totalRow.append($("<th colspan='3' class='text-end'>").text("Total"));
            } else {
                totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            }
            totalRow.append($("<th>").text(formatCurrency(totalPayments)));
            salesTable.append(totalRow);
        }

        // populate service charge table

        if (transactionData.ServiceCharge.length > 0) {
            if (userRole !== 'tech') {
                salesTable.append($("<tr>").append($("<th colspan='4' class='table-primary'>").text("Service Charges")));
            } else {
                salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Service Charges")));
            }
            transactionData.ServiceCharge.forEach(function(serviceCharge) {
                var row = $("<tr>");
                row.append($("<td>").text('SRVXXXXX'));
                row.append($("<td>").text(serviceCharge.Name));
                if (userRole !== 'tech') {
                    row.append($("<td>").text("")); // empty status column for service charges
                }
                row.append($("<td>").text(formatCurrency(serviceCharge.Amount)));
                salesTable.append(row);
                // add total service charge
                totalServiceCharge += serviceCharge.Amount;
            });
            // append total service charges in one column 1 total service charges and column 2 and 3 the total service charges amount
            var totalRow = $("<tr class='table-secondary'>");
            if (userRole !== 'tech') {
                totalRow.append($("<th colspan='3' class='text-end'>").text("Total"));
            } else {
                totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            }
            totalRow.append($("<th>").text(formatCurrency(totalServiceCharge)));
            salesTable.append(totalRow);
        } else {
            if (userRole !== 'tech') {
                salesTable.append($("<tr>").append($("<th colspan='4' class='table-primary'>").text("Service Charges")));
            } else {
                salesTable.append($("<tr>").append($("<th colspan='3' class='table-primary'>").text("Service Charges")));
            }
            salesTable.append($("<tr>").append($("<td colspan='3' class='text-center'>").text("There are no data available.")));
            // add also the total row with 0 amount
            var totalRow = $("<tr class='table-secondary'>");
            if (userRole !== 'tech') {
                totalRow.append($("<th colspan='3' class='text-end'>").text("Total"));
            } else {
                totalRow.append($("<th colspan='2' class='text-end'>").text("Total"));
            }
            totalRow.append($("<th>").text(formatCurrency(totalServiceCharge)));
            salesTable.append(totalRow);
        }
        
        resolve();
    });
}
