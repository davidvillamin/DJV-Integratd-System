
var id = window.location.href.split('/')[window.location.href.split('/').length - 1];

$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
    
    //======================================================
    // Initialize Quill/Toast
    //======================================================
    var quill = quillInit("tihvNotes")
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    //======================================================
    // initialize functionality
    //======================================================
    // show or hide client info and maximize and minimize image chage 

    $('#tihvMaxMinDisplay').on('click', function() {
        if ($('.clientInformation').css('display') === 'none') { // Check if client information is hidden
            
            $("#tihvMaxMinDisplay").text("Maximize")
            $('.clientInformation').css('display', 'block'); // Show client information
            $(".mainContent").removeClass('col-xl-12').addClass('col-xl-8'); // Adjust main content width to 8 columns
        } else {
            $("#tihvMaxMinDisplay").text("Minimize")
            $('.clientInformation').css('display', 'none'); // Hide client information
            $(".mainContent").removeClass('col-xl-8').addClass('col-xl-12'); // Adjust main content width to 12 columns
        }
    });

    //======================================================
    // Edit tags 
    //======================================================
    editTags()

    //======================================================
    // Data Population
    //======================================================
    //population of data
    var currentTransaction = crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post');
    tihvPopulateData(currentTransaction,quill); // populate data

    //======================================================
    // Edit Client
    //======================================================
    // populate edit client individual on click on edit
    $("#tihvClientEdit").on('click', function() {
        // check if individual or corporate
        if  (currentTransaction.Client.isIndividual){
            // input client id 
            clientEditIndividual(currentTransaction.Client._id).then(function() {
                //update all client info
                tihvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);
            });
        } else {
            clientEditCorporate(currentTransaction.Client._id).then(function() {
                //update all client info
                tihvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);
            });
        }
    });
    



    //======================================================
    // Repair Accordion
    //======================================================
    editRepair(id).then(function(){
        //update all client info
        tihvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);
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
    //======================================================
    // billing Accordion
    //======================================================
    // billing
    // $('#tihvpTable').bootstrapTable()
});


function tihvPopulateData(data,quill) {
    //======================================================
    // Header with breadcumb
    //======================================================
    //header details
    $('#tihvTitleJobOrder').text(data.JobOrder);
    $('#tihvTitleDevice').text(data.Device);
    $('#tihvTitleSerial').text("("+ data.SerialNumber + ")");
    // breadcrumbs
    $('#tihvbcJobOrder').text(data.JobOrder);

    //======================================================
    // Tags
    //======================================================
    //remove all badges first 
    // is is not on edit
    $('#tihvtStatus .badge').remove()

    //populate pill status 
    // this one includes the initial status on edit
    data.TempStatus.forEach(function(status){
        // loop on all status to be included
        $('#tihvtStatus').append("<span class='badge bg-warning text-dark'>" + status + "</span>")
        // add also on edit tags (enable all data)
        $("." + status).show(); // unhide tags
        $("#tihvteSwitch input[name=" + status + "]").prop('checked', true); //  check the checkbox on edit tags
    })

    //======================================================
    // Repair Details
    //======================================================
    //edit details
    $('#tihvrJobOrder').text(data.JobOrder);
    $('#tihvrRecieveDate').text(moment(data.RecieveDate).format("YYYY-MM-DD"));
    $('#tihvrDevice').text(data.Device);
    $('#tihvrSerial').text(data.SerialNumber);
    $('#tihvrServiceCharge').text(data.ServiceCharge);
    
    if (data.Technician){ //if there is a technician in the db.
        $('#tihvrTechnician').text(data.Technician);
    } 

    quill.setContents(data.Notes); // job order notes
    //======================================================
    // Client Details / Profile Image/ Contact Numbers / Edit Client Modal target
    //======================================================
    $('#tihvClientName').text(data.Client.Name);
    $('#tihvClientAddress').append(data.Client.Address);
    $('#tihCreateNotes').append(data.Client.Notes);
    
    // clear li items on contact numbers
    $('#tihvClientContactNumbers').empty();
    //profile image / contact numbers and edit client modal target
    if (data.Client.isIndividual) {
        // logo image identification if fale of female
        if (data.Client.isMale) {
            $('#tihvProfile').attr('src', '/assets/img/male.png');
        } else {
            $('#tihvProfile').attr('src', '/assets/img/female.jpg');
        }
        //edit client individual modal target
        $('#tihvClientEdit').attr('data-bs-target', "#ciEditModal");

        // loop contact number
        data.Client.ContactDetails.forEach(function(number) {
            $('#tihvClientContactNumbers').append('<li>' + number + '</li>');
        });
    } else {
        // coroporate profile image
        $('#tihvProfile').attr('src', '/assets/img/company.jpg');
        // edit client corporate modal target
        $('#tihvClientEdit').attr('data-bs-target', "#ccEditModal");

        // loop contact person with number
        data.Client.ContactDetails.forEach(function(detail) {
            $('#tihvClientContactNumbers').append('<li><strong>' + detail.ContactPerson + ':</strong> ' + detail.ContactNumber + ' </li>');
        });
    }
}

