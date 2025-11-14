$(function(){
    
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    loadingScreen();
    
    //remove class collapsed after click on sidebar
    $("#sbdevice").removeClass("collapsed");
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });
    
    initialize()

    createDevice().then(function(){
        initialize();
    })

    // client create
    createClient().then(function(){
        initialize();
    })

})

async function initialize(){
        // get data
    var tableData = crudiAjax({}, "/device/getData", "POST"); 
    await initBootstrapTable(
        "#diTable",                                                                     // tableName
        ["Code", "Name", "Client", "Type" , "_id"],                                     // tableHead
        ["_id"],                                                                        // hiddenColumns (hide ID column)
        ["Code", "Name", "Client.FullName", "Type", "_id"],                             // dataField
        tableData,                                                                      // tableData
        true,                                                                           // withSearch (enable search)
    );

    // add click event to table rows and view product details
    $('#diTable tbody').on('click', 'tr', function () {
        var data = $('#diTable').bootstrapTable('getData')[$(this).data('index')];
        // to to product view page
        window.location.href = "/device/view/" + data._id;
    });
}

