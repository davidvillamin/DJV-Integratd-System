function createTransaction() {
    return new Promise(async function(resolve, reject) {
        try {
            // auto generate ticket number toggle
            // initial toggle
            autoticketNumberToggle();
            // event listener for toggle
            $('#tAutoTicketNumber').on('change', function(){
                autoticketNumberToggle();
            })

            // today received date toggle
            // initial toggle
            todayToggle();
            // event listener for toggle
            $('#tToday').on('change', function(){
                todayToggle();
            })

            // get client list
            var clientList = await crudiAjax({},"/client/list", "POST");

            // populate client select
            $("#tClientList").empty();
            $("#tClientList").append('<option value="" selected disabled>Select Client</option>');
            clientList.forEach(function(client) {
                $("#tClientList").append('<option data-id="' + client._id + '" value="' + client.FullName + '">' + client.FullName + '</option>');
            });
            // add event listener for input when client selected and get the data-id attribute
            $('#tClient').on('input', function(){
                var inputVal = $(this).val();   
                var option = $('#tClientList').find('option[value="' + inputVal + '"]');
                $("#tClientID").val(option.attr('data-id'));

                // get device list base on client
                var selectedClientId = option.attr('data-id');
                if (selectedClientId !== undefined) { //  if the selected client is valid
                    var selectedClient = clientList.find(function(c) {
                        if (c._id === selectedClientId) {
                            return c.Devices;
                        }
                    });
                }
                if (selectedClient != undefined) { //  if the selected client has devices
                    // enable device input
                    $('#tDevice').prop('disabled', false);
                    // clear device list first and value
                    $("#tDeviceList").empty();
                    $('#tDevice').val('');
                    selectedClient.Devices.forEach(function(device) {
                        $("#tDeviceList").append('<option data-id="' + device._id + '" value="' + device.Name + '">' + device.Name + '</option>');
                    });
                } else {
                    // disable device input
                    $('#tDevice').prop('disabled', true);
                    
                    // clear device list and value
                    $("#tDeviceList").empty();
                    $('#tDevice').val('');
                }
            });

            // add event listener for device input
            $('#tDevice').on('input', function(){
                var inputVal = $(this).val();   
                var option = $('#tDeviceList').find('option[value="' + inputVal + '"]');
                $("#tDeviceID").val(option.attr('data-id'));
            });

            // create transaction form submit
            $('#tCreateForm').on('submit', async function(e){
                if ($(this).closest('form').is(':valid') === true){
                    e.preventDefault();
                    var data = {
                        Name: $('#tTicketName').val(),
                        TransactionType: $('#tTypeGroup').val(),
                        transactionCode: $('#tTicketNumber').val(),
                        Client: $('#tClientID').val(),
                        Device: $('#tDeviceID').val(),
                        RecievedBy: {
                            Date: $('#tReceivedDate').val(),
                            Personel: $('#tPersonel').val()
                        },
                        isClosed: false
                    }
                    
                    await crudiAjax(data, "/transaction/create", "POST");
                    // clear form
                    $('#tCreateForm')[0].reset();
                    // close modal
                    $('#tCreateModal').modal('toggle'); // fix modal toggle method
                    $('.modal-backdrop').remove(); // ensure backdrop is removed
                    // show toast
                    $(".toast").toast("show").find(".toast-body").text("You have successfully created a new transaction.")
                    $(".toast").find(".toast-title").text("New Transaction Created")
                }
            })

        } catch (error) {
            reject(error);
        }
    });
}

async function autoticketNumberToggle(){
    if ($('#tAutoTicketNumber').is(':checked')){
        $('#tTicketNumber').prop('disabled', true);
        // auto generate ticket number
        var generatedCode = await crudiAjax({}, "/transaction/code/generate", "POST");
        $('#tTicketNumber').val(generatedCode);
    } else {
        $('#tTicketNumber').prop('disabled', false);
    }
}

function todayToggle(){
    if ($('#tToday').is(':checked')){
        $('#tReceivedDate').val(new Date().toISOString().split('T')[0]);
        $('#tReceivedDate').prop('disabled', true);
    } else {
        $('#tReceivedDate').prop('disabled', false);
    }
}