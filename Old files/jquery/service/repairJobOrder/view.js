var jo                                  = {},
    joId                                ="",
    dt                                  = new DataTransfer();
$(function(){
    initialize()

    // add repair status
    $("#joViewRepStatAddBtn").on('click',function(){
        $(" <form id='joViewRepStatAdd' class='needs-validation' novalidate enctype='multipart/form-data'>\
            <div class='border rounded-3'>\
                <div class='vstack gap-1 p-2'>\
                    <div class='input-group input-group-sm'>\
                        <span class='input-group-text col-2 d-flex justify-content-center' id='joViewRepStatAddStatLbl'>Status</span>\
                        <textarea class='form-control' id='joViewRepStatAddStat' aria-describedby='joViewRepStatAddStatLbl' required></textarea>\
                    </div>\
                    <div class='input-group input-group-sm'>\
                        <input type='file' class='form-control' name='joViewRepStatAddFile' accept='image/png, image/gif, image/jpeg' multiple>\
                        <span class='input-group-text' id='joViewRepStatAddTechLbl'>Tech</span>\
                        <input type='text' class='form-control' id='joViewRepStatAddTech' aria-describedby='joViewRepStatAddTechLbl' required>\
                    </div>\
                    <div class='d-flex justify-content-end hstack gap-1'>\
                        <button id='joViewRepStatAddCancel' class='btn btn-sm btn-secondary'>Cancel</button>\
                        <button type='submit' class='btn btn-sm btn-success'>Save</button>\
                    </div>\
                </div>\
            </div>\
        </form>").insertBefore($("#joViewRepStatAddBtn"));
        $('#joViewRepStatAddBtn').attr( "disabled", "disabled" )
        // add listening attribute on cancel
        $('#joViewRepStatAddCancel').on('click',function(e){
            e.preventDefault()
            // clear data
            $('#joViewRepStatAdd').remove()
            $('#joViewRepStatAddBtn').removeAttr("disabled")
            // enable add repair button
        })
        // save status
        $('#joViewRepStatAdd').on('submit', function(e){
            e.preventDefault()
            if ($(this).closest('form').is(':valid') === true){
                var formData = new FormData($(this).closest('form')[0]);
                var report = {
                    report: $('#joViewRepStatAddStat').val(),
                    tech: $('#joViewRepStatAddTech').val(),
                    date: moment()
                }
                formData.append('report', JSON.stringify(report))
                formData.append('joId', joId)
                $.ajax({
                    type: "PUT",
                    url: "/service/repair/jo/repStat",
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
                                window.location.reload()
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
})

function initialize(){
    joId = window.location.href.split('/')[window.location.href.split('/').length - 1]
    jo = crudiAjax(joId,"/service/repair/jo/ajaxInit/view","post").foundJo
    // populate data
    $('#joViewJoNum').html('JO Number: ' + jo.joNum)
    $('#joViewClntNm').text(jo.client[0].clntName)
    $('#joViewClntDev').text(jo.clientDevice[0].deviceName)
    $('#joViewRecievedDate').text(moment(jo.dateRecieve).format('MMM DD YYYY (dddd)'))
    $('#joViewRecievedBy').text(jo.recievedBy)
    $('#joViewServiceCharge').text(new Intl.NumberFormat("en-US", { style: 'currency', currency: 'PHP' }).format(jo.serviceCharge))
    $('#joViewCat').text(jo.serviceType[0].category)
    $('#joViewType').text(jo.serviceType[0].type)
    $('#joViewWTicket').text(jo.serviceType[0].wTicket)
    // Draft material
    if (jo.draftMat.length == 0){
        $( "#joViewDraftMat" ).append( "No draft Matrial available" );
    } else {
        jo.draftMat.forEach(function(mat,i){
            $( "#joViewDraftMat" ).append(i+1+ ". " + mat + "<br>");
        })
    }
    //trouble file
    $('#joViewTrouble').text(jo.trouble)
    if (jo.troubleFile.length == 0){
        $('#joViewTroubleFile').append('No file available')
    } else {
        jo.troubleFile.forEach(function(file){
            $('#joViewTroubleFile').append("<img data-destination='" + file.destination + "'\
                data-filename='" + file.filename + "' style='height: 100px; width: 100px;' class='joViewFileImg img-thumbnail' src=" + "../../../../"+ file.destination + "/" + file.filename + " \
                data-bs-toggle='modal' data-bs-target='#joViewImgMod'>")
        })
    }

    //repair status
    if (jo.statusReport.length == 0){
        $('#joViewTblTbody').append("<tr><td class='p-1'></td>\
        <td class='p-1'>No report available</td>\
        <td class='p-1'></td></tr>")
    } else {
        console.log(jo.statusReport)
        jo.statusReport.forEach(function(report){
            var imgStr = ''
            if (report.statusReportFile.length !== 0){
                imgStr += "<div class='hstack gap-3 overflow-auto'>"
                report.statusReportFile.forEach(function(fileImg){
                    imgStr += "<img data-destination='" + fileImg.destination + "' data-filename='" + fileImg.filename + "' style='height: 100px; width: 100px;' class='joViewFileImg img-thumbnail' data-bs-toggle='modal' data-bs-target='#joViewImgMod' src=" + "../../../../"+ fileImg.destination + "/" + fileImg.filename + " >"
                })
                imgStr += "</div>"

                // append data
                $('#joViewTblTbody').append("<tr class='border-top'>\
                <th class='p-1' rowspan='2'>" + moment(report.date).format('MMM DD YY') + "</th>\
                <td class='p-1 text-wrap'>" + report.report + "</td>\
                <td class='p-1'>" + report.tech + "</td>\
                <td class='p-1'>\
                    <a class='me-1 text-decoration-none'><i class='icofont-edit'></i></a>\
                    <a class='ms-1 text-decoration-none'><i class='icofont-ui-delete'></i></i></a>\
                </td>\
            </tr>\
            <tr>\
                <td class='p-1' colspan='3'>" + imgStr + "</td>\
            </tr>")
            }
            $('#joViewTblTbody').append("<tr class='border-top'>\
                <th class='p-1'>" + moment(report.date).format('MMM DD YY') + "</th>\
                <td class='p-1 text-wrap'>" + report.report + "</td>\
                <td class='p-1'>" + report.tech + "</td>\
                <td class='p-1'>\
                    <a class='me-1 text-decoration-none'><i class='icofont-edit'></i></a>\
                    <a class='ms-1 text-decoration-none'><i class='icofont-ui-delete'></i></i></a>\
                </td>\
            </tr>")
        })
    }
    // image file click event
    $('.joViewFileImg').on('click',function(){
        $('#joViewImg').attr("src","../../../../" +  $(this).data("destination") + "/" + $(this).data("filename"))
    })
}