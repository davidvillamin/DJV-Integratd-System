var tihId = window.location.href.split('/')[window.location.href.split('/').length - 1];

$(async function(){
    //======================================================
    // Loading Screen / toast / Quill
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });

    // initialize toast
    $(".toast").toast({
        delay: 5000
    });
    
    // Check if Quill is already initialized for this element
    if (!window.quillInstances) {
        window.quillInstances = {};
    }

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
    // initialize
    initialize(tihId)

    //======================================================
    // Client Profile Information and Tags
    //======================================================
    //Tags
    

    //======================================================
    // Accordion 
    //======================================================

    initializeAddParts(
        tihId, // transaction id
        '#tiiTable', //item Information tableName
        '#tiisTable', //item Serial tableName
        '#tiisAdd', // item Serial Form
        '#tiisAddModal',// Item Serial Modal Name
        "#tiisBrand", //itemBrand
        "#tiisModel", //item model
        "#tiisDescription", // item descrition
        '#tiiAddModal', // item Information Modal
        '#tiisAddModal', // item Serial Modal
    ).then(function(){
        initialize(tihId)
    })
    // add transportation only no initialize transporation needed
    addTransportation(
        tihId, // transaction id
        '#ttAdd', // transportation form
        '#ttAddModal' // transporation modal
    ).then(function(){
        initialize(tihId)  
    })

    // add service Charge only no initialize Service charge needed
    addServiceCharge(
        tihId, // transaction id
        '#tscAdd', // transportation form
        '#tscAddModal' // transporation modal
    ).then(function(){
        initialize(tihId)  
    })

    // add Payment only no initialize Payment needed
    addPayment(
        tihId, // transaction id
        '#tpayAdd', // transportation form
        '#tpayAddModal' // transporation modal
    ).then(function(){
        initialize(tihId)  
    })

    // // notes
    // $("#tihvnSave").on("click",async function(){
    //     var data = {
    //         notes: quill.getContents(),
    //         id: tihId
    //     }
    //     var crudiAjaxResult = await crudiAjax(data, "/transaction/inhouse/view/notes", 'put')
    //     // show toast
    //     $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
    //     $(".toast").find(".toast-title").text("Update Notes")
    // });

    // // images
    // // saveEditImage().then(function(){
            
    // // })
        
    //======================================================
    // Dropdown functionalities
    //======================================================

    // edit tranasaction 
    $("#tihrEdit").on("click", async function () {
        var transaction = await crudiAjax({ tihId: tihId }, "/transaction/inhouse/edit", "POST");
        // populate data on edit modal
        initEditTransactionInhouse(transaction).then(function(){
            initialize(tihId)
        })
    });

    // image add
    addImageInitialize("tiaImage","tiaPreview") // image preview

    // // repair details edit
    // // Location - inhouse/modal/dropDown/repairDetails/edit-repair.js
    // editRepair(tihId).then(function(){
    //     tihvPopulateData(crudiAjax({tihId: tihId}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill,partsTbl,transpoTbl,scTbl,payTbl);
    // })

    // // upload image 
    // // add image (save)
    // addImage(tihId).then(function(){
    //     tihvPopulateData(crudiAjax({tihId: tihId}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill,partsTbl,transpoTbl,scTbl,payTbl);
    // })

    // // release (save)
    // release(tihId)

    // // tags
    // updateTags(tihId).then(function(){
    //     tihvPopulateData(crudiAjax({tihId: tihId}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill,partsTbl,transpoTbl,scTbl,payTbl);
    // })

    // // print - Initial Report
    // $('#tihvdReport').on('click',function(){
    //     $(this).attr('href','/transaction/inhouse/view/print/serviceReport/'+ tihId)
    // })


    // //======================================================
    // // Data Population - Edit Client
    // //======================================================
    // // populate edit client individual on click on edit
    // $("#tihvClientEdit").on('click',async function() {
    //     // check if individual or corporate
    //     if  (currentTransaction.Client.isIndividual){
    //         // input client id 
    //         clientEditIndividual(currentTransaction.Client._id).then( function() {
    //             //update all client info
    //             tihvPopulateData.clear().rows.add(crudiAjax({tihId: tihId}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill,partsTbl,transpoTbl,scTbl,payTbl);
    //         });
    //     } else {
    //         clientEditCorporate(currentTransaction.Client._id).then( function() {
    //             //update all client info
    //             tihvPopulateData.clear().rows.add(crudiAjax({tihId: tihId}, "/transaction/inhouse/view/populate/transaction", 'Post'),quill,partsTbl,transpoTbl,scTbl,payTbl);
    //         });
    //     }
    // });
});

async function initialize(tihId) {
    var transaction = await crudiAjax({tihId: tihId}, "/transaction/inhouse/view/populate/transaction", 'post');
    console.log(transaction)

    readTransactionInhouse(transaction)
    
    //======================================================
    // Populate Data on view
    //======================================================
    $('#tihvTitleJobOrder').text(transaction.JobOrder)
    $('#tihvTitleDevice').text(transaction.Device)
    $('#tihvTitleSerial').text(transaction.SerialNumber)
    // breadcrumbs
    $('#tihvbcJobOrder').text(transaction.JobOrder);
    // initialize quill
    if (!window.quillInstances["tihvNotes"]) {
        // Quill is not initialized, initialize it
        window.quillInstances["tihvNotes"] = quillInit("tihvNotes");
    }

    // there is a bug when you edit the page transaction setContents  is undefined
    var tihvQuill = window.quillInstances["tihvNotes"]; 
    await tihvQuill.setContents(transaction.Notes); // job order notes

    // tags    
    $('#tihvTags .badge').remove() //remove all badges first 
    $('#tihvTags').append(tagGenerator(transaction.Tags))

    //======================================================
    // Client Details 
    //======================================================
    initClient(transaction)
    

    //======================================================
    // Accordion 
    //======================================================
    // images
    initAccordionImage(transaction)

    //======================================================
    // Dropdown
    //======================================================
    // // tags initialize
    // initializeEditTags(transaction)

    

    // // view
    // viewRepair(transaction)

    //======================================================
    // billing Accordion initialize table
    //======================================================
    //Payment
    initBootstrapTable(
        "#tihvbpayTable", // table name
        ["_id","Description", "Date", "Amount"], // tableHead
        ['_id'] , //hiddenColumns
        ["_id","Description", "Date", "Amount"], //dataField
        //tpay = transaction Payment
        paymentSummary(
            transaction.Billing, //data
            "tpayEdit", //edit btn class
            "tpayDelete", //delete btn class
            "#", //edit modal
            "#"), //delete modal
        false, //with search
        '.tpayEdit', //edit name
        '.tpayDelete' // delete name
    ) 
        
    //Parts
    initBootstrapTable(
        "#tihvbpTable", // table name
        ["_id","Description", "Serial", "Price"], // tableHead
        ["_id"] , //hiddenColumns
        ["_id","Description", "Serial", "Price"], //dataField
        //tp = transaction parts
        partsSummary(
            transaction.Billing, //data
            "tpEdit", //edit btn class
            "tpDelete", //delete btn class
            "#", //edit modal
            "#"), //delete modal
        false, //with search
        '.tpEdit', //edit name
        '.tpDelete' // delete name
    ) 

    //Service Charge
    initBootstrapTable(
        "#tihvbscTable", // table name
        ["_id","Description", "Price"], // tableHead
        ["_id"] , //hiddenColumns
        ["_id","Description", "Price"], //dataField
        serviceChargeSummary(
            transaction.Billing, //data
            "tscEdit", //edit btn class
            "tscDelete", //delete btn class
            "#", //edit modal
            "#"), //delete modal
        false, //with search
        '.tscEdit', //edit name
        '.tscDelete' // delete name
    )

    //transportation
    initBootstrapTable(
        "#tihvbtTable", // table name
        ["_id","Description", "Quantity","Price"], // tableHead
        ["_id"] , //hiddenColumns
        ["_id","Description", "Quantity","Price"], //dataField
        transporationSummary(
            transaction.Billing, //data
            "ttEdit", //edit btn class
            "ttDelete", //delete btn class
            "#", //edit modal
            "#"), //delete modal
        false, //with search
        '.ttEdit', //edit name
        '.ttDelete' // delete name
    )

    //billing summary
    initBootstrapTable(
        "#tihvbsTable", // table name
        ["Description", "Quantity", "Unit Price", "Total"], // tableHead
        [] , //hiddenColumns
        ["Description", "Quantity", "UnitPrice", "Total"], //dataField
        billingSummary(transaction.Billing),
        false) //tableData

}

function initClient(transaction){
    $('#tihvClientName').text(transaction.Client.Name);
    $('#tihvClientAddress').append(transaction.Client.Address);
    $('#tihCreateNotes').append(transaction.Client.Notes);

    // clear li items on contact numbers
    $('#tihvClientContactNumbers').empty();
    //profile image / contact numbers and edit client modal target
    if (transaction.Client.isIndividual) {
        // logo image identification if fale of female
        if (transaction.Client.isMale) {
            $('#tihvProfile').attr('src', '/assets/img/male.png');
        } else {
            $('#tihvProfile').attr('src', '/assets/img/female.jpg');
        }
        //edit client individual modal target
        $('#tihvClientEdit').attr('data-bs-target', "#ciEditModal");

        // loop contact number
        transaction.Client.ContactDetails.forEach(function(number) {
            $('#tihvClientContactNumbers').append('<li>' + number + '</li>');
        });
    } else {
        // coroporate profile image
        $('#tihvProfile').attr('src', '/assets/img/company.jpg');
        // edit client corporate modal target
        $('#tihvClientEdit').attr('data-bs-target', "#ccEditModal");

        // loop contact person with number
        transaction.Client.ContactDetails.forEach(function(detail) {
            $('#tihvClientContactNumbers').append('<li><strong>' + detail.ContactPerson + ':</strong> ' + detail.ContactNumber + ' </li>');
        });
    }
}

function initAccordionImage(transaction){
    // clear all images first on list
    $('#tihviList').empty();
    // Populate images

    if (!transaction.Images || transaction.Images.length === 0) { // if images is empty
        $("#tihvImage").hide();
    } else {
        transaction.Images.forEach(function image(img, i) {
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
        // initializeEditImage()
    }
}