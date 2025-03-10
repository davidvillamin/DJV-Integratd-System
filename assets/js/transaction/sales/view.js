
var id = window.location.href.split('/')[window.location.href.split('/').length - 1];

$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
    var quill = quillInit("tsvNotes")
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    // show or hide client info and maximize and minimize image chage 

    $('#tsvMaxMinDisplay').on('click', function() {
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
    tsvPopulateData(currentTransaction,quill); // populate data

    // hide all tags first
    $('#tsvteSample .badge').css('display','none');
    //add on toggle effects on edit tags
    $('#tsvteSwitch input[type="checkbox"]').on('change', function() {
        console.log($(this).attr('name'))
        $('.' + $(this).attr('name')).toggle(this.checked);
    });



    // populate edit client individual on click on edit
    $("#tsvClientEdit").on('click', function() {
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
            tsvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);

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
            tsvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);
            
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
    $('#tsvRepairEdit').on('click',function(){
        $('#tsvreJobOrderNumber').val(currentTransaction.JobOrder)
        $('#tsvreRecieveDate').val(moment(currentTransaction.RecieveDate).format('YYYY-MM-DD') )
        $('#tsvreDevice').val(currentTransaction.Device)
        $('#tsvreSerial').val(currentTransaction.SerialNumber)
    })


    //update repair accordion
    $('#tsvrEdit').on('submit',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var data = {}
            
            data.data = {
                JobOrder:$('#tsvreJobOrderNumber').val(),
                RecieveDate:$('#tsvreRecieveDate').val(),
                Device:$('#tsvreDevice').val(),
                SerialNumber:$('#tsvreSerial').val(),
                Technician: $("#tsvreTechnician option:selected").val(),
                TempStatus: []
            }
            // alert($('#tsvrTechnician option:selected').val())
            if ( $('#tsvreTechnician option:selected').val() != 'Technician'){
                data.data.TempStatus.push("In Progress")
            }
            data.id = id

            tsvPopulateData(crudiAjax(data,'/transaction/inhouse/edit/ajax','Post'),quill)
            $('#tsvrEdit')[0].reset();
            // close modal   
            $('#tsvrEditModal').modal('toggle'); // fix modal toggle method
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


function tsvPopulateData(data,quill) {
    //header details
    $('#tsvTitleJobOrder').text(data.JobOrder);
    $('#tsvTitleDevice').text(data.Device);
    $('#tsvTitleSerial').text("("+ data.SerialNumber + ")");

    //remove all badges
    $('#tsvtStatus .badge').remove()
    //populate pill status (temporary)
    data.TempStatus.forEach(function(status){
        $('#tsvtStatus').append("<span class='badge bg-warning text-dark'>" + status + "</span>")
    })

    //edit details
    $('#tsvrJobOrder').text(data.JobOrder);
    $('#tsvrRecieveDate').text(moment(data.RecieveDate).format("YYYY-MM-DD"));
    $('#tsvrDevice').text(data.Device);
    $('#tsvrSerial').text(data.SerialNumber);
    $('#tsvrServiceCharge').text(data.ServiceCharge);
    
    if (data.Technician){ //if there is a technician in the db.
        $('#tsvrTechnician').text(data.Technician);
    } 

    $('#tsvClientName').text(data.Client.Name);
    $('#tsvClientAddress').append(data.Client.Address);
    quill.setContents(data.Notes);
    // $('#tsCreateNotes').append(data.Client.Notes);
    // clear li items
    $('#tsvClientContactNumbers').empty();
    
    // populate address
    $('#tsvClientAddress').text(data.Client.Address);

    //profile image
    if (data.Client.isIndividual) {
        if (data.Client.isMale) {
            $('#tsvProfile').attr('src', '/assets/img/male.png');
        } else {
            $('#tsvProfile').attr('src', '/assets/img/female.jpg');
        }
        //edit client individual
        $('#tsvClientEdit').attr('data-bs-target', "#ciEditModal");
        // loop contact number
        data.Client.ContactDetails.forEach(function(number) {
            $('#tsvClientContactNumbers').append('<li>' + number + '</li>');
        });
    } else {
        $('#tsvProfile').attr('src', '/assets/img/company.jpg');
        // edit client corporate
        $('#tsvClientEdit').attr('data-bs-target', "#ccEditModal");
        // loop contact person with number
        data.Client.ContactDetails.forEach(function(detail) {
            $('#tsvClientContactNumbers').append('<li><strong>' + detail.Contactserson + ':</strong> ' + detail.ContactNumber + ' </li>');
        });
    }
}

