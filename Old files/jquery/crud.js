//crud ajax
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