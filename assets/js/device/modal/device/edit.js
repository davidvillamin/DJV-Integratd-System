//in this file all codes need for editing device using modal \views\device\modal\edit.ejs
//just call this edit device function
// legend prefix :

// de - device Edit
function editDevice(deviceId) {
    return new Promise(async function(resolve, reject) {
        try {
            // populate client dropdown
            await editDevicePopulateDeviceEdit(deviceId);

            // event listener for toggle
            $('#deNoSerial').on('change', function(){
                editDeviceNoSerialToggle();
            })

            // create transaction
            $('#dEditDevice :submit').on('click',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    // remove invialid class if code number is unique
                    $('#deCode').removeClass('is-invalid');
                    var data = {}
                    data.data = {
                        Type:$('#deType').val(),
                        Brand:$('#deBrand').val(),
                        Model:$('#deModel').val(),
                        noSerial: $('#deNoSerial').is(':checked'),
                        Serial:$('#deNoSerial').is(':checked') ? '' : $('#deSerial').val(),
                        Name:$('#deName').val(),
                    }
                    data.deviceId = deviceId;
                    // save data on a variable for confirmation
                    var crudiAjaxResult = await crudiAjax(data, "/device/edit", "POST")
                    // clear form
                    $('#dEditDevice')[0].reset();
                    // close modal   
                    $('#deEditModal').modal('toggle'); // fix modal toggle method
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

function editDevicePopulateDeviceEdit(deviceId){
    return new Promise(async function(resolve, reject) {
        try {
            var deviceData = await crudiAjax({deviceId: deviceId}, "/device/getOneData", 'Post');
            // populate device data in edit modal
            // if deviceData has Client.BusinessName populate Business name + Client name else client name only
            deviceData.Client.BusinessName ? $('#deClient').val(deviceData.Client.BusinessName + " - " + deviceData.Client.FullName) : $('#deClient').val(deviceData.Client.FullName);
            $('#deCode').val(deviceData.Code);
            $('#deClientId').val(deviceData.Client._id);
            $('#deType').val(deviceData.Type);
            $('#deBrand').val(deviceData.Brand);
            $('#deModel').val(deviceData.Model);

            // if device has no serial number, check the checkbox
            $("#deNoSerial").prop('checked', deviceData.noSerial);
            
            if (deviceData.noSerial){
                $('#deSerial').prop('disabled', true);
                $('#deSerial').val('No Serial Number');
            } else {
                $('#deSerial').prop('disabled', false);
                $('#deSerial').val(deviceData.Serial);
            }
            $('#deName').val(deviceData.Name);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function editDeviceNoSerialToggle(){
    if ($('#deNoSerial').is(':checked')){
        $('#deSerial').prop('disabled', true);
        $('#deSerial').val('No Serial Number');
    } else {
        $('#deSerial').prop('disabled', false);
        $('#deSerial').val('');

    }
}