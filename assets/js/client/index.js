$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    loadingScreen();
    
    //remove class collapsed after click on sidebar
    $("#sbClient").removeClass("collapsed");
    
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    initialize()

    createClient().then(function(){
        // reload datatable
        initialize();
    })
});

async function initialize(){
        // get data
    var tableData = crudiAjax({}, "/client/getData", "POST"); 
    tableData.forEach(function(data){
        if (data.BusinessName == '') {
            clientType = "<span class='badge bg-primary'>Individual</span>"
        } else {
            clientType = "<span class='badge bg-warning'>Business</span>"
        }
        data.Type = clientType;
    })
    // type if business or individual
    await initBootstrapTable(
        "#ciTable",                                                                     // tableName
        ["Code", "Name", "Address", "Type" , "_id"],                                    // tableHead
        ["_id"],                                                                        // hiddenColumns (hide ID column)
        ["Code", "FullName", "Address.FullAddress", "Type", "_id"],                     // dataField
        tableData,                                                                      // tableData
        true,                                                                           // withSearch (enable search)
    );

    // add click event to table rows and view product details
    $('#ciTable tbody').on('click', 'tr', function () {
        var data = $('#ciTable').bootstrapTable('getData')[$(this).data('index')];
        // to to product view page
        window.location.href = "/client/view/" + data._id;
    });
}

