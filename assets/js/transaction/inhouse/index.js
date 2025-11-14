$(function(){
    // hide loading screen
    loadingScreen();

    // collapse sidebar nav link and set active link
    $("#forms-nav-transaction").addClass("show");
    $("#sbinhouse").removeClass("collapsed");
    
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

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
    var tableData = crudiAjax({}, "/transaction/inhouse/getData", "POST"); 
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
        true,                                                                           // withSearch (enable search)
    );

    // add click event to table rows and view product details
    $('#tihIndexTable tbody').off('click', 'tr').on('click', 'tr', function () {
        var data = $('#tihIndexTable').bootstrapTable('getData')[$(this).data('index')];
        // to to product view page
        window.location.href = "/transaction/inhouse/view/" + data._id;
    });
}
