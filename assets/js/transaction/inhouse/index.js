$(async function(){
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });

    //for selection on side bar
    $("#sbinhouse").removeClass("collapsed");
    
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });
    // run initialize
    initialize()
    // Check if Quill is already initialized for this element
    if (!window.quillInstances) {
        window.quillInstances = {};
    }

    // initialize add transaction
    initCreateTransactionInhouse().then(async function(){
        await initialize() // reinitialize initialize
    })

    // initialize edit transaction
     // initialize event listener on edit when clicked get the id of transaction on the table         
     $("#tihIndexTable").off("click", ".tihEdit").on("click", ".tihEdit", async function () {
        var row = $(this).closest("tr");
        // Get the tihId (which is the first element in the row data array)
        var tihId = $("#tihIndexTable").DataTable().row(row).data()[0];

        var transaction = await crudiAjax({ tihId: tihId }, "/transaction/inhouse/edit", "POST");
        console.log(transaction)
        initEditTransactionInhouse(transaction).then(async function(){
            await initialize() // reinitialize initialize
        })
    });

    $("#tihIndexTable").off("click", ".tihDelete").on("click", ".tihDelete", async function () {
        var row = $(this).closest("tr");
        // The third column contains an anchor tag, so we need to extract the text from it
        var jobOrderElement = $("#tihIndexTable").DataTable().row(row).data()[2];
        // Extract the Job Order number from the anchor tag
        var jobOrderNumber = $(jobOrderElement).text();
        initDeleteTransactionInhouse(
            $("#tihIndexTable").DataTable().row(row).data()[0], //transactionID
            $("#tihIndexTable").DataTable().row(row).data()[1], //clientId
            jobOrderNumber //jobOrderNumber
        ).then(async function(){
            await initialize()
        })
    });
})

// bug to fix : Continious enter of data on create, tableData can't get new fresh data when called in initialize()

async function initialize(){
   // initialize datatable
    // table name, table head, table data, table edit, table delete
    try {
        // Fetch the data from the server
        var tihData = await crudiAjax({}, "/transaction/inhouse/index/poplate/table", "Post");
        // prepare the table data
        var tableData = tihData.map(function(tih){
            return ([
                tih._id, // transaction ID
                tih.Client._id, // client ID
                `<i class='bi bi-pencil-square text-white p-1 px-2 text-white bg-warning rounded tihEdit' data-bs-toggle="modal" data-bs-target="#tihEditModal"></i>\
                <i class='bi bi-trash text-white p-1 px-2 bg-danger rounded me-2 tihDelete' data-bs-toggle="modal" data-bs-target="#tihDeleteModal"></i>
                <a href='/transaction/inhouse/view/` + tih._id + `'>` + tih.JobOrder + `</a>`, // for job order with link
                "<a href='/client/view/" + tih.Client._id + "'>" + tih.Client.Name + "</a>", // for Client name with link 
                tih.Device, // device 
                autoComputeBilling(tih.Billing), // bill
                tagGenerator(tih.Tags) // tags
            ])
        })
        // DataTable does not exist, create it
        await initDataTable(
            "#tihIndexTable",
            ["tihId","clientId", "Job Order", "Name", "Device", "Bill", "Status"],
            [{
                    targets: 0, // Transaction ID column is the first column
                    visible: false, // Hide the ID column
                    searchable: false // Make it non-searchable
            },{
                    targets: 1, // client ID column is the 2nd column
                    visible: false, // Hide the ID column
                    searchable: false // Make it non-searchable
            }],
            tableData,
            ".tihEdit",
            ".tihDelete"
        );
    } catch (error) {
        console.error("Error initializing or updating DataTable:", error);
    }        
}