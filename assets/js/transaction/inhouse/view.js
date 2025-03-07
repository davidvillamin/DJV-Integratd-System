
var id = window.location.href.split('/')[window.location.href.split('/').length - 1];

$(function(){
    var quill = quillInit("tihvNotes")
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // show or hide client info and maximize and minimize image chage 

    $('#tihvMaxMinDisplay').on('click', function() {
        if ($('.clientInformation').css('display') === 'none') { // Check if client information is hidden
            $(this).removeClass("bi-fullscreen-exit")
            $(this).addClass("bi-fullscreen")
            $('.clientInformation').css('display', 'block'); // Show client information
            $(".mainContent").removeClass('col-xl-12').addClass('col-xl-8'); // Adjust main content width to 8 columns
        } else {
            $(this).removeClass("bi-fullscreen")
            $(this).addClass("bi-fullscreen-exit")
            $('.clientInformation').css('display', 'none'); // Hide client information
            $(".mainContent").removeClass('col-xl-8').addClass('col-xl-12'); // Adjust main content width to 12 columns
        }
    });

    //population of data
    var currentTransaction = crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post');
    tihvPopulateData(currentTransaction,quill); // populate data

    // hide all tags first
    $('#tihvteSample .badge').css('display','none');
    //add on toggle effects on edit tags
    $('#tihvteSwitch input[type="checkbox"]').on('change', function() {
        console.log($(this).attr('name'))
        $('.' + $(this).attr('name')).toggle(this.checked);
    });



    // populate edit client individual on click on edit
    $("#tihvClientEdit").on('click', function() {
        if  (currentTransaction.Client.isIndividual){
            clientEditIndividualPopulate(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post').Client)
        } else {
            clientEditCorporatePopulate(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post').Client)
        }
    });

    //update edit client individual
    $('#ciEdit :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            clientEditIndividualUpdate(currentTransaction.Client._id);
            //update all client info
            tihvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);

            // close modal   
            $('#ciEditModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly edited a client!")
            $(".toast").find(".toast-title").text("Edit Client")
        }
    })

    //update edit client Corporate
    $('#ccEdit :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            alert('no edit on corporate.. wait for patch')
            e.preventDefault();
            clientEditCorporateUpdate(currentTransaction.Client._id);
            //update all client info
            tihvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);
            
            // close modal   
            $('#ccEditModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly edited a client!")
            $(".toast").find(".toast-title").text("Edit Client")
        }
    })

    // repair accordion
    //Report Edit click populate details
    $('#tihvRepairEdit').on('click',function(){
        $('#tihvreJobOrderNumber').val(currentTransaction.JobOrder)
        $('#tihvreRecieveDate').val(moment(currentTransaction.RecieveDate).format('YYYY-MM-DD') )
        $('#tihvreDevice').val(currentTransaction.Device)
        $('#tihvreSerial').val(currentTransaction.SerialNumber)
    })


    //update repair accordion
    $('#tihvrEdit').on('submit',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {}
            
            data.data = {
                JobOrder:$('#tihvreJobOrderNumber').val(),
                RecieveDate:$('#tihvreRecieveDate').val(),
                Device:$('#tihvreDevice').val(),
                SerialNumber:$('#tihvreSerial').val(),
                Technician: $("#tihvreTechnician option:selected").val(),
                TempStatus: []
            }
            // alert($('#tihvrTechnician option:selected').val())
            if ( $('#tihvreTechnician option:selected').val() != 'Technician'){
                data.data.TempStatus.push("In Progress")
            }
            data.id = id

            tihvPopulateData(crudiAjax(data,'/transaction/inhouse/edit/ajax','Post'),quill)
            $('#tihvrEdit')[0].reset();
            // close modal   
            $('#tihvrEditModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is remove
            // show toast
            $(".toast").toast("show").find(".toast-body").text("You have successfuly edited a transaction!")
            $(".toast").find(".toast-title").text("Edit transaction")
        }
    })

    // upload image 
    
    $("#inputGroupFile01").on('change', function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            var base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
            base64String = 'data:image/png;base64,' + base64String
            var data = {
                image: base64String,
                id: id
            };
            // crudiAjax(data, '/transaction/inhouse/upload/image', 'Post');
            // // show toast
            // $(".toast").toast("show").find(".toast-body").text("Image uploaded successfully!");
            // $(".toast").find(".toast-title").text("Upload Image");
            document.getElementById('loadImage').src = base64String;
        };
        reader.readAsDataURL(file);
        console.log(reader)
    });
});


function tihvPopulateData(data,quill) {
    //header details
    $('#tihvTitleJobOrder').text(data.JobOrder);
    $('#tihvTitleDevice').text(data.Device);
    $('#tihvTitleSerial').text("("+ data.SerialNumber + ")");

    //remove all badges
    $('#tihvtStatus .badge').remove()
    //populate pill status (temporary)
    data.TempStatus.forEach(function(status){
        $('#tihvtStatus').append("<span class='badge bg-warning text-dark'>" + status + "</span>")
    })

    //edit details
    $('#tihvrJobOrder').text(data.JobOrder);
    $('#tihvrRecieveDate').text(moment(data.RecieveDate).format("YYYY-MM-DD"));
    $('#tihvrDevice').text(data.Device);
    $('#tihvrSerial').text(data.SerialNumber);
    $('#tihvrServiceCharge').text(data.ServiceCharge);
    
    if (data.Technician){ //if there is a technician in the db.
        $('#tihvrTechnician').text(data.Technician);
    } 

    $('#tihvClientName').text(data.Client.Name);
    $('#tihvClientAddress').append(data.Client.Address);
    quill.setContents(data.Notes);
    // $('#tihCreateNotes').append(data.Client.Notes);
    // clear li items
    $('#tihvClientContactNumbers').empty();
    
    // populate address
    $('#tihvClientAddress').text(data.Client.Address);

    //profile image
    if (data.Client.isIndividual) {
        if (data.Client.isMale) {
            $('#tihvProfile').attr('src', '/assets/img/male.png');
        } else {
            $('#tihvProfile').attr('src', '/assets/img/female.jpg');
        }
        //edit client individual
        $('#tihvClientEdit').attr('data-bs-target', "#ciEditModal");
        // loop contact number
        data.Client.ContactDetails.forEach(function(number) {
            $('#tihvClientContactNumbers').append('<li>' + number + '</li>');
        });
    } else {
        $('#tihvProfile').attr('src', '/assets/img/company.jpg');
        // edit client corporate
        $('#tihvClientEdit').attr('data-bs-target', "#ccEditModal");
        // loop contact person with number
        data.Client.ContactDetails.forEach(function(detail) {
            $('#tihvClientContactNumbers').append('<li><strong>' + detail.ContactPerson + ':</strong> ' + detail.ContactNumber + ' </li>');
        });
    }
}

