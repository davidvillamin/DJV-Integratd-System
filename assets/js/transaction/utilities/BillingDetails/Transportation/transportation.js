function transporationSummary(data,editBtnClass, deleteBtnClass,editModal,deleteModal){
    return data.Transporation.map(function(transpo) {
        return ({
            _id: transpo._id,
            Description: `<i class='bi bi-pencil-square text-white p-1 px-2 text-white bg-warning rounded ` + editBtnClass + `' data-bs-toggle="modal" data-bs-target=` + editModal + `></i>\
            <i class='bi bi-trash text-white p-1 px-2 bg-danger rounded me-2 ` + deleteBtnClass + `' data-bs-toggle="modal" data-bs-target=` + deleteModal + `></i>` 
            + transpo.Description, // for Description
            Quantity: transpo.Quantity,
            Price: formatCurrency(transpo.Price)
        })
    });
}