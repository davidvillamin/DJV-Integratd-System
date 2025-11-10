// tihs = transaction inhouse sales
async function initTihsServiceChargeEditModal(tihId) {
    // clear form
    clearTihscForm();

    // service charge list
    ServiceChargeList(tihId);

    // add service charge
    $('#tihscSave').off('click').on('click', async function() {
        if (!$('#tihscServiceId').val()) {
            // add new service charge
            var data = {};
            data.data = {
                Date: new Date($('#tihscServiceDate').val()),
                Name: $('#tihscServiceName').val(),
                Amount: parseFloat($('#tihscServiceAmount').val()),
                Description: $('#tihscServiceDescription').val(),
                Transaction: tihId
            };
            data.transactionId = tihId;

            await crudiAjax(data, '/transaction/inhouse/servicecharge/add', 'POST')

            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfully created service charge data.");
            $(".toast").find(".toast-title").text("Service Charge Data Saved");

            //clear form
            clearTihscForm();
            //update service charge list
            ServiceChargeList(tihId);
        } else {
            // update existing service charge
            var data = {};
            data.data = {
                Date: new Date($('#tihscServiceDate').val()),
                Name: $('#tihscServiceName').val(),
                Amount: parseFloat($('#tihscServiceAmount').val()),
                Description: $('#tihscServiceDescription').val(),
                Transaction: tihId
            };
            data.transactionId = tihId;
            data.serviceChargeId = $('#tihscServiceId').val();
            await crudiAjax(data, '/transaction/inhouse/servicecharge/update', 'PUT');

            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfully updated the service charge data.");
            $(".toast").find(".toast-title").text("Service Charge Data Updated");

            // clear form
            clearTihscForm();
            //update service charge list
            ServiceChargeList(tihId);
        }
    });

    // delete service charge
    $('#tihscDelete').off('click').on('click', async function () {
        // confirm delete
        if (confirm("Are you sure you want to delete this service charge? This action cannot be undone.")) {
            var data = {}
            data.transactionId = tihId;
            data.serviceChargeId = $('#tihscServiceId').val();
            await crudiAjax(data, '/transaction/inhouse/servicecharge/delete', 'DELETE');
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfully deleted the service charge data.");
            $(".toast").find(".toast-title").text("Service Charge Data Deleted");

            // clear form
            clearTihscForm();
            //update service charge list
            ServiceChargeList(tihId);
        }
    });
}

// populate service charge list
async function ServiceChargeList(tihId) {
    var serviceChargeList = await crudiAjax({ data: tihId }, "/transaction/inhouse/getData", "POST").ServiceCharge;
    // initialize table
    await initBootstrapTable(
        "#tihscServiceList",                                 // tableName
        ["Name", "Date", "Amount","Description", "_id"],     // tableHead
        ["Date", "Amount","Description", "_id"],             // hiddenColumns (hide ID column)
        ["Name", "Date", "Amount","Description", "_id"],     // dataField
        serviceChargeList,                                   // tableData
        false,                                               // withSearch (enable search)
    );

    // add click event listener for row clicks
    $("#tihscServiceList").on('click-row.bs.table', function (e, row, $element) {
        // Remove selection from ALL rows first
        $("#tihscServiceList tbody tr").removeClass('table-row-selected');
        $("#tihscServiceList tbody tr td").removeAttr('style');
        $("#tihscServiceList tbody tr").css('background-color', '').css('color', '');

        // Add selection to the clicked row only
        $element.addClass('table-row-selected');
        //clear expenses and transaction id hidden field
        $('#tihscServiceId').val('');
        $('#tihscServiceId').val(row._id);

        $('#tihscServiceName').val(row.Name ? row.Name : '');
        $('#tihscServiceDate').val(row.Date ? moment(row.Date).format("YYYY-MM-DD") : '');
        $('#tihscServiceAmount').val(row.Amount ? row.Amount : '');
        $('#tihscServiceDescription').val(row.Description ? row.Description : '');

        // show delete button
        $('#tihscDelete').attr('hidden', false);
    });
}

function clearTihscForm() {
    $('#tihscServiceId').val('');
    $('#tihscServiceName').val('');
    $('#tihscServiceDate').val('');
    $('#tihscServiceAmount').val('');
    $('#tihscServiceDescription').val('');
}
