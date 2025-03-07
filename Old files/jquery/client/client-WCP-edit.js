var gClntId                                             = window.location.href.split('/')[window.location.href.split('/').length - 1]
    gClnt                                               = {},
    gClntAddType                                        = [],
    gGender                                             = [],
    gClntContType                                       = [],
    gdynaEdtClntAddTypeTempStr                          = "",
    gdynaEdtClntContTypeTempStr                         = "";

$(function() {
    initialize()
    // image preview avatar 
    $('#edtClntWCPAvatarImg').on('click', function(){
        $("#imgPreview").attr('src',$(this).attr('src'))
    })

    // add contact address
    $('#edtClntWCPAddressAdd').on('click', function(){
        dynaAddEditClntAdd(
            "edtClntWCPAddress", // delete address via class name
            "edtClntWCPAddressInd", // get value via index
            "", // value of address
            "edtClntWCPAddressDel", // delete button
            $("#edtClntWCPAddressAdd") // insert before add address
        )
        // add delete function on client address
        dynaAddEditClntDelClass('edtClntWCPAddressDel','edtClntWCPAddress')
    })
    
    // add contact person 
    $('#edtClntWCPContPerAdd').on('click', function(){
        var pangakoContPerContDetails = dynaAddEditClntContPerInitAddressAndContact(
            [], // contact array
            gClntContType, // contact type list
            "edtClntWCPContPerContact", // class name 
            "edtClntWCPContPerContInd", // contact info index
            "edtClntWCPContPerContDel", // delete button
            [], // address array
            gClntAddType, // address type list
            "edtClntWCPContPerAddress", //  class name
            "edtClntWCPContPerAddressInd", // address info index
            "edtClntWCPContPerAddressDel" //  delete button
        )
        pangakoContPerContDetails.then(function(contAddressStr){
            dynaAddEditClntContPerInitAdd(
                "edtClntWCPContPer", // class name - edtClntWCPContPer - delAllClsNm
                "edtClntWCPContPerDel", // delete button - edtClntWCPContPerDel - delBtn
                "edtClntWCPContPerAvatarImg", // contact person image - edtClntWCPContPerAvatarImg - contPerAvatar
                "/public/img/defaultAvatar.png", // contact person image src val - contPerAvatarSrcVal
                "edtClntWCPContPerNm", // contact name - edtClntWCPContPerNm - contPerNm
                '', // contact name value
                "edtClntWCPContPerGender", // gender - edtClntWCPContPerGender - contPerGender
                "edtClntWCPContPerCitizenship", // citizenship - edtClntWCPContPerCitizenship - contPerCitizen
                "edtClntWCPContPerOtherDet", // other Details - edtClntWCPContPerOtherDet - contPerDetails
                contAddressStr.contact, // contact details str
                contAddressStr.address, // address details str
                "edtClntWCPContPerAdd" // insert before - edtClntWCPContPerAdd - insBef
            )
            //address
            $('.edtClntWCPContPerAddressAdd').off('click')
            $('.edtClntWCPContPerAddressAdd').on('click', function(){
                dynaAddEdtClntAddTypeTempStr('')
                dynaAddEditClntAdd(
                    "edtClntWCPContPerAddress",
                    "edtClntWCPContPerAddressInd",
                    '',
                    "edtClntWCPContPerAddressDel",
                    $(this)
                )
                dynaAddEditClntDelClass('edtClntWCPContPerAddressDel','edtClntWCPContPerAddress')
            })
            // delete listener
            dynaAddEditClntDelClass('edtClntWCPContPerAddressDel','edtClntWCPContPerAddress')
            // contact
            $('.edtClntWCPContPerContDetails').off('click')
            $('.edtClntWCPContPerContDetails').on('click', function(){
                dynaEdtClntContTypeTempStr('')
                dynaAddEditClntCont(
                    "edtClntWCPContPerContact",
                    "edtClntWCPContPerContInd", // contact info index
                    "edtClntWCPContPerContDel", // delete button
                    $(this)
                )
                dynaAddEditClntDelClass('edtClntWCPContPerContDel','edtClntWCPContPerContact')
            })
            // delete listener
            dynaAddEditClntDelClass('edtClntWCPContPerContDel','edtClntWCPContPerContact')
            // contact person
            dynaAddEditClntDelClass('edtClntWCPContPerDel','edtClntWCPContPer')
        })
    })

    // input file on change view images (client)
    $("[name='edtClntWCPAvatarFile']").on("change",function(){
        $('#edtClntWCPAvatarImg').attr('src', URL.createObjectURL($(this)[0].files[0]))
        $('#avatarViewImg').attr('src', URL.createObjectURL($(this)[0].files[0]))
    })

    // update info
    $('#edtClntWCP :submit').on('click', function(e){
        e.preventDefault()
        // validation
        // var pangakoNoAddress = new Promise(function(resolve,reject){
        //     // detect if there is no address . if not create address.
        //     if ($('.edtClntAddDel').length == 0){
        //         dynaEdtClntAddTypeTempStr('')
        //         dynaAddEditClntAdd("edtClntAddDel","edtClntAddress","","edtClntAddDelBtn","edtClntWoCPAddressAdd")
        //         dynaEditEdtClntDel("edtClntAddDelBtn","edtClntAddDel")
        //         reject()
        //     } else {
        //         resolve()
        //     }
        // })
        // var pangakoNoContact = new Promise (function(resolve,reject){
        //     // detect if there is no contact person . if not create contact person.
        //     if ($('.edtClntContDel').length == 0){
        //         dynaEdtClntContTypeTempStr('')
        //         dynaAddEditClntCont("edtClntContDel","edtClntContact","","edtClntContDelBtn","edtClntWoCPContAdd")
        //         dynaEditEdtClntDel("edtClntContDelBtn","edtClntContDel")
        //         reject()
        //     } else {
        //         resolve()
        //     }
        // })

        // var pangakoDefaultAddress = new Promise(function(resolve, reject){
        //     // detcts if there is no default address or multiple default 
        //     var selLength = $(".edtClntAddDel option:selected[value='Default']").length
        //     // clear all invalid and duplicated default
        //     $(this).closest('.edtClntAddDel').children('select').removeClass("border-danger")
        //     $(this).closest('.edtClntAddDel').children('select').removeClass("is-invalid")
        //     switch (true){
        //         case (selLength > 1):
        //             // multiple default address
        //             $(".edtClntAddDel option:selected[value='Default']").each(function(){
        //                 $(this).closest('.edtClntAddDel').children('select').addClass("border-danger")
        //                 $(this).closest('.edtClntAddDel').children('select').addClass("is-invalid")
        //             })
        //             reject()
        //             break;
        //         case (selLength == 0):
        //             $(".edtClntAddDel").each(function(){
        //                 $(this).closest('.edtClntAddDel').children('select').addClass("border-danger")
        //                 $(this).closest('.edtClntAddDel').children('select').addClass("is-invalid")
        //             })
        //             reject()
        //             break;
        //         case (selLength == 1):
        //             // if only one default address
        //             $(".edtClntAddDel").each(function(){
        //                 $(this).closest('.edtClntAddDel').children('select').removeClass("border-danger")
        //                 $(this).closest('.edtClntAddDel').children('select').removeClass("is-invalid")
        //             })
        //             resolve()
        //             break;
        //     }
        // })
        // NOTE : mag lagay ka nag notification na bawal magkaroon ng same file name sa images mo . 
        // kasi naka tag sya as file name pag dating sa db
        var formData = new FormData($('#edtClntWCP').closest('form')[0]);
        var edtClnt = {}
        edtClnt.clntAddress = []
        edtClnt.delClntAddress = []
        edtClnt.delClntContPerson = []
        if ($("#edtClntWCP").closest('form').is(':valid') === true){
            // collect all the data to be deleted (address)
            gClnt.address.forEach(function(add){
                edtClnt.delClntAddress.push(add._id)
            })
            // collect all the data to be deleted (contact person)
            gClnt.contactPerson.forEach(function(contPer){
                edtClnt.delClntContPerson.push(contPer._id)
            })

            // populating data
            edtClnt.id = gClntId // client id

            //client information
            edtClnt.clnt = {
                clntName: $('#edtClntWCPNm').val(),
                tempFileIndex: 1 // indexing address
            }
            // if isAvatarDefualt is true 
            // identify if the file input file has files
            if (!$("#edtClntWCPAvatarFile")[0].files.length == 0){
                edtClnt.clnt.tempAvatarFileName = $("#edtClntWCPAvatarFile")[0].files[0].name
                edtClnt.clnt.isAvatarDefualt = false
            }

            // details
            if ($('#edtClntWCPOtherDet').val()){
                edtClnt.clnt.dtls = $('#edtClntWCPOtherDet').val()
            }
            // client address
            var tempAdd
            $('.edtClntWCPAddressInd').each(function(i){
                switch (i % 2){
                    case 0: 
                        tempAdd = $(this).val()
                        break;
                    case 1:
                        edtClnt.clntAddress.push({
                            address: tempAdd,
                            type: $(this).val(),
                            tempFileIndex: 1
                        })
                        break;
                }
            })

            // contact person 
            edtClnt.contPerson = []
            edtClnt.contPersonContact = []
            edtClnt.contPersonAddress = []

            $('.edtClntWCPContPer').each(function(i){
                
                let contPerData = {
                    tempFileIndex: i + 100,
                    clntName : $(this).find('.edtClntWCPContPerNm').val(),
                    gender: $(this).find('.edtClntWCPContPerGender').val(),
                    citizenship: $(this).find('.edtClntWCPContPerCitizenship').val(),
                    dtls: $(this).find('.edtClntWCPContPerOtherDet').val(),
                }
                // identify if the file input file has files
                if (!$(this).find('.edtClntWCPContPerAvatarFile')[0].files.length == 0){
                    contPerData.tempAvatarFileName = $(this).find('.edtClntWCPContPerAvatarFile')[0].files[0].name
                    contPerData.isAvatarDefualt = false
                    contPerData.avatarDefault = "/public/img/defaultAvatar.png"
                } else {
                    // reset back the default values of avatar if isAvatarDefault is true else it will not overwrite
                    if (gClnt.contactPerson[i].isAvatarDefualt){
                        contPerData.isAvatarDefualt = true
                        contPerData.avatarDefault = "/public/img/defaultAvatar.png"
                    }
                }

                var tempCont
                var tempCont2 = []
                // contact person contact get data
                $(this).find('.edtClntWCPContPerContInd').each(function(iContact){
                    switch (iContact % 2){
                        case 0: 
                            tempCont = $(this).val()
                            break;
                        case 1:
                            tempCont2.push({
                                contact: tempCont,
                                type: $(this).val(),
                                tempFileIndex: i + 100
                            })
                            break;
                    }
                })
                edtClnt.contPersonContact.push(tempCont2)
                // contact person address get data
                var tempAdd
                var tempAdd2 = []
                $(this).find('.edtClntWCPContPerAddressInd').each(function(iAddress){
                    switch (iAddress % 2){
                        case 0: 
                        tempAdd = $(this).val()
                            break;
                        case 1:
                            tempAdd2.push({
                                address: tempAdd,
                                type: $(this).val(),
                                tempFileIndex: i + 100
                            })
                            break;
                    }
                })
                edtClnt.contPersonAddress.push(tempAdd2)
                edtClnt.contPerson.push(contPerData)
            })
            console.log(edtClnt)
            edtClnt = JSON.stringify(edtClnt)
            formData.append('edtClnt' ,edtClnt)
            $.ajax({
                type: "POST",
                url: "/client/WCP/edit",
                data: formData,
                processData: false,
                contentType: false,
                success: function(res){
                    toaster({
                        text:res.text,
                        header:res.header,
                        icon:res.icon,
                        afterHidden: function(){
                            //go back to previous page
                            self.location=document.referrer
                        }
                    })
                },
                error: function (e) {
                    console.log("some error", e);
                }
            });
        } else {
            isInvalid(e)
        }
    })
})

function initialize(){
    // populate data of client
    gClnt = crudiAjax(gClntId,"/client/WCP/ajaxInit/edit","POST").foundClient
    console.dir(gClnt)
    // populate data of address type
    gClntAddType = crudiAjax('',"/client/ajaxInit/addType","GET").foundAddressType
    // populate data of contact type
    gClntContType = crudiAjax('',"/client/ajaxInit/contType","GET").foundClientContType
    // populate data of gender
    gGender = crudiAjax('',"/client/ajaxInit/gender","GET").foundGender
    // if the client is on default image format
    if (gClnt.isAvatarDefualt){
        $('#edtClntWCPAvatarImg').attr('src',gClnt.avatarDefault)
    } else {
        $('#edtClntWCPAvatarImg').attr('src',"../../../../"+ gClnt.avatar[0].destination + "/" + gClnt.avatar[0].filename)
    }
    // populate data
    $('#edtClntWCPType').val(gClnt.type[0].ClientType)
    $('#edtClntWCPNm').val(gClnt.clntName)
    if (gClnt.dtls){$('#edtClntWCPOtherDet').val(gClnt.dtls)} // details

    // address populate data client 
    gClnt.address.forEach(function(add){
        dynaAddEdtClntAddTypeTempStr(add.type)
        dynaAddEditClntAdd("edtClntWCPAddress","edtClntWCPAddressInd",add.address,"edtClntWCPAddressDel",$("#edtClntWCPAddressAdd"))
    })
    // add delete function on client address
    dynaAddEditClntDelClass('edtClntWCPAddressDel','edtClntWCPAddress')

    // populate contact person initialize
    gClnt.contactPerson.forEach(function(contPer){
        if (contPer.isAvatarDefualt == true){
            var pangakoContPerContDetails = dynaAddEditClntContPerInitGenderAddressAndContact(
                contPer.gender, // contact person gender detail
                gGender, // contact person gender (array)
                contPer.contact, // contact array
                gClntContType, // contact type list
                "edtClntWCPContPerContact", // class name 
                "edtClntWCPContPerContInd", // contact info index
                "edtClntWCPContPerContDel", // delete button
                contPer.address, // address array
                gClntAddType, // address type list
                "edtClntWCPContPerAddress", //  class name
                "edtClntWCPContPerAddressInd", // address info index
                "edtClntWCPContPerAddressDel" //  delete button
            )
            pangakoContPerContDetails.then(function(contAddressStr){
                dynaAddEditClntContPerInitAdd(
                    "edtClntWCPContPer", // class name - edtClntWCPContPer - delAllClsNm
                    "edtClntWCPContPerDel", // delete button - edtClntWCPContPerDel - delBtn
                    "edtClntWCPContPerAvatarImg", // contact person image - edtClntWCPContPerAvatarImg - contPerAvatar
                    contPer.avatarDefault, // contact person image src val - contPerAvatarSrcVal
                    "edtClntWCPContPerNm", // contact name - edtClntWCPContPerNm - contPerNm
                    contPer.clntName, // contact name value
                    contAddressStr.gender, // gender - edtClntWCPContPerGender - contPerGender
                    contPer.citizenship, // citizenship - edtClntWCPContPerCitizenship - contPerCitizen
                    contPer.dtls, // other Details - edtClntWCPContPerOtherDet - contPerDetails
                    contAddressStr.contact, // contact details str
                    contAddressStr.address, // address details str
                    "edtClntWCPContPerAdd" // insert before - edtClntWCPContPerAdd - insBef
                )
                //address add listener
                $('.edtClntWCPContPerAddressAdd').off('click')
                $('.edtClntWCPContPerAddressAdd').on('click', function(){
                    dynaAddEdtClntAddTypeTempStr('')
                    dynaAddEditClntAdd(
                        "edtClntWCPContPerAddress",
                        "edtClntWCPContPerAddressInd",
                        '',
                        "edtClntWCPContPerAddressDel",
                        $(this)
                    )
                    dynaAddEditClntDelClass('edtClntWCPContPerAddressDel','edtClntWCPContPerAddress')
                })
                // delete listener
                dynaAddEditClntDelClass('edtClntWCPContPerAddressDel','edtClntWCPContPerAddress')
                // contact
                $('.edtClntWCPContPerContDetails').off('click')
                $('.edtClntWCPContPerContDetails').on('click', function(){
                    dynaEdtClntContTypeTempStr('')
                    dynaAddEditClntCont(
                        "edtClntWCPContPerContact",
                        "edtClntWCPContPerContInd", // contact info index
                        "edtClntWCPContPerContDel", // delete button
                        $(this)
                    )
                    dynaAddEditClntDelClass('edtClntWCPContPerContDel','edtClntWCPContPerContact')
                })
                // delete listener
                dynaAddEditClntDelClass('edtClntWCPContPerContDel','edtClntWCPContPerContact')
                // contact person
                dynaAddEditClntDelClass('edtClntWCPContPerDel','edtClntWCPContPer')
                // image preview
                // input file on change view images (client)
                $(".edtClntWCPContPerAvatarFile").off('change')
                $(".edtClntWCPContPerAvatarFile").on("change",function(){
                    $(this).closest(".edtClntWCPContPer").find('.edtClntWCPContPerAvatarImg').attr('src', URL.createObjectURL($(this)[0].files[0]))
                })
                // avatar click
                $(".img-thumbnail").off('click')
                $(".img-thumbnail").on('click', function(){
                    $('#imgPreview').attr('src', $(this).attr('src'))
                })
            })
        }
    })
}

// dynamic add client contact person (initialize)
function dynaAddEditClntContPerInitAdd(
    contPerDel, // delete contact person via class name
    contPerDelBtn, // delete button for contact person
    contPerAvatar, // conact person image
    contPerAvatarSrcVal, // contact person image src value
    contPerNm, // contact person name
    contPerNmVal, //  contact person name value
    contPerGender, // contact person gender
    contPerCitizen, // contact person citzenship
    contPerDetails, // contact person details
    contactTempStr, // contact person contact details string
    addressTempStr, // contact person address details string
    insBef // insert befor the button add contact person
    ){
    $("<div class='card card-body p-1 my-1 mt-3 shadow p-3 mb-5 bg-white " + contPerDel + "'>\
        <div class='row'>\
            <div class='d-flex flex-row-reverse'>\
                <a class='btn btn-danger btn-sm " + contPerDelBtn + "'>Delete</a>\
            </div>\
            <div class='col-3'>\
                <img class='img-thumbnail " + contPerAvatar + "' style='width: 100%; height: 15rem;' data-bs-toggle='modal' data-bs-target='#modImgPreview' src='" + contPerAvatarSrcVal + "'>\
            </div>\
            <div class='col-9'>\
                <div class='input-group input-group-sm my-1'>\
                    <span class='input-group-text col-2 d-flex justify-content-center'>Profile Picture</span>\
                    <input type='file' class='form-control edtClntWCPContPerAvatarFile' name='edtClntWCPContPerAvatarFile'>\
                </div>\
                <div class='input-group input-group-sm my-1'>\
                    <span class='input-group-text col-2 d-flex justify-content-center'>Contact Name</span>\
                    <input type='text' class='form-control " + contPerNm + "' value='" + contPerNmVal + "' required>\
                </div>\
                <div class='input-group input-group-sm my-1'>\
                    <span class='input-group-text col-2 d-flex justify-content-center'>Gender</span>\
                    <select class='form-select edtClntWCPContPerGender'> " + contPerGender + "\
                    </select>\
                    <span class='input-group-text col-2 d-flex justify-content-center'>Citizenship</span>\
                    <input type='text' value='" + contPerCitizen + "' class='form-control w-25 edtClntWCPContPerCitizenship'>\
                </div>\
                <div class='input-group input-group-sm my-1'>\
                    <span class='input-group-text col-2 justify-content-center'>Other Details</span>\
                    <textarea class='form-control edtClntWCPContPerOtherDet'>" + contPerDetails + "</textarea>\
                </div>\
                <div class='card card-body my-1'> "+ contactTempStr +" \
                    <a class='edtClntWCPContPerContDetails btn btn-primary btn-sm d-flex justify-content-center mt-2'>Create additional Contact Details</a>\
                </div>\
                <div class='card card-body my-1'> " + addressTempStr + "\
                    <a class='edtClntWCPContPerAddressAdd btn btn-primary btn-sm d-flex justify-content-center mt-2'>Create additional Address</a>\
                </div>\
            </div>\
        </div>\
    </div>").insertBefore($("#" + insBef + ""))
}
// dynamic add client contact person address and contact details (initialize)
async function dynaAddEditClntContPerInitGenderAddressAndContact(
    genderDet, // contact person gender detail
    genderArray, // contact person gender (array)
    contDetArray, // contact person contact details
    contTypeArray,  // list of contact detail (array)
    delAllCont, // for delete using class name for contact
    dynaClsContactInd, // indexing for retriving data of contact
    delContBtn, // class name for delete button of contact
    addressDetArray, // contact person address details
    addressTypeArray, // list of address details (array)
    delAllAdd, // for delete using class name for address
    dynaClsAddressInd, // indexing for retriving data for address
    delAddressBtn, // class name for delete button of address
    ){
    
    var genderTempString = ''
    var contTempString = ''
    var contTypeStr = ''
    var addressTempString = ''
    var addressTypeStr = ''
    // for gender
    if (genderDet){
        await genderArray.forEach(function(gender){
            if (gender.gender !== genderDet){
                genderTempString += "<option value='" + gender.gender + "'>" + gender.gender + "</option>"
            } else {
                genderTempString += "<option value='" + gender.gender + "' selected>" + gender.gender + "</option>"
            }
        })
    }
    // for contacts
    if (contDetArray){
        await contDetArray.forEach(function(contDet){
            contTypeArray.forEach(function(cont){
                if (cont.ClientContType !== contDet.type){
                    contTypeStr += "<option value='" + cont.ClientContType + "'>" + cont.ClientContType + "</option>"
                } else {
                    contTypeStr += "<option value='" + cont.ClientContType + "' selected>" + cont.ClientContType + "</option>"
                }
            })
    
            contTempString += "<div class='input-group input-group-sm my-1 " + delAllCont + "'>\
                <span class='input-group-text col-2 d-flex justify-content-center'>Contact Details</span>\
                <input type='text' class='form-control " + dynaClsContactInd + "' value='" + contDet.contact + "' required>\
                <label class='input-group-text col-1 d-flex justify-content-center'>Type</label>\
                <select class='form-select " + dynaClsContactInd + "' required> " + contTypeStr + "\
                </select>\
                <button class='btn btn-sm btn-danger " + delContBtn + "' type='button'>Delete</button>\
            </div>"
        })
    }
    // for address
    if (addressDetArray){
        await addressDetArray.forEach(function(addDet){
            addressTypeArray.forEach(function(add){
                if (addDet.type !== add.type){
                    addressTypeStr += "<option value='" + add.type + "'>" + add.type + "</option>"
                } else {
                    addressTypeStr += "<option value='" + add.type + "' selected>" + add.type + "</option>"
                }
            })

            addressTempString += "<div class='input-group input-group-sm my-1 " + delAllAdd + "'>\
                <span class='input-group-text col-2 d-flex justify-content-center'>Address</span>\
                <input type='text' class='form-control  w-50 " + dynaClsAddressInd + "'  value='" + addDet.address + "' required>\
                <label class='input-group-text col-1 d-flex justify-content-center'>Type</label>\
                <select class='form-select " + dynaClsAddressInd + "' required> " + addressTypeStr + "\
                </select>\
                <button class='btn btn-sm btn-danger " + delAddressBtn + "' type='button'>Delete</button>\
            </div>"


        })
    }
    var genderContAddTempString = { 
        contact: contTempString,
        address: addressTempString,
        gender: genderTempString
    }
    return genderContAddTempString
}

// delete dynamic input data
function dynaAddEditClntDelClass (onClickButton,rowTable){
    $('.' + onClickButton + '').off('click') // remove click event
    $('.' + onClickButton + '').on("click", function(){
        $(this).closest($('.' + rowTable + '')).remove('')
    })
}
// dynamic add client address
function dynaAddEditClntAdd(
    delAllClsNm, // for delete via class name
    dynaClsInd, // get data via index
    addVal, // value of address
    delBtn, // delete class
    insBef // insert before add address
    ){
    $("<div class='input-group input-group-sm my-1 " + delAllClsNm + " '>\
        <span class='input-group-text col-2 d-flex justify-content-center'>Address</span>\
        <input type='text' class='form-control w-50 " + dynaClsInd + "' value='" + addVal + "' required>\
        <label class='input-group-text col-1 d-flex justify-content-center'>Type</label>\
        <select class='form-select " + dynaClsInd + "' required>" + gdynaEdtClntAddTypeTempStr + "\
        </select>\
        <button class='btn btn-sm btn-danger " + delBtn + "' type='button'>Delete</button>\
        <div class='invalid-feedback'>Please check if the following address has one default or no empty fields</div>\
    </div>").insertBefore(insBef)
}

// dynamic add client address type option value
function dynaAddEdtClntAddTypeTempStr(type){
    if (type){
        gdynaEdtClntAddTypeTempStr = "<option value='" + type + "'>" + type + "</option>"
    } else {
        gdynaEdtClntAddTypeTempStr = "<option value=''>Please select contact type</option>"
    }

    //clear data first
    gClntAddType.forEach(function(add){
        if (add.type !== type){
            gdynaEdtClntAddTypeTempStr += "<option value='" + add.type + "'>" + add.type + "</option>"
        }
    })
}

// dynamic add client contact details
function dynaAddEditClntCont(
    delAllClsNm, // for delete via class name
    dynaClsInd, // get data via index
    delBtn, // delete class
    insBef // insert before add address
    ){
    $("<div class='input-group input-group-sm my-1 " + delAllClsNm + "'>\
        <span class='input-group-text col-2 d-flex justify-content-center'>Contact Details</span>\
        <input type='text' class='form-control " + dynaClsInd + "' required>\
        <label class='input-group-text col-2 d-flex justify-content-center'>Contact Type</label>\
        <select class='form-select " + dynaClsInd + "' required> " + gdynaEdtClntContTypeTempStr + "\
        </select>\
        <button class='btn btn-sm btn-danger " + delBtn + "' type='button'>Delete</button> \
    </div>").insertBefore(insBef)
}

// dynamic add client contact type option value
function dynaEdtClntContTypeTempStr(type){
    if (type){
        gdynaEdtClntContTypeTempStr = "<option value='" + type + "'>" + type + "</option>"
    } else {
        gdynaEdtClntContTypeTempStr = "<option value=''>Please select contact type</option>"
    }

    //clear data first
    gClntContType.forEach(function(cont){
        if (cont.ClientContType !== type){
            gdynaEdtClntContTypeTempStr += "<option value='" + cont.ClientContType + "'>" + cont.ClientContType + "</option>"
        }
    })
}