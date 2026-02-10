$(function(){
    // collapse sidebar nav link and set active link
    $("#sbDevice").addClass("active");
    
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
        false,                                                                           // withSearch (enable search)
    );

    // add click event to table rows and view product details
    $('#diTable tbody').on('click', 'tr', function () {
        var data = $('#diTable').bootstrapTable('getData')[$(this).data('index')];
        // to to product view page
        window.location.href = "/device/view/" + data._id;
    });

        // add click event to search input
    $('#diSearchInput').on('keyup', function() {
        var searchVal = this.value.toLowerCase();
        $('#diTable tbody tr').each(function() {
            var row = $(this).text().toLowerCase();
            $(this).toggle(row.indexOf(searchVal) > -1);
        });
    });
}

