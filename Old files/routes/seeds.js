var express                             = require("express"),
    router                              = express.Router(),
    // client
    ClientType                          = require('../models/clientType.js'),
    GenderDb                            =require('../models/genderDB.js'),
    // contact
    ContactType                         = require('../models/contactType.js'),
    // device
    DeviceBrand                         = require('../models/deviceBrand.js'),
    DeviceType                          = require('../models/deviceType.js'),
    DevicePartType                      = require('../models/devicePartType.js'),
    // service
    ServiceCategory                     = require('../models/serviceCategory.js'),
    ServiceType                         = require('../models/serviceType.js'),
    //address
    AddressType                         = require('../models/addressType');


//populate settings
// client settings
// client type
var clntType = [
    {ClientType: 'Individual', wContPerson: false},
    {ClientType: 'Company', wContPerson: true}
]
function fClntType(type){
    ClientType.insertMany(type)
}
//gender
var gender = [
    {gender: 'Male'},
    {gender: 'Female'},
    {gender: 'I prefer not to say'},
]
function fGender(gender){
    GenderDb.insertMany(gender)
}
// client contact type
var contactType = [
    {ClientContType: 'Cellphone'},
    {ClientContType: 'FAX'},
    {ClientContType: 'E-mail'},
    {ClientContType: 'Landline'},
]
function fContType(type){
    ContactType.insertMany(type)
}
//Client device Brand
var deviceBrand = [
    {deviceBrand:'Acer'},
    {deviceBrand:'Dell'},
    {deviceBrand:'Toshiba'},
    {deviceBrand:'Lenovo'},
    {deviceBrand:'Asus'},
]
function fDevBrand(brand){
    DeviceBrand.insertMany(brand)
}
//Client device type
var deviceType = [
    {deviceType:'Laptop'},
    {deviceType:'Printer'},
    {deviceType:'Desktop Computer'},
    {deviceType:'Monitor'}
]
function fDevType(type){
    DeviceType.insertMany(type)
}
// Client Device Part Type
var devicePartType = [
    {partType: 'CPU'},
    {partType: 'Mother Board'},
    {partType: 'SSD'},
    {partType: 'RAM'},
    {partType: 'HDD'}
]
function fDevPartType(type){
    DevicePartType.insertMany(type)
}


// service settings
// service catergory
var serviceCat = [
    {category: 'Repair'},
    {category: 'Marketing'},
    {category: 'Contract'},
]
function fServiceCat(cat){
    ServiceCategory.insertMany(cat)
}

// service type
var serviceType = [
    {category: 'Repair', type: 'Walk-In', wTicket: false},
    {category: 'Repair', type: 'Field', wTicket: true},
    {category: 'Marketing', type: 'Sales', wTicket: false},
    {category: 'Marketing', type: 'Project', wTicket: true},
]
function fServiceType(type){
    ServiceType.insertMany(type)
}

// address type
var addressType = [
    {type: 'Default'},
    {type: 'Home'},
    {type: 'Office'},
]
function fAddressType(type){
    AddressType.insertMany(type)
}

var pangakoSettingsClntType = new Promise(function(resolve,reject){
    fClntType(clntType)
    resolve()
})
var pangakoSettingsGender = new Promise(function(resolve,reject){
    fGender(gender)
    resolve()
})
var pangakoSettingsContType = new Promise(function(resolve,reject){
    fContType(contactType)
    resolve()
})
var pangakoSettingsDevBrand = new Promise(function(resolve,reject){
    fDevBrand(deviceBrand)
    resolve()
})
var pangakoSettingsDevType = new Promise(function(resolve,reject){
    fDevType(deviceType)
    resolve()
})
var pangakoSettingsDevPartType = new Promise(function(resolve,reject){
    fDevPartType(devicePartType)
    resolve()
})
var pangakoSettingsServiceCat = new Promise(function(resolve,reject){
    fServiceCat(serviceCat)
    resolve()
})
var pangakoSettingsServiceType = new Promise(function(resolve,reject){
    fServiceType(serviceType)
    resolve()
})
var pangakoSettingsAddressType = new Promise(function(resolve,reject){
    fAddressType(addressType)
    resolve()
})
Promise.allSettled([
    pangakoSettingsClntType,
    pangakoSettingsGender,
    pangakoSettingsContType,
    pangakoSettingsDevBrand,
    pangakoSettingsDevType,
    pangakoSettingsDevPartType,
    pangakoSettingsServiceCat,
    pangakoSettingsServiceType,
    pangakoSettingsAddressType
]).then(function(result){
    console.log("Seeds Complete")
    console.log(result)
})

module.exports = router;