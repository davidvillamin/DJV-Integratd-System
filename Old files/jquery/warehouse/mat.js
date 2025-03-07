// ===============================================
// populate material type list
// ===============================================
var gMatType = []
var gMatBrand = []


$(document).ready(function() {
    initialize()
    // ===============================================
    // launch create material
    // ===============================================
    $('#crtMaterials').on('click',function(){
        crtMatClear()
        $('#crtMatTypeType').val($('#crtMatTypeOpt :selected').val())
        $('#crtMatTypeisSerialized').val($('#crtMatTypeOpt :selected').attr("data-isSerialized"))
        $('#crtMatTypeID').val($('#crtMatTypeOpt :selected').attr("data-id"))
        //populate mat type
        $('#crtMatTypeOpt').append("<option value='' selected>Select Material Type</option>")
        gMatType.foundMatType.forEach(function(type){
            $('#crtMatTypeOpt').append("<option data-isSerialized='" + type.isSerialized + "' value='" + type._id + "'>" + type.type + "</option>")
        })
        //popluate mat brand
        $('#crtMatBrandOpt').append("<option value='' selected>Select Material Brand</option>")
        gMatBrand.foundMatBrand.forEach(function(brand){
            $('#crtMatBrandOpt').append("<option value='" + brand._id + "'>" + brand.brand + "</option>")
        })
        //lunch modal
        $('#modCrtMat').modal('toggle')
    })
    // ===============================================
    // save created material
    // ===============================================
    $('#crtMat :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            var data = {}
            data.mat = {}
            data.mat.isSerialized =  $('#crtMatTypeOpt').find(':selected').attr('data-isSerialized')
            data.mat.model =  $('#crtMatModel').val()
            data.mat.desc =  $('#crtMatDesc').val()
            data.mat.eanUPC =  $('#crtMatEanUpc').val()
            
            data.matType = $('#crtMatTypeOpt').val()
            data.matBrand = $('#crtMatBrandOpt').val()

            flash(crudiAjax(data,"/warehouse/mat/create","post"))
            crtMatClear()
            initialize()
        }
    })
    // ===============================================
    // Launch Edit material
    // ===============================================
    $('#tblMatIndex').on( 'click', '.edtMat', function () {
        // populate material type
        var matType = JSON.parse($(this).closest('tr').attr('data-type'))
        $('#edtMatTypeOpt').html('')
        $('#edtMatTypeOpt').append("<option data-isSerialized='" + matType.isSerialized + "' value='" + matType._id + "'>" + matType.type + "</option>")
        gMatType.foundMatType.forEach(function(type){ 
            if (type._id !== matType._id){
                $('#edtMatTypeOpt').append("<option value='" + type._id + "'>" + type.type + "</option>")
            }
        })     
        // populate material brand 
        var matBrand = JSON.parse($(this).closest('tr').attr('data-brand'))
        $('#edtMatBrandOpt').html('')
        $('#edtMatBrandOpt').append("<option value='" + matBrand._id + "'>" + matBrand.brand + "</option>")
        gMatBrand.foundMatBrand.forEach(function(brand){
            if (brand._id !== matBrand._id){
                $('#edtMatBrandOpt').append("<option value='" + brand._id + "'>" + brand.brand + "</option>")
            }
        })      

        // populate edit info
        $('#edtMatId').val($(this).closest('tr').attr('data-id'))
        $('#edtMatModel').val($(this).closest('tr').attr('data-model'))
        $('#edtMatDesc').val($(this).closest('tr').attr('data-desc'))
        $('#edtMatEanUpc').val($(this).closest('tr').attr('data-eanUPC'))
    })
    // ===============================================
    // Save Edit material
    // ===============================================
    $('#EdtMat :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            var data = {}
            data.mat = {}
            data.mat.isSerialized =  $('#edtMatTypeOpt').find(':selected').attr('data-isSerialized')
            data.mat.model =  $('#edtMatModel').val()
            data.mat.desc =  $('#edtMatDesc').val()
            data.mat.eanUPC =  $('#edtMatEanUpc').val()
            
            data.matId = $('#edtMatId').val()
            data.matType = $('#edtMatTypeOpt').val()
            data.matBrand = $('#edtMatBrandOpt').val()

            flash(crudiAjax(data,"/warehouse/mat/edit","post"))
            edtMatClear()
            initialize()
        }
    })
    // ===============================================
    // Launch Delete material
    // ===============================================
    $('#tblMatIndex').on( 'click', '.dltMat', function () {
        var tempType = JSON.parse($(this).closest('tr').attr('data-type'))
        var tempBrand = JSON.parse($(this).closest('tr').attr('data-brand'))
        $('#dltMatId').val($(this).closest('tr').attr('data-id'))
        $('#dltMatType').text(tempType.type)
        $('#dltMatBrand').text(tempBrand.brand)
        $('#dltMatModel').text($(this).closest('tr').attr('data-model'))
    });

    //delete save
    $('#dltMatAlert :submit').on( 'click', function () {
        if ($('#dltMatConfirm').val() === 'DELETE'){
            if ($(this).closest('form').is(':valid') === true){
                var dltMat = {id: $('#dltMatId').val()}
                flash(crudiAjax(dltMat,"/warehouse/mat/delete","delete"))
                dltMatClear()
                initialize()
            }
        } else {
            flash({flash: 'error', message: "Delete code not match" })
            dltMatClear()
        }
    })
})
// ===============================================
// Initialize page
// ===============================================
function initialize (){
    //populate material table list
    var data = crudiAjax('',"/warehouse/ajaxInit/mat","get");
    $("#tblMatIndex").dataTable().fnDestroy();
    var tbody = $('#tblMatIndexBody')
    tbody.html('')
    var qty = 0
    data.foundMat.forEach(function(mat){
        if ( !Array.isArray(mat.serial) || !mat.serial.length){
            qty = 0
        } else {
            qty = mat.serial.length
        }
        tbody.append("<tr data-id=" + mat._id + " \
            data-type='" + JSON.stringify(mat.type[0]) + "' \
            data-brand='" + JSON.stringify(mat.brand[0]) + "' \
            data-desc='" + mat.desc + "' \
            data-eanUPC='" + mat.eanUPC + "' \
            data-model='" + mat.model + "'>\
            <td class='p-1'><a href='/warehouse/mat/" + mat._id + "'>" + mat.brand[0].brand + "</a></td>\
            <td class='p-1'><a href='/warehouse/mat/" + mat._id + "'>" + mat.model + "</a></td>\
            <td class='p-1'><a href='/warehouse/mat/" + mat._id + "'>" + qty + "</a></td>\
            <td class='p-1'>\
                <button class='btn btn-warning edtMat btn-sm' data-bs-toggle='modal' data-bs-target='#modEdtMat'>\
                    <i class='icofont-edit'></i>\
                </button>\
                <button class='btn btn-danger dltMat btn-sm' data-bs-toggle='modal' data-bs-target='#modDelMat'>\
                    <i class='icofont-ui-delete'></i>\
                </button>\
            </td>\
        </tr>")
    })

    $("#tblMatIndex").dataTable({
        responsive: true
    })
    //initialize material type to global variable
    gMatType = crudiAjax("","/warehouse/ajaxInit/matType","get")
    //initialize material type to global variable
    gMatBrand = crudiAjax("","/warehouse/ajaxInit/matBrand","get")
}
// ===============================================
// Clear data in create material
// ===============================================
function crtMatClear(){
    $('#crtMatTypeOpt').html('')
    $('#crtMatBrandOpt').html('')
    $('#crtMatModel').val('')
    $('#crtMatDesc').val('')
    $('#crtMatEanUpc').val('')
    $('#modCrtMat').modal('toggle')
}
// ===============================================
// Clear data in edit material
// ===============================================
function edtMatClear(){
    $('#edtMatId').val('')
    $('#edtMatTypeOpt').html('')
    $('#edtMatBrandOpt').html('')
    $('#edtMatModel').val('')
    $('#edtMatDesc').val('')
    $('#edtMatEanUpc').val('')
    $('#modEdtMat').modal('toggle')
}
// ===============================================
// Clear data in delete material
// ===============================================
function dltMatClear(){
    $('#dltMatId').val('')
    $('#dltMatType').text('')
    $('#dltMatBrand').text('')
    $('#dltMatModel').text('')
    $('#dltMatConfirm').val('')
    $('#modDelMat').modal('toggle')
}