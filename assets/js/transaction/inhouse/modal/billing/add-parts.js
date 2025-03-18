function initializeAddParts(){
    // populate all item information
    var partInformationList =  crudiAjax({},"/transaction/inhouse/view/parts/add/partsInfromation/populate","post")

    if ($.fn.DataTable.isDataTable('#tihvbiisItemInformationTable')) {
        $('#tihvbiisItemInformationTable').DataTable().clear().destroy();
    }
    var iiTable = $('#tihvbiisItemInformationTable').DataTable( {
        data: partInformationList,
        columns: [
            { data: '_id' },
            { data: 'Description' },
            { data: 'Brand' },
            { data: 'Model' }
        ]
    } );

    var sTable = $("#tihvbiisSerialTable").DataTable()

    $('#tihvbiisItemInformationTable tbody').on('click', 'tr', function () {
        // var table = $('#tihvbiisItemInformationTable').DataTable();
        // get the row data
        var rowData = iiTable.row(this).data();
        // Highlight the selected row with yellow background
        $('#tihvbiisItemInformationTable tbody tr').css('background-color', '');
        $(this).css('background-color', 'yellow');

        var serialList = crudiAjax(rowData,"/transaction/inhouse/view/parts/add/partsInformation/serial/populate","post")
        //destroy datatable
        if ($.fn.DataTable.isDataTable('#tihvbiisSerialTable')) {
            $('#tihvbiisSerialTable').DataTable().clear().destroy();
        }
        //populate table of serial

        $("#tihvbiisSerialTable").DataTable({
            data: serialList,
            columns: [
                {data: "_id"},
                {data: "Serial"},
                {data: "Description"}
            ]
        })
        $('#tihvbiisSerialTable tbody').on('click', 'tr', function () {
            var rowData = sTable.row(this).data();
            // Highlight the selected row with yellow background
            $('#tihvbiisSerialTable tbody tr').css('background-color', '');
            $(this).css('background-color', 'yellow');
        })
    });



}   