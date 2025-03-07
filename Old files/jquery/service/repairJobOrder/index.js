var gServiceTypeTempStr                 = '',
    gServiceJobOrder                    = [],
    gJoId                               = '';
$(document).ready(function() {
    initializeIndex()
    // create jobOrder populate
    $('#crtRepairJobOrderBtn').on('click', function(){
        $('#crtServiceTypeOpt').html('')
        $('#crtServiceTypeOpt').append("<option value=''>Please select type</option>")
        gServiceTypeTempStr.forEach(function(type){
            if(!type.wTicket && type.category === 'Repair'){
                $('#crtServiceTypeOpt').append("<option data-cat=" + type.category + " value='" + type._id + "'>" + type.type + "</option>")
            }
        })
    })
    // create jobOrder submit
    $('#crtClntType :submit').on('click', function(e){
        e.preventDefault()
        if ($(this).closest('form').is(':valid') === true){
                window.location = "/service/" + $('#crtServiceTypeOpt :selected').attr('data-cat') + "/" + $('#crtServiceTypeOpt :selected').val() + "/jo/create";
        } else {
            isInvalid(e)
        }

    })
    // delete job order
    $('.dltRepairJo').on('click', function(){
        gJoId = $(this).closest('tr').attr('data-joId')
        $('#dltRepJoNum').text($(this).closest('tr').attr('data-joNum'))
        $('#dltRepJoType').text($(this).closest('tr').attr('data-type'))
        $('#dltRepJoDev').text($(this).closest('tr').attr('data-clntDev'))
        $('#dltRepJoClnt').text($(this).closest('tr').attr('data-clntName'))
    })

    //save delete job order
    $('#dltRepJo :submit').on('click', function(e){
        e.preventDefault()
        if ($('#dltRepJoConfirm').val() === "DELETE"){
            if ($(this).closest('form').is(':valid') === true){
                var delData = crudiAjax(gJoId,'/service/repair/jo/delete','delete')
                toaster({
                    text:delData.text,
                    header:delData.header,
                    icon:delData.icon,
                    beforeShow: function(){
                        dltJoRepClearMod()
                        // re initialize the page
                        initializeIndex()
                        $('.dltRepairJo').on('click', function(){
                            gJoId = $(this).closest('tr').attr('data-joId')
                            $('#dltRepJoNum').text($(this).closest('tr').attr('data-joNum'))
                            $('#dltRepJoType').text($(this).closest('tr').attr('data-type'))
                            $('#dltRepJoDev').text($(this).closest('tr').attr('data-clntDev'))
                            $('#dltRepJoClnt').text($(this).closest('tr').attr('data-clntName'))
                        })
                    }
                })
            } else {
                isInvalid(e)
            }
        } else {
            toaster({
                text:'Delete code not match',
                header:'Delete client',
                icon:'error',
                beforeShow: function(){$('#dltRepJoConfirm').val('')}
            })
            $('.needs-validation').closest('form').addClass('was-validated');
        }
    })
})
function initializeIndex(){
    // populate data of service category
    gServiceTypeTempStr = crudiAjax('',"/settings/serviceType/list","get").foundServiceType;
    // initialize table
    gServiceJobOrder = crudiAjax('',"/service/repair/ajaxInit/jo","get").foundJobOrder;
    // populate table
    $("#tblRepairJo").dataTable().fnDestroy();
    $('#tblRepairJoTbody').html('')
    
    gServiceJobOrder.forEach(function(jo){
        $('#tblRepairJoTbody').append("<tr\
            data-joId='" + jo._id + "'\
            data-joNum='" + jo.joNum + "'\
            data-clntName='" + jo.client[0].clntName + "'\
            data-clntDev='" + jo.clientDevice[0].deviceName + "'\
            data-type='" + jo.serviceType[0].type + "'>\
            <td><a href='/service/repair/jo/" + jo._id + "'>" + jo.joNum + "</a></td>\
            <td>" + jo.serviceType[0].type + "</td>\
            <td>" + jo.clientDevice[0].deviceName + "</td>\
            <td>" + jo.client[0].clntName + "</td>\
            <td>\
                <span class='badge bg-warning text-dark'>" + jo.status + "</span>\
            </td>\
            <td>\
                <a class='btn btn-warning edtRepairJo btn-sm' href='/service/repair/jo/" + jo._id + "/edit'>\
                    <i class='icofont-edit'></i>\
                </a>\
                <button class='btn btn-danger dltRepairJo btn-sm' data-bs-toggle='modal' data-bs-target='#dltRepJoMod'>\
                    <i class='icofont-ui-delete'></i>\
                </button>\
            </td>\
        </tr>")
    })
    
    $("#tblRepairJo").DataTable({
        pageLength : 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20,30]],
        responsive: true
    })
}
// ============================================================
// Clear data on delete modal
// ============================================================
function dltJoRepClearMod(){
    $('#dltRepJo').removeClass("was-validated")
    $('#dltRepJoNum').text('')
    $('#dltRepJoType').text('')
    $('#dltRepJoDev').text('')
    $('#dltRepJoClnt').text('')
    $('#dltRepJoConfirm').val('')
    $('#dltRepJoMod').modal('toggle')
}
