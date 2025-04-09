var id = window.location.href.split('/')[window.location.href.split('/').length - 1]
$(async function(){

    var initialTransactionData = await crudiAjax({id:id}, "/transaction/report/serviceReport", 'Post');
    initialPrint(initialTransactionData);
    
    // retrun button
    $('#tihvpRetrun').on('click', function() {
        window.location.href = '/transaction/inhouse/view/' + id;
    });

    // Open print functionality after the page loads
    window.onload = function() {
        window.print();
    };
})

function initialPrint(data){
    $('#tihvpJobOrder').text(data.JobOrder);
    $('#tihvpReceivedDate').text(moment(data.RecieveDate).format("MMMM DD, YYYY"));
    $('#tihvpDevice').text(data.Device);
    $('#tihvpSerialNumber').text(data.SerialNumber);
    $('.tihvpCLientName').text(data.Client.Name);
    $('#tihvpAddress').text(data.Client.Address);
    $('#tihvpEmail').text(data.Client.Email);

    var contactStr = ""
    if (data.Client.isIndividual){
        data.Client.ContactDetails.forEach(function(contact) {
            contactStr += contact + "  /  "
        });
        // data.Client.ContactDetails.foreach(function(contact){
        //     contactStr = contactStr + contact + " / "
        // })
        $('#tihvpContactDetails').text(contactStr);
    } else {
        // contactStr += "\n";
        data.Client.ContactDetails.forEach(function(contact) {
            contactStr += contact.ContactPerson + " : " + contact.ContactNumber + "   ";
        });
        $('#tihvpContactDetails').text(contactStr);
    }
    
    // initialize quill
    var quill = new Quill('#tihvpNotes', {
        theme: 'snow',
        modules: {
            toolbar: false
        }
    });
    //change font size 
    $('#tihvpNotes .ql-editor').css('font-size', '10px');
    quill.setContents(data.Notes) // populate data

    // billing
    billingSummary(data.Billing, "tihvpBilling")

    $('#tihvpBilling td').css({
        'padding': '0',
        'text-align': 'center'
    });
    $('#tihvpBilling div').css({
        'padding': '0',
        'text-align': 'center'
    });


    var rowContainer = $('<div class="row" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; page-break-inside: avoid; width: 100%;"></div>');
    data.Images.forEach(function(image, index) {
        var card = `
            <div class="card my-1" style="width: 30%; flex: 0 0 30%; page-break-inside: avoid;">
                <img src=` + image.base64String + ` class="card-img-top" alt="` + image.Title + `" style="width: 100%; height: 100px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">` + image.Title + `</h5>
                    <p class="card-text">` + image.Description + `</p>
                </div>
            </div>
        `;
        rowContainer.append(card);

        if ((index + 1) % 3 === 0 || index === data.Images.length - 1) {
            $('#tihvpImages').append(rowContainer);
            rowContainer = $('<div class="row" style="display: flex; flex-wrap: wrap; gap: 10px; page-break-inside: avoid; width: 100%;"></div>');
        }
    });
}


