var gServiceCatTempStr                      = '';

$(document).ready(function() {
    initialize()
    // add service category
    $('#crtServiceCat :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            flash(crudiAjax({
                category: $('#crtServiceCatNm').val(),
            },"/settings/serviceCat/create","POST"))
            initialize()
        }
    })
    // populate service type
    $('#crtServiceTypeBtn').on('click',function(){
        //clean first the select option
        $('#crtServiceTypeCat').html('')
        // insert data on option
        $('#crtServiceTypeCat').append(gServiceCatTempStr)
    })
    // add service type
    $('#crtServiceType :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            flash(crudiAjax({
                category: $('#crtServiceTypeCat').val(),
                type: $('#crtServiceTypeType').val(),
                wTicket: $("input[name='crtServiceTypeTicket']:checked").val()
            },"/settings/serviceType/create","POST"))
            initialize()
        }
    })
})
//initialize data
function initialize(){
    //Service category
    var data = crudiAjax('',"/settings/serviceCat/list","get").foundServiceCat;
    $('#tblServiceCatLstTBody').html("")
    gServiceCatTempStr = "<option value=''>Select Category</option>" // for populatation of service type category select
    data.forEach(function(type){
        gServiceCatTempStr += "<option value='" + type.category + "'>" + type.category + "</option>" // adding html code for the service type category select
        $('#tblServiceCatLstTBody').append("<tr data-id='" + type._id + "'\
            data-category='" + type.category + "'>\
            <td class='p-1'>" + type.category + "</td>\
            <td class='p-1'>\
                <button class='btn btn-warning edtJOTypeLst btn-sm' data-bs-toggle='modal' data-bs-target='#modEdtClntType'>\
                    <i class='icofont-edit'></i>\
                </button>\
                <button class='btn btn-danger dltJOTypeLst btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-ui-delete'></i>\
                </button>\
            </td>\
        </tr>")
    })
    //Service type
    var data = crudiAjax('',"/settings/serviceType/list","get").foundServiceType;
    $('#tblServiceTypeLstTBody').html("")
    data.forEach(function(type){
        $('#tblServiceTypeLstTBody').append("<tr data-id='" + type._id + "'\
            data-category='" + type.category + "'\
            data-wTicket='" + type.wTicket + "'\
            data-type='" + type.type + "'>\
            <td class='p-1'>" + type.category + "</td>\
            <td class='p-1'>" + type.type + "</td>\
            <td class='p-1'>" + type.wTicket + "</td>\
            <td class='p-1'>\
                <button class='btn btn-warning edtJOTypeLst btn-sm' data-bs-toggle='modal' data-bs-target='#modEdtClntType'>\
                    <i class='icofont-edit'></i>\
                </button>\
                <button class='btn btn-danger dltJOTypeLst btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-ui-delete'></i>\
                </button>\
            </td>\
        </tr>")
    })
}