function editJo(){
    //pass data in all input after selecting client create
    $('#edtJoCLntLst').on('change', function(){
        //clear data
        $('#edtClntId').val('')
        $('#edtJoCntPrsn').val('')
        $('#edtJoCntNum').val('')
        $('#edtJoAdd').text('')
        //fill data
        $('#edtClntId').val($("#edtClntLst option[value='" + $('#edtJoCLntLst').val() + "']").attr('data-id'))
        $('#edtJoCntPrsn').val($("#edtClntLst option[value='" + $('#edtJoCLntLst').val() + "']").attr('data-cntPrsn'))
        $('#edtJoCntNum').val($("#edtClntLst option[value='" + $('#edtJoCLntLst').val() + "']").attr('data-cntNum'))
        $('#edtJoAdd').text($("#edtClntLst option[value='" + $('#edtJoCLntLst').val() + "']").attr('data-add'))
    })
    //save edit jo
    $('#edtJoFrm :submit').on('click',function(){
        if ($(this).closest('form').is(':valid') === true){
            var jo = {
                clientId: $('#edtClntId').val(),
                id: $('#edtJoId').val()
            }   
            $.ajax({
                url: '/jo/edit' ,
                type: "POST",
                data: {jo: jo},
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
}
function delJo(){
    //populate delete jo
    $('#joIndex').on('click','.delJo', function(){
        $('#delJoNum').text($(this).closest('tr').attr('data-joNum')) 
        $('#delJoId').val($(this).closest('tr').attr('data-id'))
        $('#delClntId').val($(this).closest('tr').attr('data-clntId'))
    })
    //validate and save deleted jo
    $('#delSub').on('click',function(){
        if ($('#delConfirm').val() === 'DELETE'){
            $('#delInv').addClass('d-none')
            $('#delInv').removeClass('d-block')
            $('#delConfirm').removeClass('is-invalid')
            $('#delConfirm').val('')

            $('#delJoMod').modal('toggle')
            var delJo = {
                joId: $('#delJoId').val(),
                clntId: $('#delClntId').val()
            }
            $.ajax({
                url: '/jo/delete' ,
                type: "DELETE",
                data: delJo,
                success: function(data){
                    alert(data.message)
                    initialize()
                },
                error: function(err){
                    console.log(err);
                }
            })
        } else {
            $('#delConfirm').addClass('is-invalid')
            $('#delConfirm').removeClass('is-valid')
            $('#delInv').addClass('d-block')
            $('#delInv').removeClass('d-none')
        }
    })
}