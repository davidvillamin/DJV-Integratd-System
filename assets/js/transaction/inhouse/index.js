$(function(){
    // collapse sidebar nav link and set active link
    $("#sbTransaction").addClass("active");
    $("#sbTransactionSub").addClass("in");
    $("#sbTransactionSubInhouse").addClass("active");
    
    // initialize toast
    loadToastr();

    initialize();
    // create client
    createClient().then(function(){
        initialize();
    });

    // create transaction
    createTransaction().then(function(){
        initialize();
    });
})

async function initialize(){
        // get data
    var tableData = await crudiAjax({}, "/transaction/inhouse/getData", "POST"); 
    // status generator
    tableData.forEach(function(item){
        item.Status = tagGenerator(item.Status);
    });

    await initBootstrapTable(
        "#tihIndexTable",                                                               // tableName
        ["Code", "Name", "Client", "Device" ,"Status" ,"_id"],                                     // tableHead
        ["_id"],                                                                        // hiddenColumns (hide ID column)
        ["Code", "Name", "Client.FullName", "Device.Type", "Status", "_id"],                             // dataField
        tableData,                                                                      // tableData
        false,                                                                           // withSearch (enable search)
    );

    // add click event to table rows and view product details
    $('#tihIndexTable tbody').off('click', 'tr').on('click', 'tr', function () {
        var data = $('#tihIndexTable').bootstrapTable('getData')[$(this).data('index')];
        // to to product view page
        window.location.href = "/transaction/inhouse/view/" + data._id;
    });
    // add click event to search input
    $('#tihSearchInput').on('keyup', function() {
        var searchVal = this.value.toLowerCase();
        $('#tihIndexTable tbody tr').each(function() {
            var row = $(this).text().toLowerCase();
            $(this).toggle(row.indexOf(searchVal) > -1);
        });
    });
}
