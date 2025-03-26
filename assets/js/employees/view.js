var id = window.location.href.split('/')[window.location.href.split('/').length - 1];
$(function () {
    //======================================================
    // Loading Screen
    //======================================================
    // hide loading screen
    $(window).on('load', function () {
        $("#loadingScreen").attr('style', 'display: none !important');
    });

    $("#sbemployees").removeClass("collapsed");
    // initialize toast
    $(".toast").toast({
        delay: 5000
    });

    var currentEmployee = crudiAjax({id: id}, "/employee/view/ajax", 'Post')
    employeeData(currentEmployee);

    

    editEmployee()

    // var createdData = crudiAjax({id: id}, "/employees/get/created", "POST");
    // populateCreatedData(createdData);

    

    
})

function employeeData(employee) {


    //================================================================================================
    // Personal Data
    //================================================================================================ 
    $('.evName').text(employee.Name)
    $('#eiName').text(employee.Name)
    $('#eiJob').text(employee.JobTitle)
    $('#eiAge').text(employee.Age)
    $('#eiAddress').text(employee.Address)
    $('#eiContactNumber').text(employee.ContactDetails[0].ContactNumber)
    $('#eiPlaceofBirth').text(employee.PlaceofBirth)
    $('#eiDateofBirth').text(moment(employee.DateofBirth).format("MMM-DD-YYYY")); // Set formatted date
    $('#eiGender').text(employee.isMale)
    $('#eiHeight').text(employee.Height)
    $('#eiWeight').text(employee.Weight)
    $('#eiReligion').text(employee.Religion)
    $('#eiCitizenship').text(employee.Citizenship)
    $('#eiCivilStatus').text(employee.CivilStatus)
    $('#eiSpouse').text(employee.Spouse)
    $('#eiChildrenNames').text(employee.Children[0].ChildrenName)
    $('#eiMotherName').text(employee.MothersName)
    $('#eiMotherOccupation').text(employee.MothersOccupation)
    $('#eiFatherName').text(employee.FathersName)
    $('#eiFatherOccupation').text(employee.FathersOccupation)
    $('#eiParentAddress').text(employee.ParentsAddress)
    $('#eiParentContactNumber').text(employee.ParentsContactNumber)
    
}

// function populateCreatedData(data) {
    // $('#eiAge').text(employee.Age);
    
// }

