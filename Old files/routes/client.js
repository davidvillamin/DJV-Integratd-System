var express                             = require("express"),
    router                              = express.Router(),
    fs                                  = require ('fs'),
    path                                = require('path'),

    // models
    Client                              =require('../models/client'),
    ClientType                          =require('../models/clientType'),
    // gender
    Gender                              =require('../models/genderDB.js'),
    // contact
    ContactPerson                       =require('../models/contactPerson')
    ContactDb                           =require('../models/contactDb'),
    ContactType                         =require('../models/contactType'),
    // device
    DeviceDb                            =require('../models/deviceDb'),
    DeviceType                          =require('../models/deviceType'),
    DeviceBrand                         =require('../models/deviceBrand'),
    DevicePart                          =require('../models/devicePart'),
    DevicePartType                      =require('../models/devicePartType'),
    // address
    AddressDb                           =require('../models/addressDb'),
    AddressType                         =require('../models/addressType'),
    // image video
    ImgVideoDb                          =require('../models/imgVideoDb'),
    multer                              = require('multer'),
    storage                             = multer.diskStorage({ 
                                            destination: function (req, file, cb) {
                                                cb(null, './public/uploads')
                                                },
                                            filename: function (req, file, cb) {
                                                let extArray = file.mimetype.split("/");
                                                let extension = extArray[extArray.length - 1];
                                                cb(null, Date.now() + "." + extension)
                                            }
                                        }),
    upload                              = multer({ storage: storage });

// ============================================================
// Client Index
// ============================================================
// initialize client (index)
router.get("/clients", async function(req, res){
    res.render("clients/index")
});
router.get("/clientAjax", async function(req, res){
    var clientList = await Client.find()
    res.send(clientList)
})


// ============================================================
// Client Create (save)
// ============================================================

router.get("/clients/create", function(req, res){
    res.render("clients/create")
});

//create new client
router.post("/clients/create/save", async function(req, res){
    await Client.create(req.body.data)
    res.send('success')
});

// ============================================================
// Client View
// ============================================================
router.get("/clients/view/:clntId", function(req, res){
    res.render("clients/view")
});

//get cient info
router.post("/clients/view/ajax", async function(req, res){
    var foundClient = await Client.findById(req.body.data.id)
    res.send(foundClient)
});







// ============================================================
// Running ajax to populate all client and create it into table
// ============================================================
// view client (ajax)
router.get("/client/ajaxInit/client",async function(req, res){
    var foundClient = await Client
        .find()
        .populate("type")
        .populate({
            path : 'address',
            match: {
                type: 'Default'
            }
          })
        .populate("contact")
        .populate({
            path : 'device',
            populate : {
              path : 'partSN'
            }
          })
        .lean()
        .exec()
    res.send({
        foundClient: foundClient
    })
});
// ============================================================
// Initialize Client Type for adding client
// ============================================================
//initialize client Type
router.get("/client/ajaxInit/clntType",async function(req, res){
    var foundClientType = await ClientType.find().lean().exec()
    res.send({
        foundClientType: foundClientType
    })
});
// ============================================================
// Initialize Gender
// ============================================================
//initialize Gender
router.get("/client/ajaxInit/gender",async function(req, res){
    var foundGender = await Gender.find().lean().exec()
    res.send({
        foundGender: foundGender
    })
});
// ============================================================
// Initialize client Contact Type for adding client
// ============================================================
//initialize contact number type
router.get("/client/ajaxInit/contType", async function(req, res){
    var foundClientContType = await ContactType.find().lean().exec()
    res.send({
        foundClientContType: foundClientContType
    })
});
// ============================================================
// Initialize client Address Type for adding client
// ============================================================
//initialize Address type
router.get("/client/ajaxInit/addType", async function(req, res){
    var foundAddressType = await AddressType.find().lean().exec()
    res.send({
        foundAddressType: foundAddressType
    })
});

// ============================================================
// CRUD Client Create 
// ============================================================
//create client Without contact person
router.post("/client/WoCP/create",async function(req, res){
    // setting default data
    req.body.data.clnt.isAvatarDefualt = true
    req.body.data.clnt.avatarDefault = "/public/img/defaultAvatar.png"
    //create contact
    var newlyCreatedClient = await Client.create(req.body.data.clnt)
    //create multiple contact
    var newlyCreatedClientCont = await ContactDb.insertMany(req.body.data.contact)
    // create address
    var newlyCreatedAddress = await AddressDb.create(req.body.data.add)
    // find client type
    var foundClientType = await ClientType.findById(req.body.data.type)

    // add contact 
    var pangakoCreateWoCP = new Promise(function(resolve,reject){
        newlyCreatedClientCont.forEach(function(clnt){
            newlyCreatedClient.contact.push(clnt)
        })
        //push client type
        newlyCreatedClient.type.push(foundClientType)
        // push address
        newlyCreatedClient.address.push(newlyCreatedAddress)
        resolve()
    })
    pangakoCreateWoCP.then(function(){
        newlyCreatedClient.save()
    }).then(function(){
        res.send({
            text: 'You have successfuly created new client',
            header: 'Create client',
            icon: 'success'
        })
    })
})
// create client with contact person.
router.post("/client/WCP/create",async function(req, res){
    console.log(req.body)
    // setting default data
    req.body.data.clnt.isAvatarDefualt = true
    req.body.data.clnt.avatarDefault = "/public/img/defaultAvatar.png"
    //create contact
    var newlyCreatedClient = await Client.create(req.body.data.clnt,)
    // create multiple contact person
    var newlyCreatedContactPerson = await ContactPerson.insertMany(req.body.data.contactPerson)
    // create multiple contact
    var newlyCreatedClientCont = await ContactDb.insertMany(req.body.data.contact)
    // create address
    var newlyCreatedAddress = await AddressDb.create(req.body.data.add)
    // find client type
    var foundClientType = await ClientType.findById(req.body.data.type)
    var pangakotCreateWCP = new Promise(function(resolve, reject){
        newlyCreatedContactPerson.forEach(function(cont,i){
            newlyCreatedClient.contactPerson.push(cont)
            cont.contact.push(newlyCreatedClientCont[i])
            cont.save()
        })
        resolve()
    })      
    pangakotCreateWCP.then(function(){
        //push client type
        newlyCreatedClient.type.push(foundClientType)
        // push address
        newlyCreatedClient.address.push(newlyCreatedAddress)
        newlyCreatedClient.save()
    }).then(function(){
        res.send({
            text: 'You have successfuly created new client',
            header: 'Create client',
            icon: 'success'
        })
    })
})


// ============================================================
// CRUD Client Edit 
// ============================================================
// [ WoCP edit ] get edit page (Without Contact Person)
router.get("/client/WoCP/edit/:clntId", function(req, res){
    res.render("client/client-WoCP-edit")
})

// [ WoCP edit ] get client info by id (without contact person)
router.post("/client/WoCP/ajaxInit/edit", async function(req, res){
    var foundClient = await Client.findById(req.body.data)
        .populate("type")
        .populate("avatar")
        .populate("address")
        .populate("contact")
        .lean()
        .exec()
    res.send({foundClient:foundClient})
})

// [ WoCP edit ] Edit client save (ajax) 
router.post("/client/WoCP/edit", upload.single('edtClntWoCPAvatarFile') ,async function(req, res){
    var body = JSON.parse(req.body.edtClnt)
    body.clnt.address = [] // clear data of address
    body.clnt.contact = []  // clear data of contact
    
    // find client then update all details
    var updatedClient = await Client.findByIdAndUpdate(body.id, body.clnt)
    // delete all old contact
    await ContactDb.deleteMany({_id:{$in:body.delContact}})
    // insert all new contact
    var newlyCreatedClientCont = await ContactDb.insertMany(body.contact)
    // delete old address
    await AddressDb.deleteMany({_id:{$in: body.delAddress}})
    // insert new address
    var newlyCreatedAddress = await AddressDb.insertMany(body.address)
    
    // managing avatar
    if (req.file){
        var newlyCreatedAvatar = await ImgVideoDb.create(req.file)
        if (updatedClient.avatar.length === 0){
            updatedClient.avatar.push(newlyCreatedAvatar)
            updatedClient.isAvatarDefualt = false
        } else {
            // delete imgVideoDb id
            await ImgVideoDb.findByIdAndDelete(updatedClient.avatar[0]._id)
            // delete upload image
            fs.unlink('./public/uploads/'+ body.delAvatar,function(err){
                if(err){
                    console.log(err)
                } 
            })
            updatedClient.avatar = [] // clear value of updated client
            updatedClient.avatar.push(newlyCreatedAvatar)

        }
    } 

    // pushing contact in client
    newlyCreatedClientCont.forEach(function(clntCont){
        updatedClient.contact.push(clntCont)
    })

    // pusing address in client
    newlyCreatedAddress.forEach(function(clntAdd){
        updatedClient.address.push(clntAdd)
    })
    updatedClient.save()
                                                
    res.send({
        text: 'You have successfuly edited <strong><u>' + body.clnt.clntName + '</u></strong> client',
        header: 'Edit client',
        icon: 'success'
    })
})

// [ WCP edit ] get edit page (With Contact Person)
router.get("/client/WCP/edit/:clntId", function(req, res){
    res.render("client/client-WCP-edit")
})

// [ WCP edit ] get client info by id (with contact person)
router.post("/client/WCP/ajaxInit/edit",async function(req, res){
    var foundClient = await Client.findById(req.body.data)
    .populate("type")
    .populate("avatar")
    .populate("address")
    .populate({
        path : 'contactPerson',
        populate: {
            path: 'contact',
        }
    })
    .populate({
        path : 'contactPerson',
        populate: {
            path: 'address',
        }
    })
    .lean()
    .exec()
    res.send({foundClient:foundClient})
})
// [ WCP edit ] Edit client save (ajax) 
router.post("/client/WCP/edit", upload.any() ,async function(req, res){
    var body = JSON.parse(req.body.edtClnt)
    body.clnt.isAvatarDefualt = true
    body.clnt.avatarDefault = "/public/img/defaultAvatar.png"
    body.contPerson.forEach(function(CP){
        CP.isAvatarDefualt = true
        CP.avatarDefault = "/public/img/defaultAvatar.png"
    })
    console.log(body)
    // Create a old contact person details for delete 
    var crtConcatAddress = []
    var delAddress = []
    var delContact = []

    // updating client info
    var updatedClient = await Client.findByIdAndUpdate(body.id, body.clnt)
    updatedClient.address = [] //clear address data
    updatedClient.contactPerson = [] //clear contact person data

    // finding old contact person associated 
    var foundOldContactPerson = await ContactPerson.find({_id: {$in: body.delClntContPerson}}).lean()

    // create
    // gumawa ako ng concatenated na datas para isang open lng ng db. 
    //contact person address
    crtConcatAddress = body.contPersonAddress.flat()
    //client
    crtConcatAddress = crtConcatAddress.concat(body.clntAddress.flat())
    
    // converting contact person contact to flat to be created
    // contact person contact
    body.contPersonContact = body.contPersonContact.flat()
    // delete
    // create a array for Contact person Address and Contact Number to be deleted
    foundOldContactPerson.forEach(function(contPer){
        if (contPer.address.length > 0){
            delAddress = delAddress.concat(contPer.address)
        }
        if (contPer.contact.length > 0){
            delContact = delContact.concat(contPer.contact)
        }
    })

    // merging of old address of client
    delAddress = delAddress.concat(body.delClntAddress)

    await ContactPerson.deleteMany({_id:{$in:body.delClntContPerson}})
    await ContactDb.deleteMany({_id:{$in:delContact}})
    await AddressDb.deleteMany({_id:{$in:delAddress}})

    var newlyCreatedAddress = await AddressDb.insertMany(crtConcatAddress)
    var newlyCreatedContactPerson = await ContactPerson.insertMany(body.contPerson)
    var newlyCreatedCPContact = await ContactDb.insertMany(body.contPersonContact)
    if (req.files.length > 0){
        var newlyCreatedAvatars = await ImgVideoDb.create(req.file)
    }

    var pangakotDataPushClientAndCP = new Promise(function(resolve,reject){
        // pusing addresses
        newlyCreatedAddress.forEach(function(address){
            // for client
            // default temp file index of client is 1
            if (address.tempFileIndex == 1){
                updatedClient.address.push(address._id)
            } else {
                // for contact person
                newlyCreatedContactPerson.forEach(function(CP){
                    if (CP.tempFileIndex == address.tempFileIndex){
                        CP.address.push(address._id)
                    }
                })
            }
        })
        // pushing contact to contact person
        newlyCreatedCPContact.forEach(function(contact){
            newlyCreatedContactPerson.forEach(function(CP){
                if (contact.tempFileIndex == CP.tempFileIndex){
                    CP.contact.push(contact._id)
                }
            })
        })
        
        newlyCreatedContactPerson.forEach(function(CP){
            // pushing contact person to client
            updatedClient.contactPerson.push(CP._id)
        })

        resolve()
    })

    //saving contact person
    var pangakotContPerSave = new Promise(function(resolve,reject){
        newlyCreatedContactPerson.forEach(function(CP){
            CP.save()
        })
        resolve()
    })
    //saving client
    var pangakotClientSave = new Promise(function(resolve,reject){
        updatedClient.save()
        resolve()
    })
    Promise.all([pangakotDataPushClientAndCP,pangakotContPerSave,pangakotClientSave]).then(function(){
        res.send({
            text: 'You have successfuly edited <strong><u>' + body.clnt.clntName + '</u></strong> client',
            header: 'Edit client',
            icon: 'success'
        })
    })
    
    // // updating client info
    // Client.findByIdAndUpdate(body.id, body.clnt).exec(function(err,updatedClient){
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         // Find the OLD contact person 
    //         ContactPerson.find({_id: {$in: body.delClntContPerson}}).exec(function(err,foundOldContactPerson){
    //             if (err){
    //                 console.log(err)
    //             } else {
                    
    //                 // merging client address and contact person address
    //                 //contact person address
    //                 tempConcatAddresses = body.contPersonAddress.flat()
    //                 //client
    //                 tempConcatAddresses = tempConcatAddresses.concat(body.clntAddress.flat())
    //                 //merging client contact and contact person contact
    //                 // contact person contact
    //                 tempConcatContact = body.contPersonContact.flat()
    //                 console.log(foundOldContactPerson)

    //                 // create a array for Contact person Address and Contact Number to be deleted
    //                 foundOldContactPerson.forEach(function(contPer){
    //                     if (contPer.address.length > 0){
    //                         oldContPer.address = oldContPer.address.concat(contPer.address)
    //                     }
    //                     if (contPer.contact.length > 0){
    //                         oldContPer.contact = oldContPer.contact.concat(contPer.contact)
    //                     }
    //                 })
        
    //                 // merging of address to be deleted (old contact person address and client address)
    //                 if (oldContPer.address.length > 0){
    //                     body.delClntAddress = body.delClntAddress.concat(oldContPer.address)
    //                 }
    //                 // deleteing process
    //                 // address
    //                 AddressDb.findByIdAndDelete(body.delClntAddress).exec(function(err){
    //                     if (err) {
    //                         console.log(err)
    //                     } else {
    //                         // contact
    //                         ContactDb.findByIdAndDelete(oldContPer.contact).exec(function(err){
    //                             if (err) {
    //                                 console.log(err)
    //                             } else {
    //                                 // deleteing old contact Person
    //                                 ContactPerson.findByIdAndDelete(body.delClntContPerson).exec(function(err){
    //                                     if (err) {
    //                                         console.log(err)
    //                                     } else {
    //                                         // creating process
    //                                         // client address 
    //                                         console.log(tempConcatAddresses)
    //                                         AddressDb.insertMany(tempConcatAddresses).exec(function(err, newlyCreatedClientAddress){
    //                                             if (err) {
    //                                                 console.log(err)
    //                                             } else {
    //                                                 // creating contact person details
    //                                                 ContactPerson.insertMany(body.contPerson).exec(function(err, newlyCreatedContactPerson){
    //                                                     if (err) {
    //                                                         console.log(err)
    //                                                     } else {
    //                                                         // creating contact person contact
    //                                                         console.log(tempConcatContact)
    //                                                         ContactDb.insertMany(tempConcatContact).exec(function(err, newlyCreatedCPContact){
    //                                                             if (err) {
    //                                                                 console.log(err)
    //                                                             } else {
    //                                                                 // avatar
    //                                                                 //NOTE: Maglagay ng Delete process para sa old images
    //                                                                 if (req.files.length > 0){
    //                                                                     ImgVideoDb.create(req.file,function(err, newlyCreatedAvatars){
    //                                                                         if (err) {
    //                                                                             console.log(err)
    //                                                                         }
    //                                                                     })
    //                                                                 }
    //                                                                 var pangakoPushingData = new Promise(async function(resolve,reject){
    //                                                                     // NOTE: hindi ma push lahat ng client address
    //                                                                     // pati ung sa contact person contact and address
    //                                                                     // pushing address in client and contact person
    //                                                                     // client address
    //                                                                     let clntAddressIndex = await newlyCreatedClientAddress.map(function(add){
    //                                                                         return add.tempFileIndex
    //                                                                     }).indexOf(updatedClient.tempFileIndex) // tag for client address
    //                                                                     console.log(newlyCreatedClientAddress)
    //                                                                     console.log(updatedClient.tempFileIndex)
    //                                                                     console.log('client address find index value')
    //                                                                     console.log(clntAddressIndex)
    //                                                                     if (clntAddressIndex >= 0){
    //                                                                         for (let index = 0; index < newlyCreatedClientAddress[clntAddressIndex].length; index++) {
    //                                                                             console.log(newlyCreatedClientAddress[clntAddressIndex].index)
    //                                                                             updatedClient.address.push(newlyCreatedClientAddress[clntAddressIndex].index)
    //                                                                             console.log('client push address')
    //                                                                             console.log(updatedClient.address)
    //                                                                         }
    //                                                                     }
    //                                                                     // contact person address
    //                                                                     for (let index = 0; index < newlyCreatedContactPerson.length; index++) {
    //                                                                         // address
    //                                                                         let contPerAddressIndex = await newlyCreatedClientAddress.map(function(add){
    //                                                                             return add.tempFileIndex
    //                                                                         }).indexOf(newlyCreatedContactPerson.tempFileIndex) // tag for contact person address
    //                                                                         if (contPerAddressIndex > 0){
    //                                                                             for (let index = 0; index < newlyCreatedClientAddress[contPerAddressIndex].length; index++) {
    //                                                                                 newlyCreatedContactPerson.address.push(newlyCreatedClientAddress[contPerAddressIndex].index)
    //                                                                             }
    //                                                                         }
    //                                                                         // contact number
    //                                                                         let contPerContactIndex = await newlyCreatedCPContact.map(function(cont){
    //                                                                             return cont.tempFileIndex
    //                                                                         }).indexOf(newlyCreatedContactPerson.tempFileIndex) // tag for contact person address
    //                                                                         if (contPerContactIndex > 0){
    //                                                                             for (let index = 0; index < newlyCreatedCPContact[contPerContactIndex].length; index++) {
    //                                                                                 newlyCreatedContactPerson.contact.push(newlyCreatedCPContact[contPerContactIndex].index)
    //                                                                             }
    //                                                                         }
    //                                                                     }
                                                                       
    //                                                                     // pushing process of contact person contact
    //                                                                     // pushing data for contact person
    //                                                                     // contact
    //                                                                     // for (let index = 0; index < newlyCreatedCPContact.length; index++) {
    //                                                                     //     let contPerContactIndex = newlyCreatedCPContact.map(function(cont){
    //                                                                     //         return cont.tempFileIndex
    //                                                                     //     }).indexOf(newlyCreatedContactPerson.contPerContactIndex) // tag for contact person contact
    //                                                                     //     if (contPerContactIndex > 0){
    //                                                                     //         newlyCreatedContactPerson.contact.push(newlyCreatedCPContact[contPerContactIndex])
    //                                                                     //     }
    //                                                                     // }
    //                                                                     resolve()
    //                                                                 })
                                                                    
    //                                                                 Promise.allSettled([pangakoPushingData]).then(function(){
    //                                                                     console.log(updatedClient)
    //                                                                     updatedClient.save()
    //                                                                     newlyCreatedContactPerson.forEach(function(contPer){
    //                                                                         console.log(contPer)
    //                                                                         contPer.save()
    //                                                                     })
                                                                        
    //                                                                     res.send({
    //                                                                         text: 'You have successfuly edited <strong><u>' + body.clnt.clntName + '</u></strong> client',
    //                                                                         header: 'Edit client',
    //                                                                         icon: 'success'
    //                                                                     })
    //                                                                 })
                                                                

    //                                                                 // avatar
    //                                                                 //NOTE: Maglagay ng Delete process para sa old images
    //                                                                 // if (req.files.length > 0){
    //                                                                 //     ImgVideoDb.create(req.file,function(err, newlyCreatedAvatars){
    //                                                                 //         if (err) {
    //                                                                 //             console.log(err)
    //                                                                 //         } else {
    //                                                                 //             // push avatar
    //                                                                 //             // insert avatar in client 
    //                                                                 //             let clntAvatarIndex = newlyCreatedAvatars.map(function(avatar){
    //                                                                 //                 return avatar.originalname
    //                                                                 //             }).indexOf(updatedClient.tempAvatarFileName) // tag for client avatar
    //                                                                 //             if (clntAvatarIndex > 0){
    //                                                                 //                 updatedClient.avatar.push(newlyCreatedAvatars[clntAvatarIndex])
    //                                                                 //                 updatedClient.isAvatarDefualt = false
    //                                                                 //             }

    //                                                                 //             // insert avatar for contact person. 
    //                                                                 //             for (let index = 0; index < newlyCreatedContactPerson.length; index++) {
    //                                                                 //                 let contPerAvatarIndex = newlyCreatedAvatars.map(function(avatar){
    //                                                                 //                     return avatar.originalname
    //                                                                 //                 }).indexOf(newlyCreatedContactPerson[index].tempAvatarFileName) // tag for client avatar
    //                                                                 //                 if (clntAvatarIndex > 0){
    //                                                                 //                     newlyCreatedContactPerson[index].avatar.push(newlyCreatedAvatars[contPerAvatarIndex])
    //                                                                 //                     newlyCreatedContactPerson[index].isAvatarDefualt = false
    //                                                                 //                 }
    //                                                                 //                 // identify if completed
    //                                                                 //                 // for instant resolve after the loop
    //                                                                 //                 if (index == newlyCreatedContactPerson.length -1 ){
    //                                                                 //                     resolve()
    //                                                                 //                 }
    //                                                                 //             }
    //                                                                 //         }
    //                                                                 //     })
    //                                                                 // } 

    //                                                                 //save client
                                                                    
    //                                                             }
    //                                                         })
    //                                                     }
    //                                                 })
    //                                             }
    //                                         })
    //                                     }
    //                                 })                                    
    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // })
})



// [ WCP edit ] Edit client save (ajax) 
// router.post("/client/WCP/edit", upload.any() ,function(req, res){
//     var body = JSON.parse(req.body.edtClnt)
//     console.log('FILES=============')
//     console.log(req.files)
//     console.log('BODY=============')
//     console.dir(body)
//     body.clnt.address = [] // clear data of address to fill new data
//     body.clnt.contact = []  // clear data of contact to fill new data
//     // create avatars
//     ImgVideoDb.insertMany(req.files,function(err, newlyCreatedAvatars){
//         if (err){
//             console.log(err)
//         } else {
//             Client.findByIdAndUpdate(body.id, body.clnt, function(err,updatedClient){
//                 if (err){
//                     console.log(err)
//                 } else {
//                     // insert avatar in client 
//                     let clntAvatarIndex = newlyCreatedAvatars.map(function(avatar){
//                         return avatar.originalname
//                     }).indexOf(body.clnt.tempAvatarFileName)
//                     updatedClient.avatar.push(newlyCreatedAvatars[clntAvatarIndex])
//                     // delete client address
//                     AddressDb.findByIdAndDelete(body.delClntAddress, function(err){
//                         if (err){
//                             console.log(err)
//                         } else {
//                             // create client addres and push address
//                             AddressDb.insertMany(body.clntAddress, function(err, newlyCreatedClientAddress){
//                                 if (err) {
//                                     console.log(err)
//                                 } else {
//                                     // push all address in client
//                                     for (let index = 0; index < newlyCreatedClientAddress.length; index++) {
//                                         updatedClient.address.push(newlyCreatedClientAddress[index])
//                                     }
//                                     //delete first all data by user id in client contact person
//                                     ContactPerson.deleteMany({_id:{$in:body.delClntContPerson}}, function(err){
//                                         if (err){
//                                             console.log(err)
//                                         } else {
//                                             // create contact person data
//                                             ContactPerson.insertMany(body.contPerson, function(err, newlyCreatedContactPerson){
//                                                 if (err){
//                                                     console.log(err)
//                                                 } else {
//                                                     // create a promise so that if you loop for pushing the data
//                                                     let pangakoEdtContPerson = new Promise(function(resolve, reject){
//                                                         for (let index = 0; index < newlyCreatedContactPerson.length; index++) {
//                                                             let clntContPerAvatarIndex = newlyCreatedAvatars.map(function(avatar){
//                                                                 return avatar.originalname
//                                                             }).indexOf(body.contPerson[index].tempAvatarFileName)
    
//                                                             // identify if true of false if the newlyCreatedAvatar is for this contact person
//                                                             if (clntContPerAvatarIndex >= 0){
//                                                                 // insert avatar for contact person
//                                                                 newlyCreatedContactPerson[index].avatar.push(newlyCreatedAvatars[clntContPerAvatarIndex])
//                                                                 // push contact person on client

//                                                             }
//                                                             // for instant resolve after the loop
//                                                             if (index == newlyCreatedContactPerson.length -1 ){
//                                                                 resolve(newlyCreatedContactPerson)
//                                                             }
//                                                         }
//                                                     })
//                                                     pangakoEdtContPerson.then(function(newlyCreatedContactPerson){
//                                                         for (let index = 0; index < newlyCreatedContactPerson.length; index++) {
//                                                             newlyCreatedContactPerson[index].save(function(){
//                                                             })
//                                                         }
//                                                     })
                                                    
//                                                     // insert avatar in contact person
//                                                     // for (let index = 0; index < newlyCreatedContactPerson.length; index++) {
//                                                     //     // const element = newlyCreatedContactPerson[index];
//                                                     //     let clntContPerAvatarIndex = newlyCreatedAvatars.map(function(avatar){
//                                                     //         return avatar.originalname
//                                                     //     }).indexOf(body.contPerson[index].tempAvatarFileName)

//                                                     //     // identify if true of false if the newlyCreatedAvatar is for this contact person
//                                                     //     if (!clntContPerAvatarIndex == -1){
//                                                     //         newlyCreatedContactPerson[index].avatar.push(newlyCreatedAvatars[clntContPerAvatarIndex])
//                                                     //     }
                        
//                                                     // }
//                                                     // for (let index = 0; index < array.length; index++) {
//                                                     //     const element = array[index];
                                                        
//                                                     // }
//                                                     // newlyCreatedContactPerson.forEach(async function(contPer){
//                                                     //     contPer.save()
//                                                     // })
//                                                     // newlyCreatedContactPerson.save()
//                                                     updatedClient.save(function(){
//                                                         console.log('update client success')
//                                                     })
//                                                     //=========================================
                                                    
//                                                     // // address
//                                                     // AddressDb.deleteMany({_id:{$in: body.contPersonAddress}}, function(err){
//                                                     //     if (err) {
//                                                     //         console.log(err)
//                                                     //     } else {
//                                                     //         AddressDb.insertMany(body.address, function(err, newlyCreatedAddress){
//                                                     //             if (err) {
//                                                     //                 console.log(err)
//                                                     //             } else {
//                                                     //                 // insert avatar
//                                                     //                 var pangako = new Promise(function(resolve,reject){
//                                                     //                     if (req.file){
//                                                     //                         ImgVideoDb.create(req.file,function(err, newlyCreatedAvatar){
//                                                     //                             if (err) {
//                                                     //                                 console.log(err)
//                                                     //                             } else {
//                                                     //                                 // push avatar
//                                                     //                                 if (updatedClient.avatar.length === 0){
//                                                     //                                     updatedClient.avatar.push(newlyCreatedAvatar)
//                                                     //                                     updatedClient.isAvatarDefualt = false
//                                                     //                                     resolve()
//                                                     //                                 } else {
//                                                     //                                     // delete imgVideoDb id
//                                                     //                                     ImgVideoDb.findByIdAndDelete(updatedClient.avatar[0]._id,function(err){
//                                                     //                                         if (err) {
//                                                     //                                             console.log(err)
//                                                     //                                         } else {
//                                                     //                                             // delete upload image
//                                                     //                                             fs.unlink('./public/uploads/'+ body.delAvatar,function(err){
//                                                     //                                                 if(err){
//                                                     //                                                     console.log(err)
//                                                     //                                                 } 
//                                                     //                                             })
//                                                     //                                             updatedClient.avatar = [] // clear value of updated client
//                                                     //                                             updatedClient.avatar.push(newlyCreatedAvatar)
//                                                     //                                             resolve()
//                                                     //                                         }
//                                                     //                                     })
//                                                     //                                 }
//                                                     //                             }
//                                                     //                         })
//                                                     //                     } else {
//                                                     //                         reject()
//                                                     //                     }
//                                                     //                 })
//                                                     //                 var savePangako = new Promise(function(resolve,reject){
//                                                     //                     // insert contact
//                                                     //                     var saveContactPangako = new Promise(function(resolve,reject){
//                                                     //                         for (let i = 0; i < newlyCreatedClientCont.length; i++) {
//                                                     //                             updatedClient.contact.push(newlyCreatedClientCont[i])
//                                                     //                         }
//                                                     //                         resolve()
//                                                     //                     })
//                                                     //                     // insert address
//                                                     //                     var saveAddressPangako = new Promise(function(resolve,reject){
//                                                     //                         for (let i = 0; i < newlyCreatedAddress.length; i++) {
//                                                     //                             updatedClient.address.push(newlyCreatedAddress[i])
//                                                     //                         }
//                                                     //                         resolve()
//                                                     //                     })
//                                                     //                     Promise.all([saveContactPangako,saveAddressPangako]).then(function(){
//                                                     //                         resolve()
//                                                     //                     })
//                                                     //                 })
//                                                     //                 Promise.allSettled([pangako,savePangako]).then(function(){
//                                                     //                     //save client
//                                                     //                     updatedClient.save()
                                                                        
//                                                     //                     res.send({
//                                                     //                         text: 'You have successfuly edited <strong><u>' + body.clnt.clntName + '</u></strong> client',
//                                                     //                         header: 'Edit client',
//                                                     //                         icon: 'success'
//                                                     //                     })
//                                                     //                 })
//                                                     //             }
//                                                     //         })
//                                                     //     }
//                                                     // })
//                                                 }
//                                             })
//                                         }
//                                     })
//                                 }
//                             })
//                         }
//                     })
//                 }
//             })
//         }
//     })
// })






// ============================================================
// CRUD Client Delete 
// ============================================================
//Delete client (ajax)
router.delete("/client/delete", function(req, res){
    Client.findByIdAndDelete(req.body.data.id,function(err, delClient){
        if (err){
            console.log(err)
        } else {
            ContactDb.deleteMany({_id:{$in:req.body.data.contID}},function(err){
                if (err){
                    console.log(err)
                } else {
                    res.send({
                        text: 'You have successfuly deleted <strong><u>' + delClient.clntName + '</u></strong> client',
                        header: 'Delete client',
                        icon: 'success'
                    })
                }
            })
        }
    })
})








// ============================================================
// Lunching client view page
// client view
// ============================================================


// ============================================================
// Lunching client view page
// Viewing client specificaly (client View)
// ============================================================
// view client by id
router.get("/client/:clntId", function(req, res){
    res.render("client/view")
});
// ============================================================
// Getting data on specific client in client view page
// ============================================================
// view client (ajax)
router.post("/client/view/ajaxInit", function(req, res){
    Client.findById(req.body.data)
        .populate("type")
        .populate("avatar")
        .populate("contact")
        .populate("address")
        .populate({
            path : 'device',
            populate : {
              path : 'partSN'
            }
          })
        .lean()
        .exec(function(err,foundClient){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundClient: foundClient
            })
        }
    })
});
// ============================================================
// Initialize Client device type for creating client device
// ============================================================
router.get("/client/view/device/ajaxInit/type", function(req, res){
    DeviceType.find().lean().exec(function(err,foundDeviceType){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundDeviceType: foundDeviceType
            })
        }
    })
});
// ============================================================
// Initialize Client device Brand for creating client device
// ============================================================
router.get("/client/view/device/ajaxInit/brand", function(req, res){
    DeviceBrand.find().lean().exec(function(err,foundDeviceBrand){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundDeviceBrand: foundDeviceBrand
            })
        }
    })
});
// ============================================================
// Initialize Client device Part Type for creating client device
// ============================================================
router.get("/client/view/device/ajaxInit/partType", function(req, res){
    DevicePartType.find().lean().exec(function(err,foundDevicePartType){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundDevicePartType: foundDevicePartType
            })
        }
    })
});
// ============================================================
// Create Client device
// ============================================================
router.post("/client/view/device/create", function(req, res){
    Client.findById(req.body.data.Id, function(err, foundClient){
        if (err){
            console.log(err)
        } else {
            ClientDevice.create(req.body.data.device, function(err, newlyCreatedClientDevice){
                if (err) {
                    console.log(err)
                } else {
                    if (req.body.data.part == undefined){
                        foundClient.device.push(newlyCreatedClientDevice)
                        foundClient.save()
                        res.send({
                            text: 'You have successfuly created client device',
                            header: 'Create device',
                            icon: 'success'
                        })
                    } else {
                        ClientDevicePart.insertMany(req.body.data.part, function(err, newlyCreatedPart){
                            if (err){
                                console.log(err)
                            } else {
                                for (let i = 0; i < newlyCreatedPart.length; i++) {
                                    newlyCreatedClientDevice.partSN.push(newlyCreatedPart[i])
                                }
                                newlyCreatedClientDevice.save()
                                foundClient.device.push(newlyCreatedClientDevice)
                                foundClient.save()
                                res.send({
                                    text: 'You have successfuly created client device',
                                    header: 'Create device',
                                    icon: 'success'
                                })
                            }
                        })
                    }
                }
            })
        }
    })
});
// ============================================================
// Edit Client device
// ============================================================
router.put("/client/view/device/edit", function(req, res){
    // for clearing first the contact array
    req.body.data.dev.partSN = []
    ClientDevice.findByIdAndUpdate(req.body.data.Id, req.body.data.dev , function(err, newlyUpdatedDevice){
        if (err){
            console.log(err)
        } else {
            ClientDevicePart.deleteMany({_id:{$in:req.body.data.partDel}}, function(err){
                if (err) {
                    console.log(err)
                } else {
                    ClientDevicePart.insertMany(req.body.data.part, function(err, newlyCreatedPart){
                        if (err){
                            console.log(err)
                        } else {
                            for (let i = 0; i < newlyCreatedPart.length; i++) {
                                newlyUpdatedDevice.partSN.push(newlyCreatedPart[i])
                            }
                            newlyUpdatedDevice.save()
                            res.send({
                                text: 'You have successfuly edited <strong><u>' + newlyUpdatedDevice.deviceName + '</u></strong> device',
                                header: 'Edit device',
                                icon: 'success'
                            })
                        }
                    })
                }
            })
        }
    })
});
// ============================================================
// Delete Client device 
// ============================================================
//Delete client (ajax)
router.delete("/client/view/device/delete", function(req, res){
    console.log(req.body.data)
    // Client.findByIdAndDelete(req.body.data.id,function(err){
    //     if (err){
    //         console.log(err)
    //     } else {
    //         ClientCont.deleteMany({_id:{$in:req.body.data.contID}},function(err){
    //             if (err){
    //                 console.log(err)
    //             } else {
    //                 res.send({flash: 'success', message: "Delete client Success" })
    //             }
    //         })
    //     }
    // })
})














// ============================================================
// Lunching client Device view page
// client view
// ============================================================


// ============================================================
// Lunching client view device page
// Viewing client device specificaly (device View)
// ============================================================
router.get("/client/:clntId/device/:devId", function(req, res){
    res.render("client/device",{
        clntId: req.params.clntId,
        devId: req.params.devId
    })
});
module.exports = router;
