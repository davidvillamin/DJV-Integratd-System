//in this file all codes need for creating client using modal \views\device\modal\create.ejs
//just call this create client function
// legend prefix :
// dc - device Create
function deviceCreate() {
    return new Promise(function(resolve, reject) {
        try {
            // populate client dropdown
            populateClientDropdown()

            // toggle no serial
            // initial toggle
            noSerialToggle();
            // event listener for toggle
            $('#dcWithSerial').on('change', function(){
                noSerialToggle();
            })

            // toggle default name
            // initial toggle
            defualtNameToggle();

            // add initial value for default name
            // ensure 'Use default name' checkbox is checked by default and update state
            $('#dcDefaultName').prop('checked', true);
            $('#dcName').prop('disabled', true);

            // event listener for toggle
            $('#dcDefaultName').on('change', function(){
                defualtNameToggle();
            })

            // auto fill up device name
            $('#dcType, #dcBrand, #dcModel').on('input', function(){
                if ($('#dcDefaultName').is(':checked')){
                    var type = $('#dcType').val();
                    var brand = $('#dcBrand').val();
                    var model = $('#dcModel').val();
                    var defaultName = type + ' ' + brand + ' ' + model;
                    $('#dcName').val(defaultName);
                }
            })

            // create transaction
            $('#dCreateDevice :submit').on('click',function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Client:$('#dcClientId').val(),
                        Type:$('#dcType').val(),
                        Brand:$('#dcBrand').val(),
                        Model:$('#dcModel').val(),
                        withSerial: $('#dcWithSerial').is(':checked'),
                        Serial:$('#dcSerial').val(),
                        Name:$('#dcName').val(),
                        CreatedDate: new Date()
                    }
                    
                    // save data on a variable for confirmation
                     var crudiAjaxResult = crudiAjax(data, "/device/create", "Post")
                    // clear form
                    $('#dCreateDevice')[0].reset();
                    // close modal   
                    $('#diCreateModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
                    $(".toast").find(".toast-title").text("New Device Created")
                  
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

function populateClientDropdown(){
    var clients = crudiAjax({}, "/client/list", "POST");
    $('#dcClient').empty();
    clients.forEach(function(client){
        $('#dcClientList').append('<option data-id='+ client._id +' value="' + client.FullName + '"></option>');
    })
    // add event listener for input when client selected and get the data-id attribute
    $('#dcClient').on('input', function(){
        var inputVal = $(this).val();   
        var option = $('#dcClientList').find('option[value="' + inputVal + '"]');
        $("#dcClientId").val(option.attr('data-id'));
    });
}

function noSerialToggle(){
    if ($('#dcWithSerial').is(':checked')){
        $('#dcSerial').prop('disabled', true);
        //clear serial input
        $('#dcSerial').val('No Serial Number');
    } else {
        $('#dcSerial').prop('disabled', false);
    }
}

function defualtNameToggle(){
    if ($('#dcDefaultName').is(':checked')){
        $('#dcName').prop('disabled', true);
    } else {
        $('#dcName').prop('disabled', false);
    }
}

