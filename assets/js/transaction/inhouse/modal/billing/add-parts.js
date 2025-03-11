function addParts(){


    $("#tihvbpaiTable").bootstrapTable({
        data: [
            ["Description", "Brand", "MOdel 1"],
            ["Description", "Brand", "MOdel 1"],
            ["Description", "Brand", "MOdel 1"],
        ]
    })
    $("#tihvbpaiTable").on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, rows) {
        var selectedRows = $("#tihvbpaiTable").bootstrapTable('getSelections');
        console.log(selectedRows);
    });
}