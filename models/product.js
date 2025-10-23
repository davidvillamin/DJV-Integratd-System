var mongoose = require("mongoose");
var productSchema = new mongoose.Schema({
    // Product Information
    Code: String,
    Name: String,
    Description: String,
    Type: String,
    withBrand: Boolean,
    Brand: String,
    withModel: Boolean,
    Model: String,
    withSerial: Boolean,
    Supply:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "supply"
    }],
    Notes: String,
    Images: [{
        Title: String,
        Description: String,
        base64String: String
    }],
    idealPrice: Number, // suggestion of reteil price of product
});

module.exports = mongoose.model("product", productSchema);

// product code is auto generated in the format INVXXXX (X = number)
// sample data:
// ProductCode	ProductName	    Description	            Type	        withBrand	Brand	    withModel	Model	        withSerial	Notes	                        Images
// INV123	    CCTV Camera	    High-resolution camera	Security	    true	    Hikvision	true	    DS-2CD2143G0-I	true	    Installed in main entrance	    ["image1.jpg","image2.jpg"]
// INV124	    Printer	        Laser printer	        Office Supplies	false		            false		                false		Located in Room 101	            ["printer1.jpg"]
// INV125	    Laptop	        Business laptop	        Electronics	    true	    Dell	    true	    Latitude 5420	true	    Assigned to John Doe	        ["laptop1.jpg","laptop2.jpg"]