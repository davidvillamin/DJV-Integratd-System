function crudiAjax(data, url, type){
    var ret
    $.ajax({
        url: url,
        type: type,
        data: {data},
        async: false,
        success: function(retData){
            ret = retData            
        },
        error: function(err){
            console.log(err);
        }
    })
    return ret
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);
}