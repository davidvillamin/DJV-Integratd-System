$(document).ready(function() {
    initialize()
    // ===============================================
    // Add Client Type
    // ===============================================
    //add client type
    $('#crtClntType :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            flash(crudiAjax({
                ClientType: $('#crtClntTypeName').val(),
                wContPerson: $("input[name='crtClntTypeWConPer']:checked").val()
            },"/settings/clntType/create","POST"))
            initialize()
        }
    })
    // ===============================================
    // Edit Client Type Populate Data
    // ===============================================
    $('#tblClntTypeLst').on('click','.edtClntTypeLst',function(){
        $('#edtClntTypeId').val($(this).closest('tr').attr('data-id'))
        $('#edtClntTypeName').val($(this).closest('tr').attr('data-clntType'))
        $("input[name=edtClntTypeWConPer][value=" + $(this).closest('tr').attr('data-wContPerson') + "]").prop('checked', true)
    })
    // ===============================================
    // Save Edit Client Type
    // ===============================================
    //save edit client type
    $('#edtClntType :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            var clntContType = {}
            clntContType.id =  $('#edtClntTypeId').val()
            clntContType.type = {
                ClientType: $('#edtClntTypeName').val(),
                wContPerson: $("input[name='edtClntTypeWConPer']:checked").val()
            }
            flash(crudiAjax({clntContType},"/settings/clntType/edit","POST"))
            initialize()
        }
    })
    // ===============================================
    // Delete Client Type Populate Data
    // ===============================================
    $('#tblClntTypeLst').on('click','.dltClntTypeLst',function(){
        $('#edtClntTypeId').val($(this).closest('tr').attr('data-id'))
        $('#edtClntTypeName').val($(this).closest('tr').attr('data-clntType'))
        $("input[name=edtClntTypeWConPer][value=" + $(this).closest('tr').attr('data-wContPerson') + "]").prop('checked', true)
    })
    // ===============================================
    // Client contact Type
    // ===============================================
    //add contact number type
    $('#crtContType :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            flash(crudiAjax({
                ClientContType: $('#crtContTypeNm').val()
            },"/settings/clntContType/create","POST"))
            initialize()
        }
    })
    // ===============================================
    // Client Device type
    // ===============================================
    //add client device type
    $('#crtDevType :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            flash(crudiAjax({
                deviceType: $('#crtDevTypeNm').val()
            },"/settings/clntDevType/create","POST"))
            initialize()
        }
    })
    // ===============================================
    // Client Device brand
    // ===============================================
    //add client device brand
    $('#crtDevBrand :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            flash(crudiAjax({
                deviceBrand: $('#crtDevBrandNm').val()
            },"/settings/clntDevBrand/create","POST"))
            initialize()
        }
    })
    // ===============================================
    // Client Part Type
    // ===============================================
    //add client device part Type
    $('#crtDevPartType :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            flash(crudiAjax({
                partType: $('#crtDevPartTypeNm').val()
            },"/settings/clntDevPartType/create","POST"))
            initialize()
        }
    })

})
//initialize data
function initialize(){
    //client type list
    var data = crudiAjax('',"/settings/clntType/list","get");
    $('#tblClntTypeLstTBody').html("")
    data.foundClientType.forEach(function(clntType){
        $('#tblClntTypeLstTBody').append("<tr data-id='" + clntType._id + "'\
            data-clntType='" + clntType.ClientType + "'\
            data-wContPerson='" + clntType.wContPerson + "'>\
            <td class='p-1'>" + clntType.ClientType + "</td>\
            <td class='p-1'>" + clntType.wContPerson + "</td>\
            <td class='p-1'>\
                <button class='btn btn-warning edtClntTypeLst btn-sm' data-bs-toggle='modal' data-bs-target='#modEdtClntType'>\
                    <i class='icofont-edit'></i>\
                </button>\
                <button class='btn btn-danger dltClntTypeLst btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-ui-delete'></i>\
                </button>\
            </td>\
        </tr>")
    })

    //client contact type list
    $('#tblClntContTypeLstTBody').html("")
    crudiAjax('',"/settings/clntContType/list","get").foundClientContType.forEach(function(clntContType){
        $('#tblClntContTypeLstTBody').append("<tr data-id='" + clntContType._id + "'\
            data-clntContType='" + clntContType.ClientContType + "'>\
            <td class='p-1'>" + clntContType.ClientContType + "</td>\
            <td class='p-1'>\
                <button class='btn btn-warning edtClntContTypeLst btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-edit'></i>\
                </button>\
                <button class='btn btn-danger dltClntContTypeLst btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-ui-delete'></i>\
                </button>\
            </td>\
        </tr>")
    })

    //client device type
    $('#tblClntDevTypeLstTBody').html("")
    crudiAjax('',"/settings/clntDevType/list","get").foundClientDeviceType.forEach(function(clntDevType){
        $('#tblClntDevTypeLstTBody').append("<tr data-id='" + clntDevType._id + "'\
            data-clntDevType='" + clntDevType.deviceType + "'>\
            <td class='p-1'>" + clntDevType.deviceType + "</td>\
            <td class='p-1'>\
                <button class='btn btn-warning edtClntDevTypeLst btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-edit'></i>\
                </button>\
                <button class='btn btn-danger dltClntDevTypeLst btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-ui-delete'></i>\
                </button>\
            </td>\
        </tr>")
    })

    //client device brand
    $('#tblClntDevBrandLstTBody').html("")
    crudiAjax('',"/settings/clntDevBrand/list","get").foundClientDeviceBrand.forEach(function(clntDevBrand){
        $('#tblClntDevBrandLstTBody').append("<tr data-id='" + clntDevBrand._id + "'\
            data-clntDevBrand='" + clntDevBrand.deviceBrand + "'>\
            <td class='p-1'>" + clntDevBrand.deviceBrand + "</td>\
            <td class='p-1'>\
                <button class='btn btn-warning edtClntDevBrandLst btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-edit'></i>\
                </button>\
                <button class='btn btn-danger dltClntDevBrandLst btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-ui-delete'></i>\
                </button>\
            </td>\
        </tr>")
    })

    //client device Part Type
    $('#tblClntDevPartTypeListTBody').html("")
    crudiAjax('',"/settings/clntDevPartType/list","get").foundClientDevicePartType.forEach(function(clntDevPartType){
        $('#tblClntDevPartTypeListTBody').append("<tr data-id='" + clntDevPartType._id + "'\
            data-clntDevPartType='" + clntDevPartType.partType + "'>\
            <td class='p-1'>" + clntDevPartType.partType + "</td>\
            <td class='p-1'>\
                <button class='btn btn-warning edtClntDevPartType btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-edit'></i>\
                </button>\
                <button class='btn btn-danger dltClntDevPartType btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-ui-delete'></i>\
                </button>\
            </td>\
        </tr>")
    })
}