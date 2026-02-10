$(function(){
    // collapse sidebar nav link and set active link
    $("#sbClient").addClass("active");

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
        false,                                                                           // withSearch (enable search)
    );

    // add click event to table rows and view product details
    $('#ciTable tbody').on('click', 'tr', function () {
        var data = $('#ciTable').bootstrapTable('getData')[$(this).data('index')];
        // to to product view page
        window.location.href = "/client/view/" + data._id;
    });
    // add click event to search input
    $('#ciSearchInput').on('keyup', function() {
        var searchVal = this.value.toLowerCase();
        $('#ciTable tbody tr').each(function() {
            var row = $(this).text().toLowerCase();
            $(this).toggle(row.indexOf(searchVal) > -1);
        });
    });
}

