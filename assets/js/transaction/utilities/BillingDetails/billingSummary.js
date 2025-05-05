function billingSummary(data, table){
    var total = 0,
        balance = 0,
        tableData = []

    // Parts
    if (data.Parts.length !== 0) {
        var tParts = 0,
            // add header
            aParts = [{
            Description: "<strong>Parts</strong>",
            Quantity: "",
            UnitPrice: "",
            Total: "",
            _rowVariant: "table-info",
            colspan: 4
        }]
        // get total Parts 
        data.Parts.forEach(function(part){
            tParts += part.RetailPrice
            // table create
            aParts.push({
                Description: part.Description, 
                Quantity: "1",
                UnitPrice: formatCurrency(part.RetailPrice),
                Total: formatCurrency(part.RetailPrice)
            })
        })
        // add footer
        aParts.push({
            Description: "<strong>Total Parts</strong>",
            Quantity: "",
            UnitPrice: "",
            Total: formatCurrency(tParts),
            _rowVariant: "table-secondary",
            colspan: 4
        });

        total += tParts

        // concat data
        tableData = tableData.concat(aParts);
    }
    // Transportation
    if (data.Transporation.length !== 0) {
        var tTransporation = 0,
            aTransportation = [{
                Description: "<strong>Transportation</strong>",
                Quantity: "",
                UnitPrice: "",
                Total: "",
                _rowVariant: "table-info",
                colspan: 4
            }]
       // get total Transporation 
        data.Transporation.forEach(function(transpo){
            tTransporation += transpo.Price
            // table create
            aTransportation.push({
                Description: transpo.Description, 
                Quantity: "1",
                UnitPrice: formatCurrency(transpo.Price),
                Total: formatCurrency(transpo.Price)
            })
        })
        // add footer
        aTransportation.push({
            Description: "<strong>Total Transportation</strong>",
            Quantity: "",
            UnitPrice: "",
            Total: formatCurrency(tTransporation),
            _rowVariant: "table-secondary",
            colspan: 4
        });

        total += tTransporation

        // concat data
        tableData = tableData.concat(aTransportation);
    }
    //Service Charge
    if (data.ServiceCharge.length !== 0) {
        var tServiceCharge = 0,
            aServiceCharge = [{
                Description: "<strong>Service Charge</strong>",
                Quantity: "",
                UnitPrice: "",
                Total: "",
                _rowVariant: "table-info",
                colspan: 4
            }]

        // get total Service charge 
        data.ServiceCharge.forEach(function(sc){
            tServiceCharge += sc.Price
            // table create
            aServiceCharge.push({
                Description: sc.Description, 
                Quantity: "1",
                UnitPrice: formatCurrency(sc.Price),
                Total: formatCurrency(sc.Price)
            })
        })
        // add footer
        aServiceCharge.push({
            Description: "<strong>Total Service Charge</strong>",
            Quantity: "",
            UnitPrice: "",
            Total: formatCurrency(tServiceCharge),
            _rowVariant: "table-secondary",
            colspan: 4
        });

        total += tServiceCharge
        //concat data
        tableData = tableData.concat(aServiceCharge);
    }

    // add total
    tableData = tableData.concat({
        Description: "<strong>Total</strong>",
        Quantity: "",
        UnitPrice: "",
        Total: formatCurrency(total),
        _rowVariant: "table-warning",
        colspan
        : 4
    })

    // Payment
    if (data.Payment.length !== 0) {
        var tPayment = 0,
            aPayement = [{
                Description: "<strong>Payment</strong>",
                Quantity: "",
                UnitPrice: "",
                Total: "",
                _rowVariant: "table-info",
                colspan: 4
            }]

        // get total Payment
        data.Payment.forEach(function(pay){
            tPayment += pay.Amount
            // table create
            aPayement.push({
                Description: pay.Description, 
                Quantity: "(" + moment(pay.Date).format("MMM-DD-YYYY") + ")",
                UnitPrice: formatCurrency(pay.Amount),
                Total: formatCurrency(pay.Amount)
            })
        })
        //footer
        aPayement.push({
            Description: "<strong>Total Payment</strong>",
            Quantity: "",
            UnitPrice: "",
            Total: formatCurrency(tPayment),
            _rowVariant: "table-secondary",
            colspan: 4
        });
        balance = total - tPayment
        //concat data
        tableData = tableData.concat(aPayement);

        // add total
        tableData = tableData.concat({
            Description: "<strong>Balance</strong>",
            Quantity: "",
            UnitPrice: "",
            Total: formatCurrency(balance),
            _rowVariant: "table-danger",
            colspan: 4
        })
    }

    return tableData
}