// accessing backend using ajax
function crudiAjax(data, url, type){
    var ret
    $.ajax({
        url: url,
        type: type,
        data: {data},
        async: false,
        success: function(retData){
            ret = retData            
        },
        error: function(err){
            console.log(err);
        }
    })
    return ret
}

// change to pesos form number
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);
}

// convert input image to base 64 string
// how to use:
// await img2b64($('#input')[0].files[0])
function img2b64(file){
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        
        reader.onloadend = function() {
            var base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
            base64String = 'data:image/png;base64,' + base64String;
            resolve(base64String);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

// create DataTable table
// This will accept specifict data only to be displayed 
// this will add Id on data-id
// tHead Sample
// var thead = ["tihId","Job Order", "Name", "Device","Bill", "Status"]

async function initDataTable(tableName, tableHead, columnDefs, tableData, editName, deleteName) {
    if ($.fn.DataTable.isDataTable(tableName)) {
        // DataTable already exists, update the data
        var dTable = $(tableName).DataTable();
        dTable.clear().rows.add(tableData).draw();
    } else {
        // DataTable does not exist, create it
        await iDataTable(tableName, tableHead, columnDefs ,tableData);
    }

    // var dTable = await iDataTable(tableName,tableHead,tableData)
    
    $(tableName + " " + editName + "," + tableName + " " + deleteName).hide(); // hide edit button
    $(tableName).addClass('table table-hover') // initialize table hover 
    // Add hover effect to table rows

    $(tableName +" tbody").on("mouseenter", "tr", function() {
        // Show the icons
        $(this).find(editName + " , " + deleteName).show();
        $(this).addClass("table-primary")

    }).on("mouseleave", "tr", function() {
        // Hide the icons
        $(this).find(editName + " , " + deleteName).hide();
        $(this).removeClass("table-primary")
    });
}

// this function is for the main table.
//columnDefs format
// [{
//     targets: 0, // Transaction ID ID column is the first column
//     visible: false, // Hide the ID column
//     searchable: false // Make it non-searchable
// }]

async function iDataTable(tableName, tableHead, columnDefs ,tableData){
    $(tableName).DataTable({ // Added: Get the DataTable instance
        data: tableData,
        pageLength: 5, // set to display 5 items
        lengthMenu: [5, 10, 25, 50, 100], // entries per page options
        columnDefs: columnDefs,
        columns: tableHead.map(function (titleHead) {
            return ({ title: titleHead });
        }),
    });
}


// How to use iBootstrapTable
// tableName: Name of table (String) example: "#myTable"
// tableHead: Array of table headers (Array) example: ["Name", "Age", "Location"]
// hiddenColumns: Array of columns to hide (Array) example: ["Age"]
// dataField: Array of data field names corresponding to tableHead (Array) example: ["name", "age", "location"]
// tableData: Data to populate the table (Array) example: [{name: "John", age: 30, location: "New York"}, ...]
// withSearch: Boolean to enable or disable search functionality (Boolean) example: true


// for adding events
// https://bootstrap-table.com/docs/api/events/
// add click event listener for row clicks

// example:
// $("#ivSupplyTable").on('click-row.bs.table', function (e, row, $element) {
//     // change background color of selected row
//     $element.siblings().css('background-color', '');
//     $element.css('background-color', '#e9f5ff'); 
//     console.log(row);
// });




// tableName, tableHead, hiddenColumns, dataField,  tableData, withSearch
async function initBootstrapTable(tableName, tableHead, hiddenColumns, dataField,  tableData, withSearch){
    
    // Ensure the table element exists
    var $table = $(tableName);

    // Check if the table is already a Bootstrap Table and destroy it if it is
    if ($table.data('bootstrap.table')) {
        $table.bootstrapTable('destroy');
    }
    await iBootstrapTable(tableName, tableHead, hiddenColumns, dataField,  tableData, withSearch)
    

}

async function iBootstrapTable(tableName, tableHead, hiddenColumns, dataField,  tableData, withSearch){
    // Initialize the Bootstrap Table
    $(tableName).bootstrapTable({
        columns: tableHead.map(function (head, index) {
            return {
                field: dataField[index], // Use the corresponding dataField
                title: head,
                sortable: true, // Add sortable option
                visible: !hiddenColumns.includes(dataField[index]) // Set visibility based on hiddenColumns array
            };
        }),
        data: tableData,
        pagination: true, // Enable pagination
        pageSize: 5, // Set default page size
        pageList: [5, 10, 25, 50, 'all'], // Set available page sizes
        search: withSearch,
        rowStyle: function(row, index) {
            if (row._rowVariant) {
                return {
                    classes: row._rowVariant
                };
            }
        },
    });
}

//tag generator
// this tag generator accepts array of tags only
{/* <span class="badge bg-warning text-dark">Pending</span>
<span class="badge bg-warning text-dark">Quotation</span>
<span class="badge bg-warning text-dark">Pending Approval</span>
<span class="badge bg-warning text-dark">For Release</span>
<span class="badge bg-warning text-dark">Pending Payment</span>
<span class="badge bg-warning text-dark">Incomplete Payment</span>
<span class="badge bg-warning text-dark">Hold</span> -->

<span class="badge bg-success">Cancel Repair</span>    
<span class="badge bg-success">Partial Approval</span>    
<span class="badge bg-success">Parts Request</span>    
<span class="badge bg-success">Parts Approved</span>    
<span class="badge bg-success">Repaired</span>    
<span class="badge bg-success">Released</span>    
<span class="badge bg-success">Paid</span>     
<span class="badge bg-success">Unrepairable</span>  
<span class="badge bg-success">No Collection</span>  
<span class="badge bg-success">OverDue</span>  */}

function tagGenerator(tags) {
    if (!Array.isArray(tags)) {
        console.error("tagBadgeGenerator: Input must be an array of strings.");
        return []; // Return an empty array if the input is not an array
    }
    return tags.map(function(tag){
        switch (tag) {
            case "Pending":
                return `<span class="badge bg-warning text-dark mx-1">Pending</span>`;
            case "Quotation":
                return `<span class="badge bg-info text-dark mx-1">Quotation</span>`;
            case "PendingApproval":
                return `<span class="badge bg-warning text-dark mx-1">Pending Approval</span>`;
            case "For Release":
                return `<span class="badge bg-success text-dark mx-1">ForRelease</span>`;
            case "PendingPayment":
                return `<span class="badge bg-info text-dark mx-1">Pending Payment</span>`;
            case "IncompletePayment":
                return `<span class="badge bg-info text-dark mx-1">Incomplete Payment</span>`;
            case "Hold":
                return `<span class="badge bg-danger text-dark mx-1">Hold</span>`;
            case "CancelRepair":
                return `<span class="badge bg-danger mx-1">Cancel Repair</span>`;
            case "PartialApproval":
                return `<span class="badge bg-success mx-1">Partial Approval</span>`;
            case "PartsRequest":
                return `<span class="badge bg-primary mx-1">Parts Request</span>`;
            case "PartsApproved":
                return `<span class="badge bg-primary mx-1">Parts Approved</span>`;
            case "Repaired":
                return `<span class="badge bg-primary mx-1">Repaired</span>`;
            case "Released":
                return `<span class="badge bg-primary mx-1">Released</span>`;
            case "Paid":
                return `<span class="badge bg-primary mx-1">Paid</span>`;
            case "Unrepairable":
                return `<span class="badge bg-danger mx-1">Unrepairable</span>`;
            case "No Collection":
                return `<span class="badge bg-primary mx-1">NoCollection</span>`;
            case "OverDue":
                return `<span class="badge bg-danger mx-1">OverDue</span>`;
            default:
                return ""
        }
    })

}

