function EmployeeTimeSettings() {
    $('#saveEmployeeSettingsBtn').on('submit',function(e){
        if ($(this).closest('form').is(':valid') === true) {
            e.preventDefault();
            
        }
    })
}