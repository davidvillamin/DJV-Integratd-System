function readTransactionInhouse(transaction){
    //header details
    $('#tihrJobOrderNumber').text(transaction.JobOrder);
    $('#tihrRecievedDate').text(moment(transaction.RecievedDate).format("MMM-DD-YYYY"));
    $('#tihrReceivedBy').text(transaction.RecievedBy);
    $('#tihrClientName').text(transaction.Client.Name);
    $('#tihrDevice').text(transaction.Device);
    $('#tihrSerial').text(transaction.SerialNumber);
}