var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(async function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function() {
        $("#loadingScreen").attr('style', 'display: none !important');
    });

    $("#sbsettings").removeClass("collapsed");
     // initialize toast
     $(".toast").toast({
        delay: 5000
    });

    
})
