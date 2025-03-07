// declaration of global variabl client contact type list
var id                                              = window.location.href.split('/')[window.location.href.split('/').length - 1],
    //client
    gClnt                                           = {},
    gClntType                                       = [],
    gClntContType                                   = [],
    gClntDevType                                    = {},
    gEdtContID                                      = [],
    gDltContID                                      = [],
    gdynaAddClntContTempStr                         = '',
    //device
    gEdtDevID                                       = '',
    gEdtDevTypeID                                   = [],
    gClntDevBrand                                   = {},
    gClntDevPartType                                = {},
    gdynaClntDevTypeTempStr                         = '',
    gdynaClntDevBrandTempStr                        = '',
    gdynaClntDevPartTypeTempStr                     = '';

$(function() {
    initializeView()
    // ============================================================
    // Edit Client Initialize
    // add clear all data on click on close
    // loop and populate all recoverd contact
    // unbind and bind click event on add another contact
    // popluate all data on selected clinet
    // ============================================================ 
    $('#viewClntEdt').on('click', function(){
        if (gClnt.wContPerson){
            // clear first inputed value
            edtClntWCPClear()
            //with contact person
            //input data in edit modal
            $("#edtClntWCPTypeID").val(gClnt._id)//id
            $("#edtClntWCPType").val(gClnt.type[0].ClientType) // client type
            $("#edtClntWCPClntName").val(gClnt.clntName) // first name
            $("#edtClntWCPAdd").val(gClnt.add) //last name
            if (gClnt.dtls){
                $("#edtClntWCPOtherDet").val(gClnt.dtls) // details
            }
            //populate client contact
            gClnt.contact.forEach(function(cont){
                // Initialize contact type
                gdynaAddClntContTempStr = ''
                gdynaAddClntContTempStr += "<option value='" + cont.type + "' selected>" + cont.type + "</option>"
                //saving contact id to find and delete upon clicking save edited
                gEdtContID.push(cont._id)
                dynaEdtClntContTempStr(cont)
                // dynamic add contact on edit without contact
                dynaAddClntContWCP("edtClntWCPCont", "edtClntWCPDynamic", "edtClntWCPContIndex", cont.contPerson, cont.contact, "edtClntWCPContType", "edtClntWCPContDel" ,"edtClntWCPContAdd")
                // add delete function on initialization
                ClntContDel("edtClntWCPContDel","edtClntWCPCont")
            })

            // add event click on add contact 
            // unbind first the event click 
            $("#edtClntWCPContAdd").off('click')
            // add click event for add contact
            $("#edtClntWCPContAdd").on("click", function(){
                // Initialize contact type
                gdynaAddClntContTempStr = ''
                dynaEdtClntContTempStr('')
                dynaAddClntContWCP("edtClntWCPCont", "edtClntWCPDynamic", "edtClntWCPContIndex", "","" ,"edtClntWCPContType", "edtClntWCPContDel" ,"edtClntWCPContAdd")
                //add click event on delete
                ClntContDel("edtClntWCPContDel","edtClntWCPCont")
            })
        } else {
            // clear first inputed value
            edtClntWoCPClear()
            //without contact person
            //input data in edit modal
            $("#edtClntWoCPID").val(gClnt._id)//id
            $("#edtClntWoCPType").val(gClnt.type[0].ClientType) // client type
            $("#edtClntWoCPFistNm").val(gClnt.fNm) // first name
            $("#edtClntWoCPLastNm").val(gClnt.lNm) //last name
            $("#edtClntWoCPAdd").val(gClnt.add) // address
            if (gClnt.dtls){
                $("#edtClntWoCPOtherDet").val(gClnt.dtls) // details
            }

            // create first how many contact to populate
            // and add the contact types and insert it to the dynamic input
            gClnt.contact.forEach(function(cont){
                // Initialize contact type
                gdynaAddClntContTempStr = ''
                gdynaAddClntContTempStr += "<option value='" + cont.type + "' selected>" + cont.type + "</option>"
                //saving contact id to find and delete upon clicking save edited
                gEdtContID.push(cont._id)
                dynaEdtClntContTempStr(cont)
                // dynamic add contact on edit without contact
                dynaAddClntContWoCP("edtClntWoCPCont", "edtClntWoCPDynamic", "edtClntWoCPContIndex", cont.contact, "edtClntWoCPContType", "edtClntWoCPContDel" ,"edtClntWoCPContAdd")
                // add delete function on initialization
                ClntContDel("edtClntWoCPContDel","edtClntWoCPCont")
            })
            // unbind first the event click 
            $("#edtClntWoCPContAdd").off('click')
            // add click event for add contact
            $("#edtClntWoCPContAdd").on("click", function(){
                // Initialize contact type
                gdynaAddClntContTempStr = ''
                dynaEdtClntContTempStr('')
                dynaAddClntContWoCP("edtClntWoCPCont", "edtClntWoCPDynamic", "edtClntWoCPContIndex", "" ,"edtClntWoCPContType", "edtClntWoCPContDel" ,"edtClntWoCPContAdd")
                //add click event on delete
                ClntContDel("edtClntWoCPContDel","edtClntWoCPCont")
            })
        }
    })
    // ============================================================
    // initialize delete client
    // ============================================================
    //initialize delete client 
    $('#viewClntDlt').on( 'click', function () {
        $('#dltClntID').val(gClnt._id)
        $('#dltClntNm').text(gClnt.clntName)
        $('#dltClntAdd').text(gClnt.add)
        $('#dltClntType').text(gClnt.type[0].ClientType)
        // clear global delete contact id
        gDltContID = []
        gClnt.contact.forEach(function(cont){
            // Initialize contact type
            gDltContID.push(cont._id)
        })
    });
    // ============================================================
    // initialize Add Device
    // ============================================================
    $('#viewClntAddDeviceBtn').on( 'click', function () {
        //clear data first
        viewClntAddDeviceClear()
        //populate device type
        deviceTypeOptLstAdd('viewClntAddDeviceType')
        //populate device brand
        deviceBrandOptLstAdd('viewClntAddDeviceBrand')
        //populate part type
        devicePartOptLstAdd()
    });
    // ============================================================
    // initialize Add Device Part SN Button
    // ============================================================
    //add click event on add device part serial
    $('#viewClntAddDeviceAddPartSNBtn').on('click', function(){
        //add dynamic input part serial number
        dynaAddDevType('viewClntAddDevicePartSN','viewClntAddDevicePartSNDynaDel','viewClntAddDevicePartSNIndex','','viewClntAddDevicePartSNDel','viewClntAddDeviceAddPartSNBtn')
        
        // initialize delete button
        devPartDel('viewClntAddDevicePartSNDel','viewClntAddDevicePartSN')
    })
    // ============================================================
    // Create device
    // ============================================================
    $('#viewClntAddDevice :submit').on('click', function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault()

            var clnt = {}
            clnt.device = {}
            clnt.part = []
            clnt.Id = id
            clnt.device.type = $('#viewClntAddDeviceType').val()
            clnt.device.brand = $('#viewClntAddDeviceBrand').val()
            clnt.device.model = $('#viewClntAddDeviceModel').val()
            clnt.device.SN = $('#viewClntAddDeviceSN').val()
            if ($('#viewClntAddDeviceOtherDetails').val()){
                clnt.device.otherDetails = $('#viewClntAddDeviceOtherDetails').val()
            }
            clnt.device.deviceName = clnt.device.type + "/" +  clnt.device.brand + "/" + clnt.device.model

            // identify if the dynamicPartIndex is no value
            if ($('.viewClntAddDevicePartSNIndex').length != 0){
                //for part type 
                var temp = ''
                $('.viewClntAddDevicePartSNIndex').each(function(i,item){
                    switch (i % 2){
                        case 0: 
                            temp = $(item).val()
                            break;
                        case 1:
                            clnt.part.push({
                                type: temp,
                                SN: $(item).val()
                            })
                            break;
                    }
                })
            }
            var toastParam = crudiAjax(clnt,"/client/view/device/create","POST")
            toastParam.beforeShow = function(){viewClntAddDeviceClear()}
            toastParam.afterHidden = function(){initializeView()}
            toaster(toastParam)
        } else {
            isInvalid(e)
        }
    })
    // ============================================================
    // initialize Edit Device
    // ============================================================
    $('#clntViewDevLst').on( 'click', '.edtDev', function () {

        console.log($(this).closest('li').data('id'))
        // // clear first the dynamic input
        // //on close of modal cleaar all data
        // viewClntEdtDeviceClear()  
        // //Populate device data
        // gEdtDevID = $(this).closest('tr').attr('data-id')//deviceEdit id
        // $("#viewClntEdtDeviceModel").val($(this).closest('tr').attr('data-model'))//model
        // $("#viewClntEdtDeviceSN").val($(this).closest('tr').attr('data-SN')) // SN
        // if ($(this).closest('tr').attr('data-otherDetails')){
        //     $("#viewClntEdtDeviceOtherDetails").val($(this).closest( 'tr').attr('data-otherDetails')) // details
        // }

        // // generate type list
        // deviceTypeOptLstEdt($(this).closest('tr').attr('data-type'))
        // // clear option type data
        // $("#viewClntEdtDeviceType").html('')
        // //input data
        // $("#viewClntEdtDeviceType").append(gdynaClntDevTypeTempStr)

        // // generate brand list
        // deviceBrandOptLstEdt($(this).closest('tr').attr('data-brand'))
        // // clear option brand data
        // $("#viewClntEdtDeviceBrand").html('')
        // //input data
        // $("#viewClntEdtDeviceBrand").append(gdynaClntDevBrandTempStr)

        // // check if part is available
        // // clear value gEditDevTypeID
        // gEdtDevTypeID = []
        // if ($(this).closest('tr').attr('data-partSN') !== []){
        //     // create first how many part sn
        //     // and add the part sn and insert it to the dynamic input
        //     JSON.parse($(this).closest('tr').attr('data-partSN')).forEach(function(partSN){
        //         //saving contact id to find and delete upon clicking save edited
        //         gEdtDevTypeID.push(partSN._id)
        //         devicePartOptLstEdt(partSN.type)
        //         // dynamic add contact on edit without contact
        //         dynaAddDevType('viewClntEdtDevicePartSN','viewClntEdtDevicePartSNDynaDel','viewClntEdtDevicePartSNIndex',partSN.SN,'viewClntEdtDevicePartSNDel','viewClntEdtDeviceAddPartSNBtn')
        //         // add delete function on initialization
        //         devPartDel('viewClntEdtDevicePartSNDel','viewClntEdtDevicePartSN')
        //     })
        // }

        // // unbind first the event click 
        // $("#viewClntEdtDeviceAddPartSNBtn").off('click')
        // // add click event for add contact
        // $("#viewClntEdtDeviceAddPartSNBtn").on("click", function(){
        //     // Initialize contact type
        //     devicePartOptLstEdt('')
        //     dynaAddDevType('viewClntEdtDevicePartSN','viewClntEdtDevicePartSNDynaDel','viewClntEdtDevicePartSNIndex','','viewClntEdtDevicePartSNDel','viewClntEdtDeviceAddPartSNBtn')
        //     //add click event on delete
        //     devPartDel('viewClntEdtDevicePartSNDel','viewClntEdtDevicePartSN')
        // })
    });
    // ============================================================
    // Edit device
    // ============================================================
    $('#viewClntEdtDevice :submit').on('click', function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault()
            var device = {}
            device.dev = {}
            device.part = []
            device.partDel = []
            device.partDel = gEdtDevTypeID
            device.Id = gEdtDevID
            device.dev.type = $('#viewClntEdtDeviceType').val()
            device.dev.brand = $('#viewClntEdtDeviceBrand').val()
            device.dev.model = $('#viewClntEdtDeviceModel').val()
            device.dev.SN = $('#viewClntEdtDeviceSN').val()
            if ($('#viewClntEdtDeviceOtherDetails').val()){
                device.dev.otherDetails = $('#viewClntEdtDeviceOtherDetails').val()
            }
            device.dev.deviceName = device.dev.type + "/" +  device.dev.brand + "/" + device.dev.model

            // identify if the dynamicPartIndex is no value
            if ($('.viewClntEdtDevicePartSNIndex').length != 0){
                //for part type 
                var temp = ''
                $('.viewClntEdtDevicePartSNIndex').each(function(i,item){
                    switch (i % 2){
                        case 0: 
                            temp = $(item).val()
                            break;
                        case 1:
                            device.part.push({
                                type: temp,
                                SN: $(item).val()
                            })
                            break;
                    }
                })
            }
            var toastParam = crudiAjax(device,"/client/view/device/edit","PUT")
            toastParam.beforeShow = function(){viewClntEdtDeviceClear()}
            toastParam.afterHidden = function(){initializeView()}
            toaster(toastParam)
        } else {
            isInvalid(e)
        }
    })
    // ============================================================
    // initialize Delete Device
    // ============================================================
    $('#tblClntDeviceLst').on( 'click', '.dltDev', function () {
        
        gEdtDevID = $(this).closest('tr').attr('data-id')
        $('#dltDevType').text($(this).closest('tr').attr('data-type'))
        $('#dltDevBrand').text($(this).closest('tr').attr('data-brand'))
        $('#dltDevModel').text($(this).closest('tr').attr('data-model'))
        $('#dltDevSN').text($(this).closest('tr').attr('data-SN'))

        //Populate device part sn list ids
        gEdtDevTypeID = []
        if ($(this).closest('tr').attr('data-partSN') !== []){
            JSON.parse($(this).closest('tr').attr('data-partSN')).forEach(function(partSN){
                //saving contact id to find and delete upon clicking save edited
                gEdtDevTypeID.push(partSN._id)
            })
        }
    });

    // ============================================================
    // delete device
    // ============================================================
    //delete device
    $('#dltDev :submit').on('click', function(e){
        e.preventDefault()
        if ($('#dltDevConfirm').val() === 'DELETE'){
            if ($(this).closest('form').is(':valid') === true){
                var del = {}
                del.clntID = id
                del.devID = gEdtDevID
                del.devPartID = gEdtDevTypeID

                flash(crudiAjax(del,"/client/view/device/delete","delete"))
            }
        } else {
            flash({flash: 'error', message: "Delete code not match" })
            dltDevClear()
            $('.needs-validation').closest('form').addClass('was-validated');
        }
    })
})

//initialize data
function initializeView(){
    //get client info 
    gClnt = crudiAjax(id,"/client/view/ajaxInit","POST").foundClient
    console.log(gClnt)
    $('#viewClntNm').text(gClnt.clntName) //header client name

    // group contact details
    // remove un neccessary data in contact
    const mapClntContact = gClnt.contact.map(({ _id, __v, ...rest }) => rest);
    const redClntCont = mapClntContact.reduce((acc, { contact, type }) => {
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(contact);
        return acc;
    }, {});
    
    for (let contact in redClntCont) {
        $("#viewClntContact").append("<strong>" + contact + "</strong>")
        redClntCont[contact].forEach(function(cont){
            $("#viewClntContact").append("<p class='m-0'>" + cont + "</p>")
        })
    }

    // populate contact address
    gClnt.address.forEach(function(add){
        $('#viewClntAddress').append("<p class='m-0'>" + add.address + "</p> <span>" + add.type + "</span>")
    })

    //inserting profile picture
    if (gClnt.isAvatarDefault){
        $("#viewClntAvatar").attr('src',gClnt.avatarDefault)
    } else {
        $("#viewClntAvatar").attr('src',"../../../../" +  gClnt.avatar[0].destination + "/" + gClnt.avatar[0].filename)
    }
    // initialize edit link
    if (gClnt.wContPerson){
        $('#viewClntEdit').attr('href','/client/WCP/edit/' + gClnt._id)
    } else {
        $('#viewClntEdit').attr('href','/client/WoCP/edit/' + gClnt._id)
    }
    
    // populating device list
    // clear html
    $('#viewClntDevTableBody').html('')
    gClnt.device.forEach(function(dev){
        $('#viewClntDevTableBody').append("<td>" + dev + "</td>")
    })

    // populating data client contact type and setting it on global variable
    gClntContType = crudiAjax('',"/client/ajaxInit/contType","GET").foundClientContType
    // populating clinet type and set it ot global variable
    gClntType = crudiAjax('',"/client/ajaxInit/clntType","GET").foundClientType
    // populating client device type
    gClntDevType = crudiAjax('',"/client/view/device/ajaxInit/type","GET").foundDeviceType
    // populating client deivce brand
    gClntDevBrand = crudiAjax('',"/client/view/device/ajaxInit/brand","GET").foundDeviceBrand
    // populating client device part type
    gClntDevPartType = crudiAjax('',"/client/view/device/ajaxInit/partType","GET").foundDevicePartType
    
}

// ============================================================
//  option list for device type
// ============================================================
// add
function deviceTypeOptLstAdd(devtypeOpt){
    //clear data first
    $('#' + devtypeOpt + '').html('')
    //initial value 
    $('#' + devtypeOpt + '').append("<option value=''>Please select device type</option>")
    gClntDevType.foundClientDeviceType.forEach(function(type){
        $('#' + devtypeOpt + '').append("<option value='" + type.deviceType + "'>" + type.deviceType + "</option>")
    })
}
//edit
function deviceTypeOptLstEdt(devType){
    // clear string fist
    gdynaClntDevTypeTempStr = ''
    gdynaClntDevTypeTempStr = "<option value='" + devType + "'>" + devType + "</option>"
    gClntDevType.foundClientDeviceType.forEach(function(type){
        if (type.deviceType !== devType){
            gdynaClntDevTypeTempStr += "<option value='" + type.deviceType + "'>" + type.deviceType + "</option>"
        }
    })
}
// ============================================================
//  option list for device brand
// ============================================================
//add
function deviceBrandOptLstAdd(devBrandOpt){
    //clear data first
    $('#' + devBrandOpt + '').html('')
    $('#' + devBrandOpt + '').append("<option value=''>Please select device brand</option>")
    gClntDevBrand.foundClientDeviceBrand.forEach(function(brand){
        $('#' + devBrandOpt + '').append("<option value='" + brand.deviceBrand + "'>" + brand.deviceBrand + "</option>")
    })
}
//edit
function deviceBrandOptLstEdt(devBrand){
    // clear string fist
    gdynaClntDevBrandTempStr = ''
    gdynaClntDevBrandTempStr = "<option value='" + devBrand + "'>" + devBrand + "</option>"
    gClntDevBrand.foundClientDeviceBrand.forEach(function(brand){
        if (brand.deviceBrand !== devBrand){
            gdynaClntDevBrandTempStr += "<option value='" + brand.deviceBrand + "'>" + brand.deviceBrand + "</option>"
        }
    })
}
// ============================================================
// dynamic input of option list for part type
// ============================================================
//for add Part type
function devicePartOptLstAdd(){
    //clear data first
    gdynaClntDevPartTypeTempStr = ''
    gdynaClntDevPartTypeTempStr += "<option value=''>Please select Part Type</option>"
    gClntDevPartType.foundClientDevicePartType.forEach(function(partType){
        gdynaClntDevPartTypeTempStr += "<option value='" + partType.partType + "'>" + partType.partType + "</option>"
    })
}

// for edit part
function devicePartOptLstEdt(partType){
    if (partType == ''){
        gdynaClntDevPartTypeTempStr = "<option value=''>Please select contact type</option>"
    } else {
        gdynaClntDevPartTypeTempStr = "<option value='" + partType + "'>" + partType + "</option>"
    }
    gClntDevPartType.foundClientDevicePartType.forEach(function(part){
        if (part.partType !== partType){
            gdynaClntDevPartTypeTempStr += "<option value='" + part.partType + "'>" + part.partType + "</option>"
        }
    })
}
// ============================================================
// Clear data in create device
// ============================================================
//add
function viewClntAddDeviceClear (){
    $('#viewClntAddDevice').removeClass("was-validated")
    $('#viewClntAddDeviceType').val('')
    $('#viewClntAddDeviceBrand').val('')
    $('#viewClntAddDeviceModel').val('')
    $('#viewClntAddDeviceSN').val('')
    $('#viewClntAddDeviceOtherDetails').val('')
    $('.viewClntAddDevicePartSN').remove('')
    $('#modViewClntAddDevice').modal('toggle')
}
// edit
function viewClntEdtDeviceClear (){
    $('#viewClntEdtDevice').removeClass("was-validated")
    $('#viewClntEdtDeviceType').val('')
    $('#viewClntEdtDeviceBrand').val('')
    $('#viewClntEdtDeviceModel').val('')
    $('#viewClntEdtDeviceSN').val('')
    $('#viewClntEdtDeviceOtherDetails').val('')
    $('.viewClntEdtDevicePartSN').remove('')
    $('#modViewClntEdtDevice').modal('toggle')
}

// ============================================================
// delete click event on dynamic input of part type sn
// ============================================================
function devPartDel(onClickButton,rowTable){
    $('.' + onClickButton + '').on("click", function(){
        $(this).closest($('.' + rowTable + '')).remove('')
    })
}
// ============================================================
// Delete client clear input
// was validated problem
// ============================================================
// delete client clear input
function dltDevClear(){
    $('#dltDevType').text('')
    $('#dltDevBrand').text('')
    $('#dltDevModel').text('')
    $('#dltDevSN').text('')

    $('#dltDevConfirm').val('')
    $('#dltDev').removeClass('was-validated')
    $('#modViewClntDltDevice').modal('toggle')
}

// ============================================================
// dynamic input of device type
// ============================================================
function dynaAddDevType(clsNm, dynClsNm, dynClsInd, inpVal1 ,delBtn ,insBef){
    $("<div class='input-group input-group-sm " + clsNm + " " + dynClsNm + " mt-1'> \
        <label class='input-group-text col-2 d-flex justify-content-center'>Part Type</label>\
        <select class='form-select " + dynClsInd + "' required> " + gdynaClntDevPartTypeTempStr + "\
        </select>\
        <span class='input-group-text col-2 d-flex justify-content-center'>SN</span> \
        <input type='text' class='form-control " + dynClsInd + "' value='" + inpVal1 + "' required> \
        <button class='btn btn-sm btn-danger " + delBtn + "' type='button'>Delete</button> \
    </div>").insertBefore($('#' + insBef + ''))
}