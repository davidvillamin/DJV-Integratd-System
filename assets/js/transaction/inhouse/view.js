
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
    // Repair Details
    //======================================================
    editRepair(id).then(function(){
        //update all client info
        tihvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);
    })

    // upload image 
    // image preview
    addImagePreview()
    addImage().then(function(){
        tihvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill);
    })

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

    //======================================================
    // DropDown
    //======================================================
    // view Repair
    viewRepair(data)

    //======================================================
    // Accordion 
    //======================================================
    // images
    // clear all images first on list
    $('#tihviList').empty();
    // Populate images
    data.Images.forEach(function image(img,i){
        $('#tihviList').append("<button type='button' class='list-group-item list-group-item-action tihviListItem' aria-current='true' data-b64=" + img.base64String + " data-desc=" + img.Description + ">" + img.Title + "</button>")
    })
    // add click function on each image
    $('.tihviListItem').on('click', function() {
        $('#tihviPreview').attr('src', $(this).attr('data-b64'));
        $('#tihviDescription').text($(this).attr('data-desc'));
    })

    // billing
    addParts()
}

