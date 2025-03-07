$(document).ready(function() {
    initialize()
    // ===============================================
    // Material
    // ===============================================
    //add material type
    $('#crtMatType :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            flash(crudiAjax({
                type: $('#crtMatTypeNm').val(),
                isSerialized: $('input[name="crtMatTypeSerialized"]:checked').val()
            },"/settings/matType/create","POST"))
            initialize()
        }
    })
    //add material brand
    $('#crtMatBrand :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            flash(crudiAjax({
                brand: $('#crtMatBrandNm').val()
            },"/settings/matBrand/create","POST"))
            initialize()
        }
    })
})
//initialize data
function initialize(){
    //material type list
    $('#matTypeLst').html("")
    crudiAjax('',"/settings/matType/list","get").foundMatType.forEach(function(matType){
        $('#matTypeLst').append("<li class='list-group-item'>" + matType.type + "</li>")
    })
    //material brand list
    $('#matBrandLst').html("")
    crudiAjax('',"/settings/matBrand/list","get").foundMatBrand.forEach(function(matBrand){
        $('#matBrandLst').append("<li class='list-group-item'>" + matBrand.brand + "</li>")
    })
}