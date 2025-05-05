
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

    const today = moment();
    let todaysEntry = null;
    const timeRecords = currentEmployee.Time || []; // Ensure Time array exists
    const $timeinBtn = $('#timeinBtn'); // Cache the jQuery object

    // Find the latest entry for today
    // Iterate backwards to find the most recent entry for the day if multiple exist
    for (let i = timeRecords.length - 1; i >= 0; i--) {
        const entry = timeRecords[i];
        // Check if the entry has a TimeIn or TimeOut and if it's for today
        if ((entry.TimeIn || entry.TimeOut) && moment(entry.TimeIn || entry.TimeOut).isSame(today, 'day')) {
            todaysEntry = entry;
            break; // Found the latest entry for today
        }
    }

    if (todaysEntry) {
      if (todaysEntry.TimeOut) {
          // Already timed in and out today
          $timeinBtn.text('Time Out'); // Keep text as 'Time Out'
          // **** Disable button if TimeOut exists for today ****
          $timeinBtn.prop('disabled', true);
          console.log("Initial State: Time In/Out already completed for today. Button disabled.");
      }
      else if (todaysEntry.TimeIn) { // Check specifically for TimeIn if TimeOut is missing
          // Timed in, but not out yet
          $timeinBtn.text('Time Out');
          $timeinBtn.prop('disabled', false); // Ensure it's enabled for time out
          console.log("Initial State: Already timed in today. Button set to 'Time Out'.");
      } else {
           // Edge case: Found an entry for today but it has neither TimeIn nor TimeOut? Unlikely.
           // Treat as if no entry found.
          $timeinBtn.text('Time In');
          $timeinBtn.prop('disabled', false);
          console.log("Initial State: Found entry for today but no TimeIn/TimeOut? Ready for Time In.");
      }
    } else {
      // No time in record for today yet
      $timeinBtn.text('Time In');
      $timeinBtn.prop('disabled', false); // Ensure it's enabled for time in
      console.log("Initial State: Ready for Time In.");
    }
    
    editEmployee()
    EmployeeTimeTable();

    $('#attendanceTable').DataTable({
        // Process the Time array from the fetched employee data
        data: processTimeDataForTable(currentEmployee.Time || []), // Use || [] as fallback
        columns: [
            { data: 'date' },
            { data: 'status', className: 'text-center' }, // Center status text/badge
            { data: 'time' }
        ],
        pageLength: 10, // Increased page length slightly
        searching: false, // Keep searching off for this view
        // Order is now handled by the processTimeDataForTable function
        order: [], // Disable initial DataTables sorting, rely on processed data order
        language: {
            emptyTable: "No attendance records found." // Custom message
        }
    });
})

function processTimeDataForTable(timeArray) {
    const timeList = [];
    if (!timeArray || timeArray.length === 0) {
        return timeList; // Return empty if no time data
    }

    // Helper function for rounding (ensure moment.js is loaded)
    function roundToNearest15(date) {
        if (!date) return null;
        const momentDate = moment(date);
        const minutes = momentDate.minutes();
        let roundedMinutes;

        if (minutes >= 0 && minutes <= 7) {
            roundedMinutes = 0;
        } else if (minutes >= 8 && minutes <= 22) {
            roundedMinutes = 15;
        } else if (minutes >= 23 && minutes <= 37) {
            roundedMinutes = 30;
        } else if (minutes >= 38 && minutes <= 52) {
            roundedMinutes = 45;
        } else {
            roundedMinutes = 0;
            momentDate.add(1, 'hour');
        }

        momentDate.minutes(roundedMinutes);
        momentDate.seconds(0);
        momentDate.milliseconds(0);
        return momentDate;
    }

    // Sort time entries chronologically based on TimeIn or TimeOut
    const sortedTimeEntries = [...timeArray].sort((a, b) => { // Use spread to avoid modifying original
        const dateA = a.TimeIn ? moment(a.TimeIn) : (a.TimeOut ? moment(a.TimeOut) : null);
        const dateB = b.TimeIn ? moment(b.TimeIn) : (b.TimeOut ? moment(b.TimeOut) : null);
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA - dateB;
    });

    sortedTimeEntries.forEach((timeEntry) => {
        const entryMoment = timeEntry.TimeIn ? moment(timeEntry.TimeIn) : (timeEntry.TimeOut ? moment(timeEntry.TimeOut) : null);
        if (!entryMoment) return; // Skip if no valid date

        const dateFormatted = entryMoment.format("MMMM DD, YYYY");

        // Process Time In
        if (timeEntry.TimeIn) {
            const timeInMoment = moment(timeEntry.TimeIn);
            const roundedTimeIn = roundToNearest15(timeInMoment);
            const timeInFormatted = roundedTimeIn.format("hh:mm A");

            const dateStr = timeInMoment.format("YYYY-MM-DD");
            const onTimeStart = moment(dateStr + " 08:00", "YYYY-MM-DD HH:mm");
            const onTimeEnd = moment(dateStr + " 08:14:59", "YYYY-MM-DD HH:mm:ss");
            const yellowStart = moment(dateStr + " 08:15", "YYYY-MM-DD HH:mm");
            const yellowEnd = moment(dateStr + " 08:59:59", "YYYY-MM-DD HH:mm:ss");
            // const orangeStart = moment(dateStr + " 09:00", "YYYY-MM-DD HH:mm"); // Not strictly needed for logic

            let statusClass = "late-orange"; // Default to latest
            if (roundedTimeIn.isBetween(onTimeStart, onTimeEnd, null, '[]')) {
                statusClass = "on-time";
            } else if (roundedTimeIn.isBetween(yellowStart, yellowEnd, null, '[]')) {
                statusClass = "late-yellow";
            }

            timeList.push({
                // employeeName: employee.Name, // Not needed for single employee view
                date: dateFormatted,
                status: `<span class="attendance-status ${statusClass}">Time In</span>`,
                time: timeInFormatted,
                // _id: employee._id // Not needed for single employee view
                timestamp: timeInMoment.valueOf() // Add timestamp for sorting TimeIn/TimeOut on same day
            });
        }

        // Process Time Out
        if (timeEntry.TimeOut) {
            // *** This part processes the recorded TimeOut from the database for display ***
            // Using moment(now) here would display the current time for all past records, which is incorrect.
            // The logic to use moment(now) when the *action* of timing out occurs is correctly placed
            // in assets/js/employees/modal/time.js
            const timeOutMoment = moment(timeEntry.TimeOut); // Use the actual recorded TimeOut
            const roundedTimeOut = roundToNearest15(timeOutMoment);
            const timeOutFormatted = roundedTimeOut.format("hh:mm A");

            timeList.push({
                // employeeName: employee.Name, // Not needed
                date: dateFormatted, // Use same date as TimeIn for consistency if available
                status: "Time Out",
                time: timeOutFormatted, // Display the formatted recorded TimeOut
                // _id: employee._id // Not needed
                timestamp: timeOutMoment.valueOf() // Use the recorded TimeOut timestamp for sorting
            });
        }
    });

    // Sort the final list: Descending date, then Ascending time (TimeIn before TimeOut)
    timeList.sort((a, b) => {
        const dateComparison = moment(b.date, "MMMM DD, YYYY").valueOf() - moment(a.date, "MMMM DD, YYYY").valueOf();
        if (dateComparison !== 0) {
            return dateComparison;
        }
        // If dates are the same, sort by timestamp ascending
        return a.timestamp - b.timestamp;
    });

    // Remove the temporary timestamp property before returning
    return timeList.map(({ timestamp, ...rest }) => rest);
}

function employeeData(employee) {
    //================================================================================================
    // Personal Data
    //================================================================================================ 
    $('.evName').text(employee.Name)
    $('.eiProfileJobTitle').text(employee.JobTitle)
    $('.evProfileName').text(employee.Name)
    $('#eiName').text(employee.Name)
    $('#eiJob').text(employee.JobTitle)
    $('#eiAge').text(employee.Age)
    
    $('#eiPlaceofBirth').text(employee.PlaceofBirth)
    $('#eiDateofBirth').text(moment(employee.DateofBirth).format("MMM-DD-YYYY")); // Set formatted date
    $('#eiGender').text(employee.isMale)
    $('#eiHeight').text(employee.Height)
    $('#eiWeight').text(employee.Weight)
    $('#eiReligion').text(employee.Religion)
    $('#eiCitizenship').text(employee.Citizenship)
    $('#eiCivilStatus').text(employee.CivilStatus)
    $('#eiSpouse').text(employee.Spouse)
    
    $('#eiMotherName').text(employee.MothersName)
    $('#eiMotherOccupation').text(employee.MothersOccupation)
    $('#eiFatherName').text(employee.FathersName)
    $('#eiFatherOccupation').text(employee.FathersOccupation)
    $('#eiParentAddress').text(employee.ParentsAddress)
    $('#eiParentContactNumber').text(employee.ParentsContactNumber)

    if (employee.Address && employee.Address.length > 0) {
        $('#eiAddress').text(employee.Address.map(contact => contact.AddressLine).join(', '));
    } else {
        $('#eiAddress').text('N/A');
    }
    if (employee.ContactDetails && employee.ContactDetails.length > 0) {
        $('#eiContactNumber').text(employee.ContactDetails.map(contact => contact.ContactNumber).join(', '));
    } else {
        $('#eiContactNumber').text('N/A');
    }
    
    if (employee.Children && employee.Children.length > 0) {
        $('#eiChildrenNames').text(employee.Children.map(contact => contact.ChildrenName).join(', '));
    } else {
        $('#eiChildrenNames').text('N/A');
    }

    if (employee.EmergencyDetail && employee.EmergencyDetail.length > 0) {
        // Clear existing emergency details except the first one (if any)
        $('.eiEmergencyDetail:not(:first)').remove();

        // Loop through the EmergencyDetail and populate or add new fields
        employee.EmergencyDetail.forEach(function(emergency, index) {
            if (index > 0) {
                var newEmergencyGroup = $('.eiEmergencyDetail').first().clone();
                newEmergencyGroup.find('.eiEmergencyContactName').text(emergency.eeName);
                newEmergencyGroup.find('.eiEmergencyContactAddress').text(emergency.eeAddress);
                newEmergencyGroup.find('.eiEmergencyContactNumber').text(emergency.eeContactNumber);
                newEmergencyGroup.find('.eiEmergencyContactRelationship').text(emergency.eeRelationship);
                newEmergencyGroup.insertAfter($('.eiEmergencyDetail').last());
            } else {
                $('.eiEmergencyDetail').eq(index).find('.eiEmergencyContactName').text(emergency.eeName);
                $('.eiEmergencyDetail').eq(index).find('.eiEmergencyContactAddress').text(emergency.eeAddress);
                $('.eiEmergencyDetail').eq(index).find('.eiEmergencyContactNumber').text(emergency.eeContactNumber);
                $('.eiEmergencyDetail').eq(index).find('.eiEmergencyContactRelationship').text(emergency.eeRelationship);
            }
        });
    } else {
        $('.eiEmergencyDetail').text('N/A');
    }


    
    
    //================================================================================================
    // Educational Background
    //================================================================================================ 
    $('#eiElementaryName').text(employee.ElementaryName)
    $('#eiElementaryAddress').text(employee.ElementaryAddress)
    $('#eiElementaryYearStart').text(moment(employee.ElementarySchoolYearStart).format("MMM-DD-YYYY"))
    $('#eiElementaryYearEnd').text(moment(employee.ElementarySchoolYearEnd).format("MMM-DD-YYYY"))

    $('#eiJHSName').text(employee.JuniorHighschoolName)
    $('#eiJHSAddress').text(employee.JuniorHighschoolAddress)
    $('#eiJHSYearStart').text(moment(employee.JuniorHighSchoolYearStart).format("MMM-DD-YYYY"))
    $('#eiJHSYearEnd').text(moment(employee.JuniorHighSchoolYearEnd).format("MMM-DD-YYYY"))

    $('#eiSeniorHighSchoolName').text(employee.SeniorHighschoolName)
    $('#eiSeniorHighSchoolAddress').text(employee.SeniorHighschoolAddress)
    $('#eiSeniorHighSchoolYearStart').text(moment(employee.SeniorHighSchoolYearStart).format("MMM-DD-YYYY"))
    $('#eiSeniorHighSchoolYearEnd').text(moment(employee.SeniorHighSchoolYearEnd).format("MMM-DD-YYYY"))

    $('#eiCollegeName').text(employee.CollegeName)
    $('#eiCollegeAddress').text(employee.CollegeAddress)
    $('#eiCollegeYearStart').text(moment(employee.CollegeYearStart).format("MMM-DD-YYYY"))
    $('#eiCollegeYearEnd').text(moment(employee.CollegeYearEnd).format("MMM-DD-YYYY"))
    
    $('#eiCourseName').text(moment(employee.CollegeYearEnd).format("MMM-DD-YYYY"))
    
    //================================================================================================
    // Employment History
    //================================================================================================ 
    
    
    if (employee.Employment && employee.Employment.length > 0) {
        // Clear existing employment details except the first one (if any)
        $('.eiEmploymentRecord:not(:first)').remove();

        // Loop through the Employment and populate or add new fields
        employee.Employment.forEach(function(employment, index) {
            if (index > 0) {
                var newEmploymentGroup = $('.eiEmploymentRecord').first().clone();
                newEmploymentGroup.find('.eivCompanyName').text(employment.erCompanyName);
                newEmploymentGroup.find('.eivPosition').text(employment.erPosition);
                newEmploymentGroup.find('.eivFrom').text(moment(employment.erFrom).format("MMM-DD-YYYY"));
                newEmploymentGroup.find('.eivTo').text(moment(employment.erTo).format("MMM-DD-YYYY"));
                newEmploymentGroup.insertAfter($('.eiEmploymentRecord').last());
            } else {
                $('.eiEmploymentRecord').eq(index).find('.eivCompanyName').text(employment.erCompanyName);
                $('.eiEmploymentRecord').eq(index).find('.eivPosition').text(employment.erPosition);
                $('.eiEmploymentRecord').eq(index).find('.eivFrom').text(moment(employment.erFrom).format("MMM-DD-YYYY"));
                $('.eiEmploymentRecord').eq(index).find('.eivTo').text(moment(employment.erTo).format("MMM-DD-YYYY"));
            }
        });
    } else {
        $('.eiEmploymentRecord').text('N/A');
    }

    
    
    //================================================================================================
    // CHARACTER REFERENCE
    //================================================================================================ 

    if (employee.CharacterReference && employee.CharacterReference.length > 0) {
        // Clear existing character references except the first one (if any)
        $('.eiCharacterReference:not(:first)').remove();

        // Loop through the CharacterReference and populate or add new fields
        employee.CharacterReference.forEach(function(reference, index) {
            if (index > 0) {
                var newReferenceGroup = $('.eiCharacterReference').first().clone();
                newReferenceGroup.find('.eivcrCompanyName').text(reference.crName);
                newReferenceGroup.find('.eivcrReferenceOccupation').text(reference.crOccupation);
                newReferenceGroup.find('.eicrNumber').text(reference.crContactNumber);
                newReferenceGroup.insertAfter($('.eiCharacterReference').last());
            } else {
                $('.eiCharacterReference').eq(index).find('.eivcrCompanyName').text(reference.crName);
                $('.eiCharacterReference').eq(index).find('.eivcrReferenceOccupation').text(reference.crOccupation);
                $('.eiCharacterReference').eq(index).find('.eicrNumber').text(reference.crContactNumber);
            }
        });
    } else {
        $('.eiCharacterReference').text('N/A');
    }

}
