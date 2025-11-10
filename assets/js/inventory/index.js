// prefix legends
//   ipc = inventory product create

$(function(){
    
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    loadingScreen();

    //remove class collapsed after click on sidebar
    $("#sbinventory").removeClass("collapsed");

    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    //create parts information
    inventoryProductCreate().then(function(){
        initialize();
    })

    initialize();
})

async function initialize(){
    // get data
    var tableData = crudiAjax({}, "/inventory/product/getData", "POST");
    // document count for quantity
    for (let i = 0; i < tableData.length; i++) {
        // count how many supply available for each product
        var supplyCount = await tableData[i].Supply.filter(function(supply){
            return supply.Status === "Available";
        }).length;
        tableData[i].Quantity = supplyCount;
    }    

    await initBootstrapTable(
        "#iiTable",                                                                     // tableName
        ["Code", "Name", "Description", "Quantity" , "_id"],                            // tableHead
        ["_id"],                                                                        // hiddenColumns (hide ID column)
        ["Code", "Name", "Description", "Quantity", "_id"],                             // dataField
        tableData,                                                                      // tableData
        true,                                                                           // withSearch (enable search)
    );

    // add click event to table rows and view product details
    $('#iiTable tbody').on('click', 'tr', function () {
        var data = $('#iiTable').bootstrapTable('getData')[$(this).index()];
        // to to product view page
        window.location.href = "/inventory/product/view/" + data._id;
    });
}