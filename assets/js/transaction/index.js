$(function(){
    // collapse sidebar nav link and set active link
    $("#sbTransaction").addClass("active");
    $("#sbTransactionSub").addClass("in");
    $("sbTransactionSubOverview").addClass("active");
    
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