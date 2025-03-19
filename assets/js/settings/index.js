$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });

    //remove class collapsed after click on sidebar
    $("#sbsettings").removeClass("collapsed");
    
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    
})