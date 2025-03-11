function viewRepair(data){
    $('#tihvrJobOrder').text(data.JobOrder);
    $('#tihvrRecieveDate').text(moment(data.RecieveDate).format("MMMM DD, YYYY"));
    $('#tihvrDevice').text(data.Device);
    $('#tihvrSerial').text(data.SerialNumber);
    $('#tihvrServiceCharge').text(data.ServiceCharge);
    
    if (data.Technician){ //if there is a technician in the db.
        $('#tihvrTechnician').text(data.Technician);
    } 
}