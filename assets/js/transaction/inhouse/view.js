var id = window.location.href.split('/')[window.location.href.split('/').length - 1];

$(async function(){
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
    // Maximize and minimize functionality
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
    // Accordion 
    //======================================================
    // table init
    var partsTbl = $('#tihvbpTable').bootstrapTable()
    var transpoTbl = $('#tihvbtTable').bootstrapTable()
    var scTbl = $('#tihvbscTable').bootstrapTable()
    var payTbl = $('#tihvbpayTable').bootstrapTable()

    // billing parts
    addParts(id).then( async function(){
        partsTbl.bootstrapTable("destroy").bootstrapTable({
            data: await crudiAjax(id,"/transaction/inhouse/view/billing/parts/populte/table","post")
        });
    })
    
    // billing transportation
    addTransportation(id).then(async function(){
        transpoTbl.bootstrapTable("destroy").bootstrapTable({
            data: await crudiAjax(id,"/transaction/inhouse/view/billing/transporation/populte/table","post")
        });
    })

    // billing Service Charge
    addServiceCharge(id).then(async function(){
        scTbl.bootstrapTable("destroy").bootstrapTable({
            data: await crudiAjax(id,"/transaction/inhouse/view/billing/serviceCharge/populte/table","post")
        });
    })

    // billing Payement
    addPayment(id).then(async function(){
        payTbl.bootstrapTable("destroy").bootstrapTable({
            data: await crudiAjax(id,"/transaction/inhouse/view/billing/payment/populte/table","post")
        });
    })  

    // notes
    $("#tihvnSave").on("click",async function(){
        var data = {
            notes: quill.getContents(),
            id: id
        }
        var crudiAjaxResult = await crudiAjax(data, "/transaction/inhouse/view/notes", 'put')
        // show toast
        $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
        $(".toast").find(".toast-title").text("Update Notes")
    });

    // images
    saveEditImage().then(function(){
            
    })
        
    //======================================================
    // Dropdown functionalities
    //======================================================
    // repair details edit
    // Location - inhouse/modal/dropDown/repairDetails/edit-repair.js
    editRepair(id).then(function(){
        tihvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill,partsTbl,transpoTbl,scTbl,payTbl);
    })

    // upload image 
    // add image (save)
    addImage(id).then(function(){
        tihvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill,partsTbl,transpoTbl,scTbl,payTbl);
    })

    // release (save)
    release(id)

    // tags
    updateTags(id).then(function(){
        tihvPopulateData(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill,partsTbl,transpoTbl,scTbl,payTbl);
    })

    // print - Initial Report
    $('#tihvdReport').on('click',function(){
        $(this).attr('href','/transaction/inhouse/view/print/serviceReport/'+ id)
    })

    

    //======================================================
    // Data Population
    //======================================================
    //population of data
    var currentTransaction = crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post');
    tihvPopulateData(currentTransaction,quill,partsTbl,transpoTbl,scTbl,payTbl); // populate data

    //======================================================
    // Data Population - Edit Client
    //======================================================
    // populate edit client individual on click on edit
    $("#tihvClientEdit").on('click',async function() {
        // check if individual or corporate
        if  (currentTransaction.Client.isIndividual){
            // input client id 
            clientEditIndividual(currentTransaction.Client._id).then( function() {
                //update all client info
                tihvPopulateData.clear().rows.add(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill,partsTbl,transpoTbl,scTbl,payTbl);
            });
        } else {
            clientEditCorporate(currentTransaction.Client._id).then( function() {
                //update all client info
                tihvPopulateData.clear().rows.add(crudiAjax({id: id}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill,partsTbl,transpoTbl,scTbl,payTbl);
            });
        }
    });
});

async function tihvPopulateData(data,quill,partsTbl,transpoTbl,scTbl,payTbl) {
    //======================================================
    // Populate Data on view
    //======================================================
    //header details
    $('#tihvTitleJobOrder').text(data.JobOrder);
    $('#tihvTitleDevice').text(data.Device);
    $('#tihvTitleSerial').text("("+ data.SerialNumber + ")");
    // breadcrumbs
    $('#tihvbcJobOrder').text(data.JobOrder);

    quill.setContents(data.Notes); // job order notes

    // tags    
    $('#tihvtStatus .badge').remove() //remove all badges first 
    //re initialize tags (Temporary Status)
    data.TempStatus.forEach(function(status){
        $('#tihvtStatus').append("<span class='badge bg-warning text-dark m-1'>" + status + "</span>")
    })
    //re initialize tags (Fixed Status)
    data.FixedStatus.forEach(function(status){
        $('#tihvtStatus').append("<span class='badge bg-success text-light m-1'>" + status + "</span>")
    })


    //======================================================
    // Dropdown
    //======================================================
    //tags initialize
    initializeEditTags(data)
    // Location - inhouse/modal/dropDown/image/add-image.js
    addImageInitialize("tihviImage","tihviPreviewModal") // image preview
    // view Repair
    viewRepair(data)
    

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
    // Accordion 
    //======================================================
    // images
    // clear all images first on list
    $('#tihviList').empty();
    // Populate images

    if (!data.Images || data.Images.length === 0) { // if images is empty
        $("#tihvImage").hide();
    } else {
        data.Images.forEach(function image(img, i) {
            var sanitizedTitle = img.Title.replace(/ /g, '&nbsp;'); // Replace spaces with non-breaking spaces
            var sanitizedDescription = img.Description.replace(/ /g, '&nbsp;'); // Replace spaces with non-breaking spaces
            $('#tihviList').append("<li class='list-group-item list-group-item-action tihviListItem d-flex justify-content-between' data-title='" + sanitizedTitle + "' data-id='" + img._id + "' data-b64='" + img.base64String + "' data-desc='" + sanitizedDescription + "'>"
                + sanitizedTitle + 
                "<span>\
                    <i class='bi bi-pencil-square text-white p-1 px-2 text-white bg-warning rounded tihviEdit' data-bs-toggle='modal' data-bs-target='#tihviEditModal'></i>\
                    <i class='bi bi-trash text-white p-1 px-2 bg-danger rounded mx-1 tihviDelete'></i>\
                </span>\
            </li>");
        })
        // images
        // add click function on each image
        $('.tihviListItem').on('click', function() {
            $('.tihviListItem').removeClass('bg-primary');
            $(this).addClass('bg-primary')
            $('#tihviPreview').attr('src', $(this).attr('data-b64'));
            $('#tihviDescription').text($(this).attr('data-desc'));
        })
        initializeEditImage()
    }

    // billing parts
    initializeAddParts()


    //======================================================
    // billing Accordion initialize table
    //======================================================
    // parts
    partsTbl.bootstrapTable("destroy").bootstrapTable({
        data: await crudiAjax(id,"/transaction/inhouse/view/billing/parts/populte/table","post")
    });

    // transporation
    transpoTbl.bootstrapTable("destroy").bootstrapTable({
        data: await crudiAjax(id,"/transaction/inhouse/view/billing/transporation/populte/table","post")
    });

    // service charge
    scTbl.bootstrapTable("destroy").bootstrapTable({
        data: await crudiAjax(id,"/transaction/inhouse/view/billing/serviceCharge/populte/table","post")
    });
    // payment
    payTbl.bootstrapTable("destroy").bootstrapTable({
        data: await crudiAjax(id,"/transaction/inhouse/view/billing/payment/populte/table","post")
    });

    // billing summary auto compute with table build
    billingSummary(data.Billing,"tihvbsTable")
}