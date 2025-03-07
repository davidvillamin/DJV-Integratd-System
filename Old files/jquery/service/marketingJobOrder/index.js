var gServiceTypeTempStr              = '',
    gServiceJobOrder                 = {};
$(document).ready(function() {
    initialize()
    // create jobOrder populate
    $('#crtMktgJobOrderBtn').on('click', function(){
        $('#crtServiceTypeOpt').html('')
        $('#crtServiceTypeOpt').append("<option value=''>Please select type</option>")
        gServiceTypeTempStr.forEach(function(type){
            if(!type.wTicket && type.category === 'Marketing'){
                $('#crtServiceTypeOpt').append("<option data-cat=" + type.category + " value='" + type._id + "'>" + type.type + "</option>")
            }
        })
    })
    // create jobOrder submit
    $('#crtClntType :submit').on('click', function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault()
                window.location = "/service/" + $('#crtServiceTypeOpt :selected').attr('data-cat') + "/" + $('#crtServiceTypeOpt :selected').val() + "/jo/create";
        } else {
            isInvalid(e)
        }

    })
})
function initialize(){
    // populate data of service category
    gServiceTypeTempStr = crudiAjax('',"/settings/serviceType/list","get").foundServiceType;
    // initialize table
    gServiceJobOrder = crudiAjax('',"/service/marketing/ajaxInit/jo","get").foundJobOrder;
    // populate table
    $('#tblMktgJoTbody').html('')
    gServiceJobOrder.forEach(function(jo){
        $('#tblMktgJoTbody').append("<tr>\
            <td><a href='/service/jo/" + jo._id + "'>" + jo.joNum + "</a></td>\
            <td>" + jo.serviceType[0].type + "</td>\
            <td>" + jo.clientDevice[0].deviceName + "</td>\
            <td>" + jo.client[0].clntName + "</td>\
            <td>\
                <span class='badge bg-warning text-dark'>" + jo.status + "</span>\
            </td>\
            <td>\
                <button class='btn btn-warning edtClnt btn-sm' data-bs-toggle='modal' data-bs-target='#'>\
                    <i class='icofont-edit'></i>\
                </button>\
                <button class='btn btn-danger dltClnt btn-sm' data-bs-toggle='modal' data-bs-target='#dltClntMod'>\
                    <i class='icofont-ui-delete'></i>\
                </button>\
            </td>\
        </tr>")
    })
    $("#tblMktgJo").dataTable({
        responsive: true
    })
}
