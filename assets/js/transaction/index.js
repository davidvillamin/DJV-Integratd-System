$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });
    
    $("#sbinhouse").removeClass("collapsed");
    
    var quill = quillInit("tihcNotes")
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    
})