function paymentSummary(data,editBtnClass, deleteBtnClass,editModal,deleteModal){
    return data.Payment.map(function(pay) {
        return ({
            _id: pay._id,
            Description: `<i class='bi bi-pencil-square text-white p-1 px-2 text-white bg-warning rounded ` + editBtnClass + `' data-bs-toggle="modal" data-bs-target=` + editModal + `></i>\
            <i class='bi bi-trash text-white p-1 px-2 bg-danger rounded me-2 ` + deleteBtnClass + `' data-bs-toggle="modal" data-bs-target=` + deleteModal + `></i>` 
            + pay.Description, // for Description
            Date: moment(pay.Date).format("MMM-DD-YYYY"), // for Date,
            Amount: formatCurrency(pay.Amount)
        })
    });
}