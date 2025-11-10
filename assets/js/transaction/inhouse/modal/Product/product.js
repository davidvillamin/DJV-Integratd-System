async function initTihsProductModal(tihId) {
    // get data
    var productData = await crudiAjax({},'/inventory/product/getData', 'POST');

    await initBootstrapTable(
        "#tihProductTable",                                                // tableName
        ["Code", "Name", "Description", "_id"],                            // tableHead
        ["_id"],                                                           // hiddenColumns (hide ID column)
        ["Code", "Name", "Description", "_id"],                            // dataField
        productData,                                                       // tableData
        true,                                                              // withSearch (enable search)
    );

    // add click event to table rows and view product details
    $('#tihProductTable').on('click-row.bs.table', async function (e, row, $element) {
        if (confirm("Are you sure you want to add this product?")){
            // add product to transaction
            var data = {
                transactionId: tihId,
                productId: row._id,
            };
            await crudiAjax(data, '/transaction/inhouse/product/add', 'POST');
            // hide modal
            $('#tihProductModal').modal('hide');
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfully added the product to this transaction.")
            $(".toast").find(".toast-title").text("Product Added")
        } 
    });
}