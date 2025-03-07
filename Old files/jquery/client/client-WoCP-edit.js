var gClntId                                             = window.location.href.split('/')[window.location.href.split('/').length - 1]
    gClnt                                               = {},
    gClntAddType                                        = [],
    gClntContType                                       = [],
    gdynaEdtClntAddTypeTempStr                          = "",
    gdynaEdtClntContTypeTempStr                         = "";

$(function() {
    initialize()
    // click event for add address
    $('#edtClntWoCPAddressAdd').on('click', function(){
        dynaEdtClntAddTypeTempStr('')
        dynaAddEditClntAdd("edtClntAddDel","edtClntAddress","","edtClntAddDelBtn","edtClntWoCPAddressAdd")
        dynaEditEdtClntDel("edtClntAddDelBtn","edtClntAddDel")
    })
    // click event for add contact
    $('#edtClntWoCPContAdd').on('click', function(){
        dynaEdtClntContTypeTempStr('')
        dynaAddEditClntCont("edtClntContDel","edtClntContact","","edtClntContDelBtn","edtClntWoCPContAdd")
        dynaEditEdtClntDel("edtClntContDelBtn","edtClntContDel")
    })
    // change avatar change event
    // input file on change view images
    $("[name='edtClntWoCPAvatarFile']").on("change",function(){
        $('#edtClntWoCPAvatarImg').attr('src', URL.createObjectURL($(this)[0].files[0]))
        $('#avatarViewImg').attr('src', URL.createObjectURL($(this)[0].files[0]))
    })
    // image preview
    $('#edtClntWoCPAvatarImg').on('click', function(){
        $("#imgPreview").attr('src',$(this).attr('src'))
    })

    // cancel click
    $('#edtClntWoCPCancel').on('click', function(){
        //go back to previous page
        self.location=document.referrer
    })
    // update client
    $('#edtClntWoCP :submit').on('click',function(e){
        e.preventDefault()
        var pangakoNoAddress = new Promise(function(resolve,reject){
            // detect if there is no address . if not create address.
            if ($('.edtClntAddDel').length == 0){
                dynaEdtClntAddTypeTempStr('')
                dynaAddEditClntAdd("edtClntAddDel","edtClntAddress","","edtClntAddDelBtn","edtClntWoCPAddressAdd")
                dynaEditEdtClntDel("edtClntAddDelBtn","edtClntAddDel")
                reject()
            } else {
                resolve()
            }
        })
        var pangakoNoContact = new Promise (function(resolve,reject){
            // detect if there is no contact person . if not create contact person.
            if ($('.edtClntContDel').length == 0){
                dynaEdtClntContTypeTempStr('')
                dynaAddEditClntCont("edtClntContDel","edtClntContact","","edtClntContDelBtn","edtClntWoCPContAdd")
                dynaEditEdtClntDel("edtClntContDelBtn","edtClntContDel")
                reject()
            } else {
                resolve()
            }
        })

        var pangakoDefaultAddress = new Promise(function(resolve, reject){
            // detcts if there is no default address or multiple default 
            var selLength = $(".edtClntAddDel option:selected[value='Default']").length
            // clear all invalid and duplicated default
            $(this).closest('.edtClntAddDel').children('select').removeClass("border-danger")
            $(this).closest('.edtClntAddDel').children('select').removeClass("is-invalid")
            switch (true){
                case (selLength > 1):
                    // multiple default address
                    $(".edtClntAddDel option:selected[value='Default']").each(function(){
                        $(this).closest('.edtClntAddDel').children('select').addClass("border-danger")
                        $(this).closest('.edtClntAddDel').children('select').addClass("is-invalid")
                    })
                    reject()
                    break;
                case (selLength == 0):
                    $(".edtClntAddDel").each(function(){
                        $(this).closest('.edtClntAddDel').children('select').addClass("border-danger")
                        $(this).closest('.edtClntAddDel').children('select').addClass("is-invalid")
                    })
                    reject()
                    break;
                case (selLength == 1):
                    // if only one default address
                    $(".edtClntAddDel").each(function(){
                        $(this).closest('.edtClntAddDel').children('select').removeClass("border-danger")
                        $(this).closest('.edtClntAddDel').children('select').removeClass("is-invalid")
                    })
                    resolve()
                    break;
            }
        })

        Promise.all([
            pangakoNoAddress,
            pangakoNoContact,
            pangakoDefaultAddress
        ]).then(function(){
            if ($("#edtClntWoCP").closest('form').is(':valid') === true){
                var formData = new FormData($('#edtClntWoCP').closest('form')[0]);
                var edtClnt = {};
                edtClnt.clnt = {}
                edtClnt.contact = []
                edtClnt.address = []
                // populate list of ids to be deleted associated with the client (contact)
                edtClnt.delContact = []
                gClnt.contact.forEach(function(cont){
                    edtClnt.delContact.push(cont._id)
                })
                // populate list of ids to be deleted associated with the client (address)
                edtClnt.delAddress = []
                gClnt.address.forEach(function(add){
                    edtClnt.delAddress.push(add._id)
                })
                // if isAvatarDefualt is true 
                if (!gClnt.isAvatarDefualt){
                    edtClnt.delAvatar = gClnt.avatar[0].filename
                }
                // setting value of the collected id and delete eventualy upon edit send
    
                // populating data
                edtClnt.id = gClntId // client id
                // client middle name
                if ($('#edtClntWoCPMidNm').val()){
                    edtClnt.clnt.clntName = $('#edtClntWoCPLastNm').val() + ", " + $('#edtClntWoCPFistNm').val()
                } else {
                    edtClnt.clnt.clntName = $('#edtClntWoCPLastNm').val() + ", " + $('#edtClntWoCPFistNm').val() + " " + $('#edtClntWoCPMidNm').val()
                }
    
                edtClnt.clnt.fNm = $('#edtClntWoCPFistNm').val() // req
                edtClnt.clnt.lNm = $('#edtClntWoCPLastNm').val() // req
    
                // middle name
                if ($('#edtClntWoCPMidNm').val()){
                    edtClnt.clnt.mNm = $('#edtClntWoCPMidNm').val()
                }
                // client details
                if ($('#edtClntWoCPOtherDet').val()){
                    edtClnt.clnt.dtls = $('#edtClntWoCPOtherDet').val()
                }
                // gender
                if ($('#edtClntWoCPGender').val()){
                    edtClnt.clnt.gender = $('#edtClntWoCPGender :selected').val()
                }
                // citizenship
                if ($('#edtClntWoCPCitizenship').val()){
                    edtClnt.clnt.citizenship = $('#edtClntWoCPCitizenship').val()
                }
                // avatar
                if ($("[name='edtClntWoCPAvatarFile']")[0].files[0]){
                    edtClnt.clnt.isAvatarDefualt = false
                }
                // for address
                var tempAdd
                $('.edtClntAddress').each(function(i,item){
                    switch (i % 2){
                        case 0: 
                            tempAdd = $(item).val()
                            break;
                        case 1:
                            edtClnt.address.push({
                                address: tempAdd,
                                type: $(item).val()
                            })
                            break;
                    }
                })
                //for contact
                var tempCont = ''
                $('.edtClntContact').each(function(i,item){
                    switch (i % 2){
                        case 0: 
                            tempCont = $(item).val()
                            break;
                        case 1:
                            edtClnt.contact.push({
                                contact: tempCont,
                                type: $(item).val()
                            })
                            break;
                    }
                })
                edtClnt = JSON.stringify(edtClnt)
                formData.append('edtClnt' ,edtClnt)
                $.ajax({
                    type: "POST",
                    url: "/client/WoCP/edit",
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
        }).catch(function(){
            isInvalid(e)
        })
    })
})

function initialize(){
    // populate data of client
    gClnt = crudiAjax(gClntId,"/client/WoCP/ajaxInit/edit","POST").foundClient
    // populate data of address type
    gClntAddType = crudiAjax('',"/client/ajaxInit/addType","GET").foundAddressType
    // populate data of contact type
    gClntContType = crudiAjax('',"/client/ajaxInit/contType","GET").foundClientContType
    // populate data
    // if the client is on default image format
    if (gClnt.isAvatarDefualt){
        $('#edtClntWoCPAvatarImg').attr('src',gClnt.avatarDefault)
    } else {
        $('#edtClntWoCPAvatarImg').attr('src',"../../../../"+ gClnt.avatar[0].destination + "/" + gClnt.avatar[0].filename)
    }

    $('#edtClntWoCPType').val(gClnt.type[0].ClientType) //client type
    $('#edtClntWoCPFistNm').val(gClnt.fNm) //first name
    $('#edtClntWoCPLastNm').val(gClnt.lNm) //last name
    if (gClnt.mNm){$('#edtClntWoCPMidNm').val(gClnt.mNm)} //middle name
    if (gClnt.gender){$('#edtClntWoCPGender').val(gClnt.gender)} // gender for checking pa to
    if (gClnt.citizenship){$('#edtClntWoCPCitizenship').val(gClnt.citizenship)} // citizenship
    if (gClnt.dtls){$('#edtClntWoCPOtherDet').val(gClnt.dtls)} // details
    
    // address populate data
    gClnt.address.forEach(function(add){
        dynaEdtClntAddTypeTempStr(add.type)
        dynaAddEditClntAdd("edtClntAddDel","edtClntAddress",add.address,"edtClntAddDelBtn","edtClntWoCPAddressAdd")
    })
    // add delete click event on address
    dynaEditEdtClntDel("edtClntAddDelBtn","edtClntAddDel")
    // contact populate data
    gClnt.contact.forEach(function(cont){
        dynaEdtClntContTypeTempStr(cont.type)
        dynaAddEditClntCont("edtClntContDel","edtClntContact",cont.contact,"edtClntContDelBtn","edtClntWoCPContAdd")
    })
    // add delete click event on contact 
    dynaEditEdtClntDel("edtClntContDelBtn","edtClntContDel")
}

// dynamic add client address
function dynaAddEditClntAdd(delAllClsNm, dynaClsInd, addVal ,delBtn,insBef ) {
    $("<div class='input-group input-group-sm my-1 " + delAllClsNm + " '>\
        <span class='input-group-text col-2 d-flex justify-content-center'>Address</span>\
        <input type='text' class='form-control w-50 " + dynaClsInd + "' value='" + addVal + "' required>\
        <label class='input-group-text col-1 d-flex justify-content-center'>Type</label>\
        <select class='form-select " + dynaClsInd + "' required>" + gdynaEdtClntAddTypeTempStr + "\
        </select>\
        <button class='btn btn-sm btn-danger " + delBtn + "' type='button'>Delete</button>\
        <div class='invalid-feedback'>Please check if the following address has one default or no empty fields</div>\
    </div>").insertBefore($("#" + insBef + ""))
}

// dynamic add client address type option value
function dynaEdtClntAddTypeTempStr(type){
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
function dynaAddEditClntCont(delAllClsNm, dynaClsInd, contVal, delBtn, insBef){
    $("<div class='input-group input-group-sm my-1 " + delAllClsNm + "'>\
        <span class='input-group-text col-2 d-flex justify-content-center'>Contact Details</span>\
        <input type='text' class='form-control " + dynaClsInd + "' value='" + contVal + "' required>\
        <label class='input-group-text col-2 d-flex justify-content-center'>Contact Type</label>\
        <select class='form-select " + dynaClsInd + "' required> " + gdynaEdtClntContTypeTempStr + "\
        </select>\
        <button class='btn btn-sm btn-danger " + delBtn + "' type='button'>Delete</button> \
    </div>").insertBefore($("#" + insBef + ""))
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
// delete dynamic input data
function dynaEditEdtClntDel(onClickButton,rowTable){
    $('.' + onClickButton + '').on("click", function(){
        $(this).closest($('.' + rowTable + '')).remove('')
    })
}