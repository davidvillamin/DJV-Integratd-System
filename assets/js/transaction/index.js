$(function(){
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    loadingScreen();
    // collapse sidebar nav link and set active link
    $("#forms-nav-transaction").addClass("show");
    $("#sbtransaction").removeClass("collapsed");
    
    initialize();

    // initalize create transaction
    createTransaction();

    // create client on transaction create modal
    createClient()
})

function initialize(){

    new Chart($('#tiTransactionChart'), {
        data: {
            datasets: [
            {
                type: 'bar',
                label: 'Bar Dataset',
                data: [10, 20, 30, 40]
            }, 
            {
                type: 'bar',
                label: 'Bar Dataset',
                data: [10, 20, 30, 40]
            }, 
            {
                type: 'line',
                label: 'Line Dataset',
                data: [30, 20, 11, 40],
            },
            {
                type: 'line',
                label: 'Line Dataset',
                data: [11, 20, 25, 30],
            }
            ],
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
    });
}