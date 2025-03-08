$(function(){
    //remove class collapsed after click on sidebar
    $("#sbClient").removeClass("collapsed");
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // initialize datatable
    var dTable = $('#ciTable').DataTable({
        data: crudiAjax({}, "/client/index/table", "POST"),
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100] // entries per page options
    })


    //add eventlistener on click to launch the create client function on client\crud\create.js
    // TODO: fix promise for create client on initialize table.
    $("#ciCreate").on('click', async function(){
        createClient(dTable)
    })
})

function initializeTable(dTable){
    // populate table
    var newData = crudiAjax({}, "/client/index/table", "POST");
    dTable.clear().rows.add(newData).draw();
}
