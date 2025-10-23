// this will retrieve and edit device notes
function InitializeEditNotes() {
    // initialize Quill editors: editable dveNotes, read-only dvNotes
    let dveNotes = new Quill('#dveNotes', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean']
            ]
        }
    });

    // get data form server
    var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    crudiAjax({ id: id }, "/device/deviceinformation/view/name", 'Post').then(function (deviceInformationData) {
        dveNotes.setContents(deviceInformationData.Notes ? JSON.parse(deviceInformationData.Notes) : '');
    });
    

}