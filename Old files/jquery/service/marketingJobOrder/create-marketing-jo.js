var serviceType                         = JSON.parse($("#serviceType").val()),
    gClient                             = [],
    gClntLstTempStr                     = '',
    gDraftMatTempStr                    = '';
    

$(document).ready(function() {
    var clntIndex
    var clnt
    var devIndex
    initialize()

    //fill up the client data
    $('#crtJoRepClntFind').on('click', function(){
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
    })
    
    // on select on device
    $('#crtJoRepDevNm').on('change',function(){
        devIndex = $(this).find(':selected').data("index")
        $('#crtJoRepDevType').val(clnt.device[devIndex].type)
        $('#crtJoRepDevBrand').val(clnt.device[devIndex].brand)
        $('#crtJoRepDevModel').val(clnt.device[devIndex].model)
        $('#crtJoRepDevSN').val(clnt.device[devIndex].SN)
    })

    // add draft material
    $('#crtJoRepSvcsAddDraftMat').on('click',function(){
        // add dynamic add draft material
        dynaAddClntContWoCP("crtJoRepSvcsDraftMatCont", "crtJoRepSvcsDraftMat", "crtJoRepSvcsDraftMatDel" ,"crtJoRepSvcsAddDraftMat")
        // add event handler on delete
        crtJoRepDynaAddDraftMatDel('crtJoRepSvcsDraftMatDel','crtJoRepSvcsDraftMatCont')
    })

    // create job order
    $("#crtJoRep").on('submit',function (e) {
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
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
                            window.location = "/service/jo"
                        }
                    })
                },
                error: function (e) {
                    console.log("some error", e);
                }
            });
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

function dynaAddClntContWoCP(clsNm, dynClsInd, delBtn ,insBef){
    $("<div class='input-group input-group-sm my-1 " + clsNm + "'>\
            <span class='input-group-text col-3 justify-content-center'>Draft Material</span>\
            <input class='form-control " + dynClsInd + "' required></input>\
            <button class='btn btn-danger " + delBtn + "'>Delete</button>\
        </div>").insertBefore($("#" + insBef + ""));
}