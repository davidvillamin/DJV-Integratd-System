$(function() {
    initializeAddClientTable();  
});

async function initializeAddClientTable(){
    // populate the list of clients 
    var clientLits = await crudiAjax({},"/client/getData","POST");
    console.log(clientLits)
    // add tags to client type
    clientLits.forEach(function(data){
        if (data.BusinessName == '') {
            clientType = "<span class='badge bg-primary'>Individual</span>"
        } else {
            clientType = "<span class='badge bg-warning'>Business</span>"
        }
        data.Type = clientType;
    })

    await initBootstrapTable(
        "#tAddClientTable",                                             // tableName
        ["Code", "FullName", "Type"],                                   // tableHead
        [],                                                             // hiddenColumns            
        [ "Code","FullName","Type"],                                    // dataField
        clientLits,                                                     // tableData
        true,                                                           // withSearch (enable search)
    );

    // add click event to table rows and view product details
    $('#tAddClientTable tbody').on('click', 'tr', function () {
        var data = $('#tAddClientTable').bootstrapTable('getData')[$(this).data('index')];
        console.log(data)
        // populate all data of selected client to the form

    });

    // close the modal and collaps the hidden form
    $("#tAddClientAddBtn").on("click",function(){
        $("#tAddClient").modal("hide");
        $("#clientInfoCollapse").collapse("show");
    });
}