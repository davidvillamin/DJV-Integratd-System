async function inhousePayment(inhouseId) {
    return new Promise(async function(resolve, reject) {
        try {
            // list all payments
            PaymentList(inhouseId);
        
            // add payments
            $('#tihpaySave').off('click').on('click', async function () {
                // identify if payments and transaction id is existing
                if ( !$('#tihpayId').val()) {
                    // add new payments
                    var data = {}
                    data.data = {
                        Name: $('#tihpayName').val(),
                        Date: $('#tihpayDate').val(),
                        Amount: $('#tihpayAmount').val(),
                        Description: $('#tihpayDescription').val(),
                        Transaction: inhouseId
                    };
                    data.inhouseId = inhouseId;
        
                    await crudiAjax(data, '/transaction/inhouse/payments/add', 'POST');
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text("You have successfully created payment data.")
                    $(".toast").find(".toast-title").text("Payment Data Saved")
                    // clear form
                    clearTihpayForm();
                    //update expenses list
                    PaymentList(inhouseId);
                    resolve();
                } else {
                    // update existing payments
                    var data = {}
                    data.data = {
                        Name: $('#tihpayName').val(),
                        Date: $('#tihpayDate').val(),
                        Amount: $('#tihpayAmount').val(),
                        Description: $('#tihpayDescription').val(),
                        Transaction: inhouseId,
                    };
                    data.inhouseId = inhouseId;
                    data.paymentId = $('#tihpayId').val();
        
                    await crudiAjax(data, '/transaction/inhouse/payments/update', 'PUT');
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text("You have successfully updated the payment data.")
                    $(".toast").find(".toast-title").text("Payment Data Updated")
                    // clear form
                    clearTihpayForm();
                    //update expenses list
                    PaymentList(inhouseId);
                    resolve();
                }
            });
        
            // delete expenses
            $('#tihpayDelete').off('click').on('click', async function () {
                // confirm delete
                if (confirm("Are you sure you want to delete this payment? This action cannot be undone.")) {
                    var data = {}
                    data.inhouseId = inhouseId;
                    data.paymentId = $('#tihpayId').val();
                    await crudiAjax(data, '/transaction/inhouse/payments/delete', 'DELETE');
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text("You have successfully deleted the payment data.")
                    $(".toast").find(".toast-title").text("Payment Data Deleted")
        
                    // clear form
                    clearTihpayForm();
                    // refresh payments list
                    PaymentList(inhouseId);
                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function PaymentList(inhouseId) {
    // clear form
    clearTihpayForm();

    // get data 
    var paymentList = await crudiAjax({ inhouseId: inhouseId }, "/transaction/inhouse/getOneData", "POST").Payment
    // initialize table
    await initBootstrapTable(
        "#tihPaymentsList",                                             // tableName
        ["Payment List", "Date", "Amount","Description", "_id"],        // tableHead
        ["Date", "Amount","Description", "_id"],                        // hiddenColumns (hide ID column)
        ["Name", "Date", "Amount","Description", "_id"],                // dataField
        paymentList,                                                    // tableData
        false,                                                          // withSearch (enable search)
    );

    // add click event listener for row clicks
    $("#tihPaymentsList").on('click-row.bs.table', function (e, row, $element) {
        // Remove selection from ALL rows first
        $("#tihPaymentsList tbody tr").removeClass('table-row-selected');
        $("#tihPaymentsList tbody tr td").removeAttr('style');
        $("#tihPaymentsList tbody tr").css('background-color', '').css('color', '');

        // Add selection to the clicked row only
        $element.addClass('table-row-selected');
        //clear expenses and transaction id hidden field
        $('#tihpayId').val('');
        $('#tihpayId').val(row._id);

        $('#tihpayName').val(row.Name ? row.Name : '');
        $('#tihpayDate').val(row.Date ? moment(row.Date).format("YYYY-MM-DD") : '');
        $('#tihpayAmount').val(row.Amount ? row.Amount : '');
        $('#tihpayDescription').val(row.Description ? row.Description : '');

        // show delete button
        $('#tihpayDelete').attr('hidden', false);
    });
}

function clearTihpayForm() {
    $('#tihpayId').val('');
    $('#tihpayName').val('');
    $('#tihpayDate').val('');
    $('#tihpayAmount').val('');
    $('#tihpayDescription').val('');
    // hide delete button
    $('#tihpayDelete').attr('hidden', true);
}