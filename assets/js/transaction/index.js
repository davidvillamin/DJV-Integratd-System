$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    loadingScreen();
    // collapse sidebar nav link and set active link
    $("#forms-nav-transaction").addClass("show");
    $("#sbtransaction").removeClass("collapsed");
    
    // initalize create transaction
    createTransaction();
})