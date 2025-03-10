
var id = window.location.href.split('/')[window.location.href.split('/').length - 1];

$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
    
    var quill = quillInit("tosvNotes")
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // show or hide client info and maximize and minimize image chage 

    $('#tosvMaxMinDisplay').on('click', function() {
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
    tosvPopulateData(currentTransaction,quill); // populate data

    // hide all tags first
    $('#tosvteSample .badge').css('display','none');
    //add on toggle effects on edit tags
    $('#tosvteSwitch input[type="checkbox"]').on('change', function() {
        console.log($(this).attr('name'))
        $('.' + $(this).attr('name')).toggle(this.checked);
    });



    // populate edit client individual on click on edit
    $("#tosvClientEdit").on('click', function() {
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
            tosvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);

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
            tosvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);
            
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
    $('#tosvRepairEdit').on('click',function(){
        $('#tosvreJobOrderNumber').val(currentTransaction.JobOrder)
        $('#tosvreRecieveDate').val(moment(currentTransaction.RecieveDate).format('YYYY-MM-DD') )
        $('#tosvreDevice').val(currentTransaction.Device)
        $('#tosvreSerial').val(currentTransaction.SerialNumber)
    })


    //update repair accordion
    $('#tosvrEdit').on('submit',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {}
            
            data.data = {
                JobOrder:$('#tosvreJobOrderNumber').val(),
                RecieveDate:$('#tosvreRecieveDate').val(),
                Device:$('#tosvreDevice').val(),
                SerialNumber:$('#tosvreSerial').val(),
                Technician: $("#tosvreTechnician option:selected").val(),
                TempStatus: []
            }
            // alert($('#tosvrTechnician option:selected').val())
            if ( $('#tosvreTechnician option:selected').val() != 'Technician'){
                data.data.TempStatus.push("In Progress")
            }
            data.id = id

            tosvPopulateData(crudiAjax(data,'/transaction/inhouse/edit/ajax','Post'),quill)
            $('#tosvrEdit')[0].reset();
            // close modal   
            $('#tosvrEditModal').modal('toggle'); // fix modal toggle method
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


function tosvPopulateData(data,quill) {
    //header details
    $('#tosvTitleJobOrder').text(data.JobOrder);
    $('#tosvTitleDevice').text(data.Device);
    $('#tosvTitleSerial').text("("+ data.SerialNumber + ")");

    //remove all badges
    $('#tosvtStatus .badge').remove()
    //populate pill status (temporary)
    data.TempStatus.forEach(function(status){
        $('#tosvtStatus').append("<span class='badge bg-warning text-dark'>" + status + "</span>")
    })

    //edit details
    $('#tosvrJobOrder').text(data.JobOrder);
    $('#tosvrRecieveDate').text(moment(data.RecieveDate).format("YYYY-MM-DD"));
    $('#tosvrDevice').text(data.Device);
    $('#tosvrSerial').text(data.SerialNumber);
    $('#tosvrServiceCharge').text(data.ServiceCharge);
    
    if (data.Technician){ //if there is a technician in the db.
        $('#tosvrTechnician').text(data.Technician);
    } 

    $('#tosvClientName').text(data.Client.Name);
    $('#tosvClientAddress').append(data.Client.Address);
    quill.setContents(data.Notes);
    // $('#tosCreateNotes').append(data.Client.Notes);
    // clear li items
    $('#tosvClientContactNumbers').empty();
    
    // populate address
    $('#tosvClientAddress').text(data.Client.Address);

    //profile image
    if (data.Client.isIndividual) {
        if (data.Client.isMale) {
            $('#tosvProfile').attr('src', '/assets/img/male.png');
        } else {
            $('#tosvProfile').attr('src', '/assets/img/female.jpg');
        }
        //edit client individual
        $('#tosvClientEdit').attr('data-bs-target', "#ciEditModal");
        // loop contact number
        data.Client.ContactDetails.forEach(function(number) {
            $('#tosvClientContactNumbers').append('<li>' + number + '</li>');
        });
    } else {
        $('#tosvProfile').attr('src', '/assets/img/company.jpg');
        // edit client corporate
        $('#tosvClientEdit').attr('data-bs-target', "#ccEditModal");
        // loop contact person with number
        data.Client.ContactDetails.forEach(function(detail) {
            $('#tosvClientContactNumbers').append('<li><strong>' + detail.ContactPerson + ':</strong> ' + detail.ContactNumber + ' </li>');
        });
    }
}

