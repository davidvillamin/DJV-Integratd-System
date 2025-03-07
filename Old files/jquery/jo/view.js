$(document).ready(function() {
    initialize()
     //populate data in Edit jo
     $('#edtJoView').on('click', function(){
        $.ajax({
            url: '/jo/edit/populate' ,
            type: "POST",
            data: {id: $(this).closest('tr').attr('data-id') },
            success: function(data){
                $('#edtClntLst').html('')
                data.foundClient.forEach(function(clnt){
                    $('#edtClntLst').append("<option value=" + JSON.stringify(clnt.clnt) + " \
                    data-id=" + clnt._id + "\
                    data-cntPrsn=" + JSON.stringify(clnt.cntPrsn) + "\
                    data-cntNum=" + clnt.cntNum + "\
                    data-add=" + JSON.stringify(clnt.add) + ">")
                })
                //fill data in edit form
                $('#edtJoNum').val(data.foundJo.joNum)
                $('#edtJoId').val(data.foundJo._id)
                $('#edtJoDate').val(data.foundJo.date)
            },
            error: function(err){
                console.log(err);
            }
        })
    })
    editJo()
    //toggle class show details
    $('#clntDtlsShow').on('click', function(){
        $('#clntDtls').toggleClass('active')
    })
    // add device jo
    $('#crtJoDev').on('submit', function(){
        if ($(this).closest('form').is(':valid') === true){
            var crtDev = {};
            crtDev.joId = $('#crtJoId').val()
            crtDev.dev = {
                joDevId: $('#crtDevJoNum').val(),
                repType: $('#crtDevRep').val(),
                devType: $('#crtDevType').val(),
                devModel: $('#crtDevMod').val().toUpperCase(),
                devSn: $('#crtDevSn').val().toUpperCase(),
                desc: $('#crtDevDesc').val().toUpperCase(),
                prob: $('#crtDevProb').val().toUpperCase(),
                tech: $('#crtTech').val(),
                recDate: moment()._d
            }
            $.ajax({
                url: '/devJo/create' ,
                type: "POST",
                data: crtDev,
                success: function(data){
                    alert(data.message)
                    initialize()
                },
                error: function(err){
                    console.log(err);
                }
            })
        }
    })
})

function initialize(){
    var path = $(location).attr("pathname").split("/")
    $.ajax({
        url: '/jo/view',
        type: "POST",
        data: {id: path[2]},
        success: function(data){
            var client = data.foundJo.client[0]
            var joDevice = data.foundJo.joDevice
            //breadcumbs
            $('#joIdLink').attr('href','/jo/' + data.foundJo._id)
            $('#joIdView').text(data.foundJo.joNum)

            //populate client info
            $('#crtJoId').val(data.foundJo._id)
            $('#joId').val(data.foundJo._id)
            $('#joNum').text(data.foundJo.joNum)
            $('#joDate').text(moment(data.foundJo.date).format('MMM-DD-YYYY'))

            $('#clntType').text(client.clntType)
            $('#clntNm').text(client.clnt)
            $('#clntCntPrsn').text(client.cntPrsn)
            $('#clntCntNum').text(client.cntNum)
            $('#clntEmail').text(client.email)
            $('#clntAdd').text(client.add)

            //populate add device
            $('#crtDevJoNum').val(data.foundJo.joNum + '-' + Math.abs(data.foundJo.joDevice.length + 1))

            // populate jo device table
            $('#devLstBody').html('')
            joDevice.forEach(function(dev){
                $('#devLstBody').append("<tr>\
                    <td><a href='/devJo/" + dev._id + "'>" + dev.joDevId + "</a></td>\
                    <td>" + dev.devType + "</td>\
                    <td>" + dev.devModel + "</td>\
                    <td>" + dev.prob + "</td>\
                    <td>" + dev.tech + "</td>\
                    <td class='d-flex justify-content-center'>\
                        <a class='pl-1 pr-1' href='#'><i class='icofont-edit'></i></a>\
                        <a class='pl-1 pr-1' href='#'><i class='icofont-ui-delete'></i></a>\
                    </td>\
                </tr>")
            })
            $('#devLst').dataTable()
        },
        error: function(err){
            console.log(err);
        }
    })
}