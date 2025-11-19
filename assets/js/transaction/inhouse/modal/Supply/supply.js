// tihs = transaction inhouse supply
async function inhouseSupply(dataIds) {
    // dataIds = {productSupplyId, inhouseId, productId}
    return new Promise(async function (resolve, reject) {
        try {
            var productData = await crudiAjax({productId: dataIds.productId},'/inventory/product/getOneData', 'POST');
            if (productData.withSerial){
                // with serial
                var supplyData = await crudiAjax({productId: dataIds.productId},'/inventory/supply/getData', 'POST');
                await initBootstrapTable(
                    "#tihSupplyTable",                                                // tableName
                    ["Code", "Name","Serial", "Status" ,"Cost", "_id"],                            // tableHead
                    ["_id"],                                                           // hiddenColumns (hide ID column)
                    ["Code", "Product.Name", "Serial", "Status", "Cost", "_id"],                            // dataField
                    supplyData,                                                       // tableData
                    true,                                                              // withSearch (enable search)
                );

            } else {
                // without serial
                var supplyData = await crudiAjax({productId: dataIds.productId},'/inventory/supply/getData', 'POST');
                await initBootstrapTable(
                    "#tihSupplyTable",                                                // tableName
                    ["Code", "Name","Status" ,"Cost", "_id"],                            // tableHead
                    ["_id"],                                                           // hiddenColumns (hide ID column)
                    ["Code", "Product.Name", "Status", "Cost", "_id"],                            // dataField
                    supplyData,                                                       // tableData
                    true,                                                              // withSearch (enable search)
                );
            }

            // add click event on table
            $('#tihSupplyTable').off('click-row.bs.table').on('click-row.bs.table', async function (e, row, $element) {
                if (confirm("Are you sure you want to add this supply to this transaction?")){
                    // add supply id to hidden input
                    $('#tihSrpSupplyId').val(row._id);
                    // add ideal price value
                    $('#tihSrp').val(productData.idealPrice);
                    // show srp modal and close supply modal
                    $('#tihSrpModal').modal('show');
                    $('#tihSupplyModal').modal('hide');

                    $('#tihSrpForm').off('submit').on('submit', async function(e){
                        if ($(this).closest('form').is(':valid') === true){
                            e.preventDefault();
                            var data = {}
                            data.data = {
                                SRP: parseFloat($('#tihSrp').val()),
                            }
                            data.supplyId = $('#tihSrpSupplyId').val();
                            data.inhouseId = dataIds.inhouseId;
                            data.productSupplyId = dataIds.productSupplyId;
                            await crudiAjax(data, '/transaction/inhouse/supply/add', 'POST');
                            // close srp modal
                            $('#tihSrpModal').modal('hide');
                            // show supply modal
                            $('#tihSupplyModal').modal('show');
                            // show toast
                            $(".toast").toast("show").find(".toast-body").text("You have successfully added the supply to this transaction.")
                            $(".toast").find(".toast-title").text("Supply Added")
                        }
                    }); 
                }
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};
