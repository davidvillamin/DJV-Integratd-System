var repJo                               = JSON.parse($("#repJo").val()),
    gToubleDocDelTemp                   = [],
    dt                                  = new DataTransfer();

$(function() {
    initialize()

    //save edit job order
    $('#edtRepJo :submit').on('click', function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault()
            var formData = new FormData($(this).closest('form')[0]);
            formData.append('joId',repJo._id)

            var jo = {
                recievedBy: $('#edtJoRepSvcsRecvBy').val(),
                dateRecieve: $('#edtJoRepSvcsRecvDate').val(),
                trouble: $('#edtJoRepSvcsTrouble').val(),
                serviceCharge: $('#edtJoRepSvcsCharge').val(),
            }

            // populate draft material
            jo.draftMat = []
            if ($('.edtJoRepSvcsDraftMat').length !== 0){
                $('.edtJoRepSvcsDraftMat').each(function(i,item){
                    jo.draftMat.push($(item).val())
                })
            }
            
            jo = JSON.stringify(jo)
            formData.append('jo' ,jo)
            // for delete trouble image
            formData.append("imgDel",gToubleDocDelTemp)
            $.ajax({
                type: "PUT",
                url: "/service/repair/jo/edit",
                data: formData,
                processData: false,
                contentType: false,
                async: false,
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
    })
})

function initialize(){
    $('#edtRepJoClntNm').val(repJo.client[0].clntName)
    $('#edtRepJoDevNm').val(repJo.clientDevice[0].deviceName)
    $('#edtJoRepSvcsJoNum').val(repJo.joNum)
    $('#edtJoRepSvcsCat').val(repJo.serviceType[0].category)
    $('#edtJoRepSvcsType').val(repJo.serviceType[0].type)
    $('#edtJoRepSvcsTicket').val(repJo.serviceType[0].wTicket)
    $('#edtJoRepSvcsRecvBy').val(repJo.recievedBy)
    $('#edtJoRepSvcsRecvDate').val(moment(repJo.dateRecieve).format('YYYY-MM-DD'))
    $('#edtJoRepSvcsTrouble').val(repJo.trouble)
    $('#edtJoRepSvcsCharge').val(repJo.serviceCharge)

    // populating first the data of job order
    // trouble docu input files
    if (repJo.troubleFile !== []){
        repJo.troubleFile.forEach(function(file){
            dynaAddImgInputEdit("edtJoRepSvcsTroubleFileView","edtJoRepSvcsTroubleFileView" ,file._id, "edtJoRepSvcsTroubleFileDel", "../../../../"+ file.destination + "/" + file.filename)
        })
    }
     // draft material
     if (repJo.draftMat.length !== 0){
        repJo.draftMat.forEach(function(mat){
            dynaAddDraftMatEdit("edtJoRepSvcsDraftMatCont","edtJoRepSvcsDraftMat",mat,"edtJoRepSvcsDraftMatDel","edtJoRepSvcsAddDraftMat")
        })
    }
    // ==================================================================
    // add event listener

    // input files on change
    // para magkaroon din ng delete function ung newly added na files
    $("[name='edtJoRepSvcsTroubleFile']").on('change', function(){
        for (let i = 0; i < $(this)[0].files.length; i++) {
            dt.items.add($(this)[0].files[i])
            dynaAddImgInputEdit("edtJoRepSvcsTroubleFileView","edtJoRepSvcsTroubleFileView" , $(this)[0].files[i].name,"edtJoRepSvcsTroubleFileDel",URL.createObjectURL($(this)[0].files[i]))
        }
        this.files = dt.files;
        // add delete button listener
        $('.edtJoRepSvcsTroubleFileDel').off('click') // reset click event
        edtJoRepDynaImgDel("edtJoRepSvcsTroubleFileDel","edtJoRepSvcsTroubleFileView","edtJoRepSvcsTroubleFile")
    })
    // add event listener on add draft material
    // para magkaroon ng delete function ung newly added na draft material
    $('#edtJoRepSvcsAddDraftMat').on('click',function(){
        dynaAddDraftMatEdit("edtJoRepSvcsDraftMatCont","edtJoRepSvcsDraftMat","","edtJoRepSvcsDraftMatDel","edtJoRepSvcsAddDraftMat")
        $('.edtJoRepSvcsDraftMatDel').off('click')// reset click event
        edtJoRepDynaDraftMatDel("edtJoRepSvcsDraftMatDel","edtJoRepSvcsDraftMatCont")
    })
    
    // add delete button listener
    // eto ung initial na event listener for input files
    // kung hindi naman ng click si user ng input file
    // $('.edtJoRepSvcsTroubleFileDel').off('click') // reset click event
    edtJoRepDynaImgDel("edtJoRepSvcsTroubleFileDel","edtJoRepSvcsTroubleFileView","edtJoRepSvcsTroubleFile")

    // delete mat draft event listener
    // eto ung intial event listener for delete draft material
    // kung hindi naman ng click si user ng add draft material
    // $('.edtJoRepSvcsAddDraftMat').off('click') //  reset click event
    edtJoRepDynaDraftMatDel("edtJoRepSvcsDraftMatDel","edtJoRepSvcsDraftMatCont")
}

// ============================================================
// Clear data on edit modal
// ============================================================
function edtJoRepClearMod(){
    $('#edtRepJo').removeClass("was-validated")
    $('#edtRepJoClntNm').val('')
    $('#edtRepJoDevNm').val('')
    $('#edtJoRepSvcsJoNum').val('')
    $('#edtJoRepSvcsCat').val('')
    $('#edtJoRepSvcsType').val('')
    $('#edtJoRepSvcsTicket').val('')
    $('#edtJoRepSvcsRecvBy').val('')
    $('#edtJoRepSvcsRecvDate').val('')
    $('#edtJoRepSvcsTrouble').val('')
    // $("input[name='edtJoRepSvcsTroubleFile']").val('')
    $('#edtJoRepSvcsCharge').val('')
    $('.edtJoRepSvcsTroubleFileView').remove('')
    $('.edtJoRepSvcsDraftMatCont').remove('')
    $('#edtRepJoMod').modal('toggle')
}
// ============================================================
// delete click event on dynamic created draft material
// ============================================================
function edtJoRepDynaDraftMatDel(onClickButton,rowTable){
    $('.' + onClickButton + '').on("click", function(){
        $(this).closest($('.' + rowTable + '')).remove('')
    })
}
// ============================================================
// delete click event on dynamic created image
// ============================================================
function edtJoRepDynaImgDel(onClickButton,rowTable,inputFile){
    $('.' + onClickButton + '').on('click',function(){
        //remove image
        $(this).closest($('.' + rowTable + '')).remove()
        var troubleFileDel = $(this).data('name')
        // find the file using name
        var imgFromDB = undefined
        var tempProm = new Promise(function(resolve,reject){
            imgFromDB = 0
            if (dt.items.length !== 0) {
                for(let i = 0; i < dt.items.length; i++){
                    if(troubleFileDel === dt.items[i].getAsFile().name){
                        dt.items.remove(i);
                        imgFromDB = 1
                        $("[name='" + inputFile + "'")[0].files = dt.files;
                        resolve(imgFromDB)
                        break;
                    } 
                }
            } 
            resolve(imgFromDB)
        })
        tempProm.then(function(imgFromDB){
            if (imgFromDB === 0){
                gToubleDocDelTemp.push(troubleFileDel)
            }
        })
    })
}
// ============================================================
// dynamic input of draft material
// ============================================================
function dynaAddDraftMatEdit(clsNm, dynClsInd,val1, delBtn ,insBef){
    $("<div class='input-group input-group-sm my-1 " + clsNm + "'>\
            <span class='input-group-text col-3 justify-content-center'>Draft Material</span>\
            <input class='form-control " + dynClsInd + "' value='" + val1 + "' required></input>\
            <a class='btn btn-danger " + delBtn + "'>Delete</a>\
        </div>").insertBefore($("#" + insBef + ""));
}
// ============================================================
// dynamic input of image on input file
// ============================================================
function dynaAddImgInputEdit(onClickButton,clsNm , imgName ,delBtn, imgFile){
    $("#" + onClickButton).children($('div .row')).append("<div class='" + clsNm + " col-2 position-relative my-1'>\
        <div class='d-flex align-items-end justify-content-end' style='height: 100px'>\
            <img class='w-100 h-100 img-thumbnail' data-ind='" + imgName + "' src=''>\
            <a data-name='" + imgName + "' class='" + delBtn + " position-absolute btn btn-danger py-1'><i class='icofont-ui-delete'></i></a>\
        </div>\
    </div>")
    $("img[data-ind='" + imgName + "']").attr('src', imgFile)
}