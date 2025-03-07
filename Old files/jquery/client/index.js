// declaration of global variabl client contact type list
var gClntContType                   = [],
    gClntType                       = [],
    gAddType                        = [],
    gdynaAddClntContTempStr         = '',
    gEdtContID                      = [],
    gDltContID                      = [];

$(function() {
    initialize()
    // ============================================================
    // [Create client] 
    // [Selecting type of client]
    // Initialize Client Type upon selecting "Create Client"
    // ============================================================
    $("#crtClnt").on('click', function(){
        // clear form status
        $('#crtClntType').removeClass("was-validated")
        //clear type option
        $('#crtClntTypeOpt').html('')
        $('#crtClntTypeOpt').append("<option value='' selected>Select Client Type</option>")
        //use of global variable [gClntType] to populate the select element and populate option data
        gClntType.forEach(function(type){
            $('#crtClntTypeOpt').append("<option data-wContPer='" + type.wContPerson + "' value='" + type._id + "'>" + type.ClientType + "</option>")
        })
    })

    // ============================================================
    // [Create client] 
    // [Selecting type of client] 
    // Initializing client type what to lunch (With or without contact person)
    // ============================================================
    $('#crtClntType :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault()
            // initialize contact option list
            // for dynamic add contact
            dynaAddClntContTempStr()
            
            switch ($('#crtClntTypeOpt :selected').attr("data-wContPer")) {
                case "true": // if with contact person
                    //clear data first
                    crtClntWCPClear()
                    $("#modCrtClntWCP").modal("toggle")
                    $('#crtClntWCPType').val($('#crtClntTypeOpt :selected').text())
                    $('#crtClntWCPTypeID').val($('#crtClntTypeOpt :selected').val())
                    $('#crtClntWCPTypewContPer').val($('#crtClntTypeOpt :selected').attr("data-wContPer"))
                    initClntContType("crtClntWCPContType") 

                    // populate address type on create
                    dynaAddClntAddTypeTempStr("crtClntWCPAddTypeOpt")

                    // detect if there is no contact person . if not create contact person.
                    if ($('.crtClntWCPContIndex').length == 0){
                        //add contact details
                        dynaAddClntContWCP("crtClntWCPCont","crtClntWCPDynamic","crtClntWCPContIndex","","" , "crtClntWCPContDel","crtClntWCPContAdd")
                        // add delete event function
                        ClntContDel("crtClntWCPContDel","crtClntWCPCont")
                    } else {
                        // add delete option 
                        ClntContDel("crtClntWCPContDel","crtClntWCPCont")
                    }
                    break;
                case "false": // if without contact person
                    //clear data first
                    crtClntWoCPClear()
                    $("#modCrtClntWoCP").modal("toggle")
                    $('#crtClntWoCPType').val($('#crtClntTypeOpt :selected').text())
                    $('#crtClntWoCPTypeID').val($('#crtClntTypeOpt :selected').val())
                    $('#crtClntWoCPTypewContPer').val($('#crtClntTypeOpt :selected').attr("data-wContPer"))
                    initClntContType("crtClntWoCPContType")

                    // populate address type on create
                    dynaAddClntAddTypeTempStr("crtClntWoCPAddTypeOpt")
                    
                    // detect if there is no contact person . if not create contact person.
                    if ($('.crtClntWoCPContIndex').length == 0){
                        //add contact details
                        dynaAddClntContWoCP("crtClntWoCPCont","crtClntWoCPDynamic","crtClntWoCPContIndex","", "crtClntWoCPContDel","crtClntWoCPContAdd")
                        // add delete event function
                        ClntContDel("crtClntWoCPContDel","crtClntWoCPCont")
                    } else {
                        // add delete option 
                        ClntContDel("crtClntWoCPContDel","crtClntWoCPCont")
                    }
                    break;
            }
            $(this).closest('.modal').modal('toggle')
        } else {
            isInvalid(e)
        }
    })


    // ============================================================
    // [Create client without contact person] 
    // ============================================================

    // ============================================================
    // [Create client without contact person] 
    // Initialize dynamic adding Click event on "Add another contact details"
    // ============================================================
    $("#crtClntWoCPContAdd").on("click", function(){
        // dynamically add contact 
        // with auto populate contact type
        dynaAddClntContWoCP("crtClntWoCPCont","crtClntWoCPDynamic","crtClntWoCPContIndex","", "crtClntWoCPContDel","crtClntWoCPContAdd")
        //populate data of contact type
        //add click event on delete
        ClntContDel("crtClntWoCPContDel","crtClntWoCPCont")
    })

    // ============================================================
    // [Create client without contact person] 
    // Save client without contact person
    // ============================================================
    // Create Client without contact person
    $('#crtClntWoCP :submit').on('click',function(e){
        // detect if there is no contact person . if not create contact person.
        if ($('.crtClntWoCPContIndex').length == 0){
            //add contact details
            dynaAddClntContWoCP("crtClntWoCPCont","crtClntWoCPDynamic","crtClntWoCPContIndex","", "crtClntWoCPContDel","crtClntWoCPContAdd")
            // add delete event function
            ClntContDel("crtClntWoCPContDel","crtClntWoCPCont")
        }
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault()
            var crtClnt = {};
            crtClnt.clnt = {}
            crtClnt.contact = []
            // crtClnt.add = {}

            crtClnt.clnt.wContPerson = $('#crtClntWoCPTypewContPer').val()
            crtClnt.clnt.clntName = $('#crtClntWoCPLastNm').val() + ", " + $('#crtClntWoCPFistNm').val()
            crtClnt.clnt.fNm = $('#crtClntWoCPFistNm').val() // req
            crtClnt.clnt.lNm = $('#crtClntWoCPLastNm').val() // req

            crtClnt.add = {
                address: $('#crtClntWoCPAdd').val(), // req
                type: $('#crtClntWoCPAddTypeOpt').find(":selected").val()
            }

            if ($('#crtClntWoCPOtherDet').val() != ''){
                crtClnt.clnt.dtls = $('#crtClntWoCPOtherDet').val()
            }

            //for contact
            var temp = ''
            $('.crtClntWoCPContIndex').each(function(i,item){
                switch (i % 2){
                    case 0: 
                        temp = $(item).val()
                        break;
                    case 1:
                        crtClnt.contact.push({
                            contact: temp,
                            type: $(item).val()
                        })
                        break;
                }
            })

            // for type
            crtClnt.type = $('#crtClntWoCPTypeID').val()
            var toastParam = crudiAjax(crtClnt,"/client/WoCP/create","POST")
            toastParam.beforeShow =  function(){
                var pangako = new Promise (function(resolve, reject){
                    crtClntWoCPClear()
                    resolve()
                })
                pangako.then(initialize())
            }
            toaster(toastParam)
        } else {
            isInvalid(e)
        }
    })

    // ============================================================
    // [Create client with contact person] 
    // ============================================================

    // ============================================================
    // [Create client with contact person] 
    // Initialize dynamic adding Click event on "Add another contact details"
    // ============================================================
    $("#crtClntWCPContAdd").on("click", function(){
        //initialize first option list
        // add dynamic contact
        dynaAddClntContWCP("crtClntWCPCont","crtClntWCPDynamic","crtClntWCPContIndex","","" , "crtClntWCPContDel","crtClntWCPContAdd")
        // adding delete event on newly created contact
        ClntContDel("crtClntWCPContDel","crtClntWCPCont")
    })

    // ============================================================
    // [Create client with contact person] 
    // Save client without contact person
    // ============================================================
    $('#crtClntWCP :submit').on('click',function(e){
        // detect if there is no contact person . if not create contact person.
        if ($('.crtClntWCPContIndex').length == 0){
            //add contact details
            dynaAddClntContWCP("crtClntWCPCont","crtClntWCPDynamic","crtClntWCPContIndex","","" , "crtClntWCPContDel","crtClntWCPContAdd")
            // add delete event function
            ClntContDel("crtClntWCPContDel","crtClntWCPCont")
        }
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault()
            var crtClnt = {};
            crtClnt.clnt = {}
            crtClnt.contact = []
            crtClnt.contactPerson = []

            crtClnt.clnt.wContPerson = $('#crtClntWCPTypewContPer').val()
            crtClnt.clnt.clntName = $('#crtClntWCPClntName').val()
            crtClnt.add = {
                address: $('#crtClntWCPAdd').val(), // req
                type: $('#crtClntWCPAddTypeOpt').find(":selected").val()
            }

            if ($('#crtClntWCPOtherDet').val() != ''){
                crtClnt.clnt.dtls = $('#crtClntWCPOtherDet').val()
            }

            //for contact
            var temp = ''
            $('.crtClntWCPContIndex').each(function(i,item){
                switch ((i % 3)*100){
                    case 0: 
                        crtClnt.contactPerson.push({
                            clntName: $(item).val(),
                            isAvatarDefualt: true,
                            avatarDefault: "/public/img/defaultAvatar.png"
                        })
                        break;
                    case 100:
                        temp = $(item).val()
                        break;
                    case 200:
                        crtClnt.contact.push({
                            contact: temp,
                            type: $(item).val()
                        })
                        break;
                }
            })
            // for type
            crtClnt.type = $('#crtClntWCPTypeID').val()
            var toastParam = crudiAjax(crtClnt,"/client/WCP/create","POST")
            toastParam.beforeShow =  function(){
                var pangako = new Promise (function(resolve, reject){
                    crtClntWCPClear()
                    resolve()
                })
                pangako.then(initialize())
            }
            toaster(toastParam)
        } else {
            isInvalid(e)
        }
    })

    // eto baka retain to. kasi eto wala naman ibang data dito na need i process basic delete lng naman to.

    // ============================================================
    // initialize delete client
    // ============================================================
    //initialize delete client 
    $('#tblClntIndex').on( 'click', '.dltClnt', function () {
        $('#dltClntID').val($(this).closest('tr').attr('data-id'))
        $('#dltClntNm').text($(this).closest('tr').attr('data-clntName'))
        $('#dltClntAdd').text($(this).closest('tr').attr('data-add'))
        $('#dltClntType').text($(this).closest('tr').attr('data-type'))
        // clear global delete contact id
        gDltContID = []
        JSON.parse($(this).closest('tr').attr('data-contact')).forEach(function(cont){
            // Initialize contact type
            gDltContID.push(cont._id)
        })
    });
    // ============================================================
    // delete client
    // ============================================================
    //delete client
    $('#dltClnt :submit').on('click', function(e){
        e.preventDefault()
        if ($('#dltClntConfirm').val() === 'DELETE'){
            if ($(this).closest('form').is(':valid') === true){
                var toastParam = {}
                var dltClnt = {id: $('#dltClntID').val()}
                dltClnt.contID = gDltContID
                toastParam = crudiAjax(dltClnt,"/client/delete","DELETE")
                toastParam.beforeShow =  function(){dltClntClear()}
                if($('#id').val()){
                    //view
                    toastParam.text +='. Please wait, you will be redirected to client'
                    toastParam.afterHidden =  function(){window.location.href = '/client'}
                } else {
                    // index
                    toastParam.afterHidden =  function(){initialize()}
                }
                toaster(toastParam)
            } else {
                isInvalid(e)
            }
        } else {
            toaster({
                text:'Delete code not match',
                header:'Delete client',
                icon:'error',
                beforeShow: function(){$('#dltClntConfirm').val('')}
            })
            $('.needs-validation').closest('form').addClass('was-validated');
        }
    })
})
// ============================================================
// initialize data
// ============================================================ 
// create table for index of client
// setting value of global value of contact client list [gClntContType]
function initialize(){
    // identify if if the DOM element exsist
    if ($('#tblClntIndex').length !== 0) {
        var data = crudiAjax('',"/client/ajaxInit/client","GET");
        $("#tblClntIndex").dataTable().fnDestroy();
        var tbody = $('#tblClntIndexBody')
        tbody.html('')
        var edtClnt = ""
        data.foundClient.forEach(function(clnt){
            switch (clnt.wContPerson){
                case true:
                        edtClnt = "WCP"
                    break;
                case false:
                        edtClnt = "WoCP"
                    break;
            }
            tbody.append("<tr data-id='" + clnt._id + "'>\
                <td class='p-1'><a href='/client/" + clnt._id + "'>" + clnt.clntName + "</a></td>\
                <td class='p-1'>[ " + clnt.address[0].type + " ]   " + clnt.address[0].address +  "</td>\
                <td class='p-1'>" + clnt.type[0].ClientType + "</td>\
                <td class='p-1'>\
                    <a href='/client/" + edtClnt + "/edit/" + clnt._id + "' class='btn btn-warning btn-sm' >\
                        <i class='icofont-edit'></i>\
                    </a>\
                    <button class='btn btn-danger dltClnt btn-sm' data-bs-toggle='modal' data-bs-target='#dltClntMod'>\
                        <i class='icofont-ui-delete'></i>\
                    </button>\
                </td>\
            </tr>")
        })
    
        $("#tblClntIndex").dataTable({
            pageLength : 5,
            lengthMenu: [[5, 10, 20, -1], [5, 10, 20,30]],
            responsive: true
        })
        // populating data client contact type and setting it on global variable
        gClntContType = crudiAjax('',"/client/ajaxInit/contType","GET").foundClientContType
        // populating clinet type and set it ot global variable
        gClntType = crudiAjax('',"/client/ajaxInit/clntType","GET").foundClientType
        // populating Address type and set it ot global variable
        gAddType = crudiAjax('',"/client/ajaxInit/addType","GET").foundAddressType
    }
}

// ============================================================
// [Create client functions] w/o contact person clear input
// ============================================================
function crtClntWoCPClear(){
    $('#crtClntWoCP').removeClass("was-validated")
    $('#crtClntWoCPType').val('')
    $('#crtClntWoCPFistNm').val('')
    $('#crtClntWoCPLastNm').val('')
    $('#crtClntWoCPAdd').val('')
    $('#crtClntWoCPOtherDet').val('')
    $('.crtClntWoCPContIndex').val('')
    $('#modCrtClntWoCP').modal('toggle')
    $('.crtClntWoCPDynamic').remove('')
}
// ============================================================
// [Create client functions] with contact person clear input
// ============================================================
function crtClntWCPClear(){
    $('#crtClntWCP').removeClass("was-validated")
    $('#crtClntWCPType').val('')
    $('#crtClntWCPClntName').val('')
    $('#crtClntWCPAdd').val('')
    $('#crtClntWCPOtherDet').val('')
    $('.crtClntWCPContIndex').val('')
    $('#modCrtClntWCP').modal('toggle')
    $('.crtClntWCPDynamic').remove('')
}
// ============================================================
// [Create client functions] Populate contact type
// ============================================================
//populate initial contact type list 
function initClntContType(select){
    //populating contact type
    $('.' + select + '').html('')
    $('.' + select + '').append("<option value=''>Please select contact type</option>")
    gClntContType.forEach(function(conNumType){
        $('.' + select + '').append('<option value='+ conNumType.ClientContType +'>' + conNumType.ClientContType + '</option>')
    })
}
// ============================================================
// [Create client functions] dynamic add contact type
// ============================================================
function dynaAddClntContTempStr(){
    //clear data first
    gdynaAddClntContTempStr = ''
    gdynaAddClntContTempStr = "<option value=''>Please select contact type</option>"
    gClntContType.forEach(function(type){
        gdynaAddClntContTempStr += "<option value='" + type.ClientContType + "'>" + type.ClientContType + "</option>"
    })
}
// ============================================================
// [Create client functions] Initialize Address type
// ============================================================
function dynaAddClntAddTypeTempStr(addTypeOpt){
    // clear data
    $("#" + addTypeOpt + "").html('')
    gAddType.forEach(function(type){
        $("#" + addTypeOpt + "").append("<option value='" + type.type + "'>" + type.type + "</option>")
    })
}
// ============================================================
// [Create client functions] dynamic input of contact details without contact person
// ============================================================
function dynaAddClntContWoCP(clsNm, dynClsNm, dynClsInd, inpVal, delBtn ,insBef){
    $("<div class='input-group input-group-sm my-1 " + clsNm + " " + dynClsNm + "'>\
        <span class='input-group-text col-2 d-flex justify-content-center'>Contact Details</span>\
        <input type='text' class='form-control " + dynClsInd + "' value='" + inpVal + "'' required>\
        <label class='input-group-text col-2 d-flex justify-content-center '>Contact Type</label>\
        <select class='form-select " + dynClsInd + "' required> " + gdynaAddClntContTempStr + "\
        </select>\
        <button class='btn btn-sm btn-danger " + delBtn + "' type='button'>Delete</button> \
    </div>").insertBefore($('#' + insBef + ''))
}
// ============================================================
// [Create client functions] dynamic input of contact details with contact person
// ============================================================
function dynaAddClntContWCP(clsNm, dynClsNm, dynClsInd, inpVal1, inpVal2 , delBtn ,insBef){
    $("<div class='input-group input-group-sm my-1 " + clsNm + " " + dynClsNm + "'>\
        <span class='input-group-text col-2 d-flex justify-content-center'>Contact Person</span>\
        <input type='text' class='form-control " + dynClsInd + "' value='" + inpVal1 + "'' required>\
        <span class='input-group-text col-2 d-flex justify-content-center'>Contact Details</span>\
        <input type='text' class='form-control " + dynClsInd + "' value='" + inpVal2 + "'' required>\
        <label class='input-group-text col-2 d-flex justify-content-center '>Contact Type</label>\
        <select class='form-select " + dynClsInd + "' required> " + gdynaAddClntContTempStr + "\
        </select>\
        <button class='btn btn-sm btn-danger " + delBtn + "' type='button'>Delete</button> \
    </div>").insertBefore($('#' + insBef + ''))
}
// ============================================================
// [Create client functions] Delete click event on dynamic input
// ============================================================
function ClntContDel(onClickButton,rowTable){
    $('.' + onClickButton + '').on("click", function(){
        $(this).closest($('.' + rowTable + '')).remove('')
    })
}
// ============================================================
// [Delete client functions] Delete client clear input
// 
// Note: no validate problem
// ============================================================
// delete client clear input
function dltClntClear(){
    $('#dltClntID').val('')
    $('#dltClntConfirm').val('')
    $('#dltClntMod').modal('toggle')
    $('#dltClntAlert').removeClass('was-validated')
}