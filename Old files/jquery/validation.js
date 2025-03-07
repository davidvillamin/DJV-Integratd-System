function isInvalid(event) {
    event.preventDefault();
    event.stopPropagation();
    // toast incomplete details
    toaster({
        text:'The entered details are incomplete.',
        header:'Validation Error',
        icon:'error'
    })
    $('.needs-validation').closest('form').addClass('was-validated');
};