$(document).ready(function() {
    initialize()
     //populate data in Edit jo
     $('#joIndex').on('click','.edtJo', function(){
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
    delJo()
    //populate data in create jo
    $('#crtJo').on('click', function(){
        $.ajax({
            url: '/jo/create/populate' ,
            type: "POST",
            success: function(data){
                $('#crtJoNum').val(data.joIndex.date + '-' + data.joIndex.index)
                $('#joIndex').val(data.joIndex.index)
                $('#clntLst').html('')
                data.foundClient.forEach(function(clnt){
                    $('#clntLst').append("<option value=" + JSON.stringify(clnt.clnt) + " \
                    data-id=" + clnt._id + "\
                    data-cntPrsn=" + JSON.stringify(clnt.cntPrsn) + "\
                    data-cntNum=" + clnt.cntNum + "\
                    data-add=" + JSON.stringify(clnt.add) + ">")
                })
            },
            error: function(err){
                console.log(err);
            }
        })
    })
    //pass data in all input after selecting client create
    $('#crtJoCLntLst').on('change', function(){
        //clear data
        $('#crtJoClntId').val('')
        $('#crtJoCntPrsn').val('')
        $('#crtJoCntNum').val('')
        $('#crtJoAdd').text('')
        //fill data
        $('#crtJoClntId').val($("#clntLst option[value='" + $('#crtJoCLntLst').val() + "']").attr('data-id'))
        $('#crtJoCntPrsn').val($("#clntLst option[value='" + $('#crtJoCLntLst').val() + "']").attr('data-cntPrsn'))
        $('#crtJoCntNum').val($("#clntLst option[value='" + $('#crtJoCLntLst').val() + "']").attr('data-cntNum'))
        $('#crtJoAdd').text($("#clntLst option[value='" + $('#crtJoCLntLst').val() + "']").attr('data-add'))
    })

    // save create job order 
    $('#crtJoFrm :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            var jo = {}
            jo.jo = {
                date: moment().format('YYYY-MM-DD'),
                joNum: $('#crtJoNum').val()
            }
            jo.joIndex = {
                date: moment().format('YYYYMMDD'),
                index: $('#joIndex').val()
            }
            jo.id = $('#crtJoClntId').val()
            $.ajax({
                url: '/jo/create' ,
                type: "POST",
                data: jo,
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
    $.ajax({
        url: '/jo' ,
        type: "POST",
        success: function(data){
            var joIndexBody = $('#joIndexBody')
            joIndexBody.html('')
            data.foundJo.forEach(function(jo){
                joIndexBody.append("<tr data-id=" + jo._id + "\
                    data-joNum=" + jo.joNum + "\
                    data-clntId=" + jo.client[0]._id + ">\
                    <td><a href='/jo/" + jo._id  + "'>" + jo.joNum + "</a></td>\
                    <td><a href='/jo/" + jo._id  + "'>" + moment(jo.date).format('MMM DD YYYY') + "</a></td>\
                    <td>" + jo.client[0].clnt + "</td>\
                    <td class='d-flex justify-content-center'>\
                        <a class='pl-1 pr-1 edtJo' href='#' data-toggle='modal' data-target='#edtJoMod'><i class='icofont-edit'></i></a>\
                        <a class='pl-1 pr-1 delJo' href='#'  data-toggle='modal' data-target='#delJoMod'><i class='icofont-ui-delete'></i></a>\
                    </td>\
                </tr>")
            })
            $('#joIndex').DataTable();
        },
        error: function(err){
            console.log(err);
        }
    })
}
