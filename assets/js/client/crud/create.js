//in this file all codes need for creating client using modal \views\client\modal\create.ejs
//just call this create client function
// legend prefix :
// cci - Client Create Individual
// ccc - Client Create Corporate

// need to put datatable variable for repopulating of table (if needed)
function createClient(dTable){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
    // Individual
    // adding event listener
    listenerContactNumberAdd();
    listenerContactNumberDelete();

    // create transaction
    $('#cCreateIndividual :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var contactNumbers = [];
            // populate all contact number and compress it to an array
            $('.cciContactNumber').each(function() {
                contactNumbers.push($(this).val());
            });

            var data = {
                Name:$('#cciName').val(),
                Address:$('#cciAddress').val(),
                Email:$('#cciEmail').val(),
                isIndividual:true,
                isMale:$('input[name="cciGender"]:checked').val(),
                Notes: $("#cciNotes").val(),
                ContactDetails: contactNumbers,
            }

            // save data on a variable for confirmation
            var crudiAjaxResult = crudiAjax(data, "/client/create", "Post")
            // re initialize table
            initializeTable(dTable)
            // clear form
            $('#cCreateIndividual')[0].reset();
            // close modal   
            $('#cCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
            $(".toast").find(".toast-title").text("New Client")
        }
    })

    // end of Indiviual
    //=================================================================================

    //Company
    // add contact person (Company)
    listenerContactPersonAdd();
    listenerContactPersonDelete();

    //create transaction
    $('#cCreateCorporate :submit').on('click',function(e){
        if ($(this).closest('form').is(':valid') === true){
            e.preventDefault();
            var contactDetails = [];

            $('.cccContactPersonGroup').each(function() {
                var tempObject = {};
                tempObject.ContactPerson = $(this).find('.cccContactPerson').val()
                tempObject.ContactNumber = $(this).find('.cccContactNumber').val()
                contactDetails.push(tempObject);
            });

            var data = {
                Name:$('#cccName').val(),
                Address:$('#cccAddress').val(),
                Email:$('#cccEmail').val(),
                isIndividual:false,
                Notes: $("#cccNotes").html(),
                ContactDetails: contactDetails,
            }
            // save data on a variable for confirmation
            var crudiAjaxResult = crudiAjax(data, "/client/create", "Post")
            // re initialize table
            initializeTable(dTable)
            // clear form
            $('#cCreateCorporate')[0].reset();
            // close modal   
            $('#cCreateModal').modal('toggle'); // fix modal toggle method
            $('.modal-backdrop').remove(); // ensure backdrop is removed
            // show toast
            $(".toast").toast("show").find(".toast-body").text(crudiAjaxResult)
            $(".toast").find(".toast-title").text("New transaction")
        }
    })
}
    //==================================================================
    // for Individual
    function listenerContactNumberAdd() {
        //cciContactNumberAdd = Client Create Individual Contact Number
        $(".cciContactNumberAdd").off('click').on('click', function(){
            var newContactGroup = $('.cciContactNumberGroup').first().clone();
            newContactGroup.find('input').val('');
            newContactGroup.insertBefore($(this).closest('.cciContactNumberGroup'));
            listenerContactNumberAdd(); // re-attach listener to new elements
            listenerContactNumberDelete(); // re-attach delete listener to new elements
        });
    }

    function listenerContactNumberDelete() {
        // cciContactNumberDelete = Client Create Indivial Contact Number Delete
        $(".cciContactNumberDelete").off('click').on('click', function(){
            if ($('.cciContactNumberGroup').length > 1) {
                $(this).closest('.cciContactNumberGroup').remove();
            }
        });
    }
// end of Individual
//==================================================================
//==================================================================
// for corporate
function listenerContactPersonAdd() {
    $(".cccContactAdd").off('click').on('click', function(){
        var newContactGroup = $('.cccContactPersonGroup').first().clone();
        newContactGroup.find('input').val('');
        newContactGroup.insertBefore($(this).closest('.cccContactPersonGroup'));
        listenerContactPersonAdd(); // re-attach listener to new elements
        listenerContactPersonDelete(); // re-attach delete listener to new elements
    });
}
function listenerContactPersonDelete() {
    $(".cccContactDelete").off('click').on('click', function(){
        if ($('.cccContactPersonGroup').length > 1) {
            $(this).closest('.cccContactPersonGroup').remove();
        }
    });
}
//end for Corporate
//==================================================================