function editTags(){
    // hide all tags first on start
    // $('#tihvteSample .badge').css('display','none');
    $('#tihvteSample .badge').hide();

    // //add on toggle effects
    $('#tihvteSwitch input[type="checkbox"]').on('change', function() {
        $('.' + $(this).attr('name')).toggle(this.checked);
    });
}