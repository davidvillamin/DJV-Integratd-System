//in this file all codes need for editing device using modal \views\device\modal\edit.ejs
//just call this edit device function
// legend prefix :
// de - device Edit
function deviceEdit(deviceId) {
    return new Promise(async function(resolve, reject) {
        try {
            // populate client dropdown
            await populateDeviceEdit(deviceId);

            // toggle auto code number
            // initial toggle
            autoCodeNumberToggle();
            // event listener for toggle
            $('#deAutoCodeNumber').on('change', function(){
                autoCodeNumberToggle();
            })

            // initial toggle
            noSerialToggle();
            // event listener for toggle
            $('#deWithSerial').on('change', function(){
                noSerialToggle();
            })

            // toggle default name
            // initial toggle
            defualtNameToggle();

            // add initial value for default name
            // ensure 'Use default name' checkbox is checked by default and update state
            $('#deDefaultName').prop('checked', true);
            $('#deName').prop('disabled', true);

            // event listener for toggle
            $('#deDefaultName').on('change', function(){
                defualtNameToggle();
            })

            // auto fill up device name
            $('#deType, #deBrand, #deModel').on('input', function(){
                if ($('#deDefaultName').is(':checked')){
                    var type = $('#deType').val();
                    var brand = $('#deBrand').val();
                    var model = $('#deModel').val();
                    var defaultName = type + ' ' + brand + ' ' + model;
                    $('#deName').val(defaultName);
                }
            })

            // create transaction
            $('#dEditDevice :submit').on('click',async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    // verify code number exist
                    var codeExists = await crudiAjax({codeNumber: $('#deCode').val()}, "/device/verifyCodeNumber", "POST");
                    if (codeExists) {
                        $(".toast").toast("show").find(".toast-body").text("The code number you entered already exists. Please use a different code number.");
                        $(".toast").find(".toast-title").text("Duplicate Code Number")
                        // add invialid class to code input
                        $('#deCode').addClass('is-invalid');
                        return;
                    } else {
                        // remove invialid class if code number is unique
                        $('#deCode').removeClass('is-invalid');
                        var data = {
                            Code:$('#deCode').val(),
                            Client:$('#deClientId').val(),
                            Type:$('#deType').val(),
                            Brand:$('#deBrand').val(),
                            Model:$('#deModel').val(),
                            withSerial: $('#deWithSerial').is(':checked'),
                            Serial:$('#deSerial').val(),
                            Name:$('#deName').val(),
                            CreatedDate: new Date()
                        }
                        
                        // save data on a variable for confirmation
                         var crudiAjaxResult = await crudiAjax(data, "/device/create", "POST")
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
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}
function populateDeviceEdit(deviceId){
    return new Promise(async function(resolve, reject) {
        try {
            var deviceData = await crudiAjax({deviceId: deviceId}, "/device/getOneData", 'Post');
            console.log(deviceData);
            // populate device data in edit modal
            // if deviceData has Client.BusinessName populate Business name + Client name else client name only
            deviceData.Client.BusinessName ? $('#deClient').val(deviceData.Client.BusinessName + " - " + deviceData.Client.FullName) : $('#deClient').val(deviceData.Client.FullName);
            $('#deClientId').val(deviceData.Client._id);
            $('#deType').val(deviceData.Type);
            $('#deBrand').val(deviceData.Brand);
            $('#deModel').val(deviceData.Model);

            // if device has no serial number, check the checkbox
            if (deviceData.withSerial){
                // with serial
                $('#deWithSerial').prop('checked', true);
                $('#deSerial').prop('disabled', true);
                $('#deSerial').val('No Serial Number');
            } else {
                // without serial
                $('#deWithSerial').prop('checked', false);
                $('#deSerial').prop('disabled', false);
                $('#deSerial').val(deviceData.Serial);
            }

            // $('#deWithSerial').prop('checked', deviceData.withSerial);
            $('#deName').val(deviceData.Name);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function noSerialToggle(){
    if ($('#deWithSerial').is(':checked')){
        $('#deSerial').prop('disabled', true);
        $('#deSerial').val('No Serial Number');
    } else {
        $('#deSerial').prop('disabled', false);
        $('#deSerial').val('');

    }
}

function defualtNameToggle(){
    if ($('#deDefaultName').is(':checked')){
        $('#deName').prop('disabled', true);
    } else {
        $('#deName').prop('disabled', false);
    }
}

async function autoCodeNumberToggle(){
    if ($('#deAutoCodeNumber').is(':checked')){
        $('#deCode').prop('disabled', true);
        //generate own code number
        $('#deCode').val(''); // clear value first
        
        var generatedCode = await crudiAjax({}, "/device/generateCodeNumber", 'Get');
        $('#deCode').val(generatedCode);
    } else {
        $('#deCode').prop('disabled', false);
        $('#deCode').val('');
    }
}