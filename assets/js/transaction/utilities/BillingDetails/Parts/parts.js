// tpEdit data population
function partsSummary(data,editBtnClass, deleteBtnClass,editModal,deleteModal){
    return data.Parts.map(function(part) {
        return ({
            _id: part._id,
            Description: `<i class='bi bi-pencil-square text-white p-1 px-2 text-white bg-warning rounded ` + editBtnClass + `' data-bs-toggle="modal" data-bs-target=` + editModal + `></i>\
            <i class='bi bi-trash text-white p-1 px-2 bg-danger rounded me-2 ` + deleteBtnClass + `' data-bs-toggle="modal" data-bs-target=` + deleteModal + `></i>` 
            + part.Description, // for Description
            Serial: part.Serial,
            Price: formatCurrency(part.RetailPrice)
        })
    });
}