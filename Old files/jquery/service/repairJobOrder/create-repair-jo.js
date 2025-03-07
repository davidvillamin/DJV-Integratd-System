var serviceType                         = JSON.parse($("#serviceType").val()),
    gClient                             = [],
    gClntLstTempStr                     = '',
    gDraftMatTempStr                    = '',
    dt                                  = new DataTransfer();

$(document).ready(function() {
    var clntIndex
    var clnt
    var devIndex
    initialize()

    //fill up the client data
    $('#crtJoRepClntFind').on('click', function(e){
        if ($('#crtJoRepClntNm').val() !== ''){
            // get index
            clntIndex = gClient.findIndex(clnt => clnt.clntName === $('#crtJoRepClntNm').val())
            clnt = gClient[clntIndex]
            // populate client
            $('#crtJoRepClntType').val(clnt.type[0].ClientType)
            $('#crtJoRepClntAdd').val(clnt.add)
    
            // populate device
            $('#crtJoRepDevNm').append("<option value=''>Please Select Device</option>")
            clnt.device.forEach(function(dev, index){
                $('#crtJoRepDevNm').append("<option data-index='" + index + "'>" + dev.deviceName + "</option>")
            })
            $('#crtJoRepClntNm').css('border-color','')
            // remove disable to device list
            $('#crtJoRepDevNm').prop('disabled',false)
        } else {
            $('#crtJoRepClntNm').css('border-color','#dc3545')
            toaster({
                text: 'Please fill up Client Name',
                header: 'Find Client',
                icon: 'error'
            })
        }
    })
    
    // on select on device
    $('#crtJoRepDevNm').on('change',function(){
        devIndex = $(this).find(':selected').data("index")
        $('#crtJoRepDevType').val(clnt.device[devIndex].type)
        $('#crtJoRepDevBrand').val(clnt.device[devIndex].brand)
        $('#crtJoRepDevModel').val(clnt.device[devIndex].model)
        $('#crtJoRepDevSN').val(clnt.device[devIndex].SN)

        // remove disabled property in service fill up
        $('#crtJoRepSvcsRecvBy').prop('disabled',false)
        $('#crtJoRepSvcsRecvDate').prop('disabled',false)
        $('#crtJoRepSvcsTrouble').prop('disabled',false)
        $('#crtJoRepSvcsCharge').prop('disabled',false)
        $("[name='crtJoRepSvcsTroubleFile']").prop('disabled',false)
    })

    // input file on change view images
    $("[name='crtJoRepSvcsTroubleFile']").on("change",function(){
        for (let i = 0; i < $(this)[0].files.length; i++) {
            // add data on dataTransfer
            dt.items.add($(this)[0].files[i])

            // identify if what kind of file
            switch ($(this)[0].files[i].type.split("/")[0]){
                case "video":
                    $('#crtJoRepSvcsTroubleFileView').children($('div .row')).append("<div class='crtJoRepSvcsTroubleFileView col-4 position-relative my-1'>\
                            <div class='d-flex align-items-end justify-content-end' style='heigth: 100px'>\
                                <video class='w-100 h-100' data-ind='" + i + "' src=''>\
                                <div>\
                                    <button style='z-index: 1' data-name='" + $(this)[0].files[i].name + "' class='crtJoRepSvcsTroubleFileDel position-absolute btn btn-danger py-1'><i class='icofont-ui-delete'></i></button>\
                                </div>\
                            </div>\
                        </div>")
                    $("video[data-ind='" + i + "']").attr('src', URL.createObjectURL($(this)[0].files[i]))
                    break;
                case "image":
                    $('#crtJoRepSvcsTroubleFileView').children($('div .row')).append("<div class='crtJoRepSvcsTroubleFileView col-2 position-relative my-1'>\
                            <div class='d-flex align-items-end justify-content-end' style='height: 100px'>\
                                <img class='w-100 h-100 img-thumbnail' data-ind='" + i + "' src=''>\
                                <a data-name='" + $(this)[0].files[i].name + "' class='crtJoRepSvcsTroubleFileDel position-absolute btn btn-danger py-1'><i class='icofont-ui-delete'></i></a>\
                            </div>\
                        </div>")
                    $("img[data-ind='" + i + "']").attr('src', URL.createObjectURL($(this)[0].files[i]))
                    break;
            }
        }
        // update file using dt files
        this.files = dt.files;
        // add delete button listener
        $('.crtJoRepSvcsTroubleFileDel').on('click',function(){
            //remove image
            $(this).closest($('.crtJoRepSvcsTroubleFileView')).remove()
            // find the file using name
            for(let i = 0; i < dt.items.length; i++){
                if($(this).data('name') === dt.items[i].getAsFile().name){
                    dt.items.remove(i);
                    continue;
                }
            }
            $("[name='crtJoRepSvcsTroubleFile']")[0].files = dt.files;
        })

    })
    // add draft material
    $('#crtJoRepSvcsAddDraftMat').on('click',function(){
        // add dynamic add draft material
        dynaAddDraftMat("crtJoRepSvcsDraftMatCont", "crtJoRepSvcsDraftMat", "crtJoRepSvcsDraftMatDel" ,"crtJoRepSvcsAddDraftMat")
        // add event handler on delete
        crtJoRepDynaAddDraftMatDel('crtJoRepSvcsDraftMatDel','crtJoRepSvcsDraftMatCont')
    })

    // create job order
    $("#crtJoRep").on('submit',function (e) {
        e.preventDefault();
        if ($(this).closest('form').is(':valid') === true){
            var formData = new FormData(this);
            formData.append('clntId',clnt._id)
            formData.append('devId' ,clnt.device[devIndex]._id)
            formData.append('typeId' ,serviceType._id)
            formData.append('dateRecieve' ,moment($('#crtJoRepSvcsRecvDate').val()).format("YYYYMMDD"))
            
            var jo = {
                status: "Pending",
                custody: "On-Hand",
                recievedBy: $('#crtJoRepSvcsRecvBy').val(),
                dateRecieve: $('#crtJoRepSvcsRecvDate').val(),
                trouble: $('#crtJoRepSvcsTrouble').val(),
                serviceCharge: $('#crtJoRepSvcsCharge').val(),
            }

            // populate draft material
            jo.draftMat = []
            if ($('.crtJoRepSvcsDraftMat').length !== 0){
                $('.crtJoRepSvcsDraftMat').each(function(i,item){
                    jo.draftMat.push($(item).val())
                })
            }
            
            jo = JSON.stringify(jo)
            formData.append('jo' ,jo)

            $.ajax({
                type: "POST",
                url: "/service/repair/jo/create",
                data: formData,
                processData: false,
                contentType: false,
                success: function(res){
                    toaster({
                        text:res.text,
                        header:res.header,
                        icon:res.icon,
                        afterHidden: function(){
                            window.location = "/service/repair/jo"
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
    });

})
function initialize(){
    // populate service type
    $('#crtJoRepSvcsCat').val(serviceType.category)
    $('#crtJoRepSvcsType').val(serviceType.type)
    $('#crtJoRepSvcsTicket').val(serviceType.wTicket)

    // populate all client
    gClient = crudiAjax('',"/client/ajaxInit/client","POST").foundClient;
    // clear client list
    $('#crtJoRepClntLst').html('')
    gClient.forEach(function(clnt){
        $('#crtJoRepClntLst').append("<option data-id='" + clnt._id + "' value=" + JSON.stringify(clnt.clntName) + "></option>")
    })
}

// ============================================================
// delete click event on dynamic draft material 
// ============================================================
function crtJoRepDynaAddDraftMatDel(onClickButton,rowTable){
    $('.' + onClickButton + '').on("click", function(){
        $(this).closest($('.' + rowTable + '')).remove('')
    })
}

// ============================================================
// dynamic input of draft material
// ============================================================

function dynaAddDraftMat(clsNm, dynClsInd, delBtn ,insBef){
    $("<div class='input-group input-group-sm my-1 " + clsNm + "'>\
            <span class='input-group-text col-3 justify-content-center'>Draft Material</span>\
            <input class='form-control " + dynClsInd + "' required></input>\
            <button class='btn btn-danger " + delBtn + "'>Delete</button>\
        </div>").insertBefore($("#" + insBef + ""));
}