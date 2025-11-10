function initTihsExpensesModal(tihId) {
    // list all expenses
    ExpensesList(tihId);

    // add expenses
    $('#tiheSave').off('click').on('click', async function () {
        // identify if expenses and transaction id is existing
        if ( !$('#tiheExpensesId').val()) {
            // add new expenses
            var data = {}
            data.data = {
                ExpenseCode: $('#tiheCode').val(),
                ExpensesType: $('#tiheType').val(),
                Name: $('#tiheName').val(),
                Date: $('#tiheDate').val(),
                Amount: $('#tiheAmount').val(),
                Description: $('#tiheDescription').val(),
                Transaction: tihId
            };
            data.tihId = tihId;
    
            await crudiAjax(data, '/transaction/inhouse/expenses/add', 'POST');
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfully created expense data.")
            $(".toast").find(".toast-title").text("Expense Data Saved")
        } else {
            // update existing expenses
            var data = {}
            data.data = {
                ExpenseCode: $('#tiheCode').val(),
                ExpensesType: $('#tiheType').val(),
                Name: $('#tiheName').val(),
                Date: $('#tiheDate').val(),
                Amount: $('#tiheAmount').val(),
                Description: $('#tiheDescription').val(),
                Transaction: tihId,
            };
            data.tihId = tihId;
            data.expensesId = $('#tiheExpensesId').val();

            await crudiAjax(data, '/transaction/inhouse/expenses/update', 'PUT');
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfully updated the expense data.")
            $(".toast").find(".toast-title").text("Expense Data Updated")
        }
        // clear form
        clearTiheForm();
        //update expenses list
        ExpensesList(tihId);
    });

    // delete expenses
    $('#tiheDelete').off('click').on('click', async function () {
        // confirm delete
        if (confirm("Are you sure you want to delete this expense? This action cannot be undone.")) {
            var data = {}
            data.tihId = tihId;
            data.expensesId = $('#tiheExpensesId').val();
            await crudiAjax(data, '/transaction/inhouse/expenses/delete', 'DELETE');
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfully deleted the expense data.")
            $(".toast").find(".toast-title").text("Expense Data Deleted")

            // clear form
            clearTiheForm();

            // refresh expenses list
            ExpensesList(tihId);
        }
    });
}

async function ExpensesList(tihId) {
    // clear form
    clearTiheForm();

    // get data 
    var expensesList = await crudiAjax({ data: tihId }, "/transaction/inhouse/getData", "POST").Expense
    // initialize table
    await initBootstrapTable(
        "#tiheExpensesList",                                                                    // tableName
        ["Name", "ExpensesType", "Date", "Amount","Description","Status", "_id"],     // tableHead
        ["ExpensesType", "Date", "Amount","Description","Status" , "_id"],             // hiddenColumns (hide ID column)
        ["Name", "ExpensesType", "Date", "Amount","Description","Status", "_id"],     // dataField
        expensesList,                                                                           // tableData
        false,                                                                                  // withSearch (enable search)
    );

    // add click event listener for row clicks
    $("#tiheExpensesList").on('click-row.bs.table', function (e, row, $element) {
        // Remove selection from ALL rows first
        $("#tiheExpensesList tbody tr").removeClass('table-row-selected');
        $("#tiheExpensesList tbody tr td").removeAttr('style');
        $("#tiheExpensesList tbody tr").css('background-color', '').css('color', '');
        
        // Add selection to the clicked row only
        $element.addClass('table-row-selected');
        //clear expenses and transaction id hidden field
        $('#tiheExpensesId').val('');
        $('#tiheExpensesId').val(row._id);

        $('#tiheType').val(row.ExpensesType ? row.ExpensesType : '');
        $('#tiheName').val(row.Name ? row.Name : '');
        $('#tiheDate').val(row.Date ? moment(row.Date).format("YYYY-MM-DD") : '');
        $('#tiheAmount').val(row.Amount ? row.Amount : '');
        $('#tiheDescription').val(row.Description ? row.Description : '');

        // show delete button
        $('#tiheDelete').attr('hidden', false);
    });
}

function clearTiheForm() {
    $('#tiheExpensesId').val('');
    $('#tiheType').val('');
    $('#tiheName').val('');
    $('#tiheDate').val('');
    $('#tiheAmount').val('');
    $('#tiheDescription').val('');
    // hide delete button
    $('#tiheDelete').attr('hidden', true);
}