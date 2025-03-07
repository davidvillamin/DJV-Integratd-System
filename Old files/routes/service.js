var express                             = require("express"),
    router                              = express.Router(),
    fs                                  = require ('fs'),
    path                                = require('path'),
    moment                              = require('moment'),

    //models
    Client                              =require('../models/client.js'),
    DeviceDb                            =require('../models/deviceDb.js'),
    RepairJobOrder                      =require('../models/serviceRepairJobOrder.js'),
    StatusReport                        =require('../models/serviceStatusReport.js'),
    MarketingJobOrder                   =require('../models/serviceMarketingJobOrder.js'),
    ImgVideoDb                          =require('../models/imgVideoDb.js'),
    ServiceType                         =require('../models/serviceType.js'),
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
// ===============================================
// Create Job Order filtered by category
// ===============================================
router.get("/service/:svcsCat/:svcsId/jo/create", function(req, res){ //populate service type on create jo
    ServiceType.findById(req.params.svcsId)
        .lean()
        .exec(function(err, foundServiceType){
            if (err){
                console.log(err)
            } else {
                switch (req.params.svcsCat){
                    case 'Repair':
                        res.render("service/repairJobOrder/create-repair-jo",{
                            foundServiceType: foundServiceType
                        })
                        break;
                    case 'Marketing':
                        res.render("service/marketingJobOrder/create-marketing-jo",{
                            foundServiceType: foundServiceType
                        })
                        break;
                }
            }
        })
})
// ===============================================
// CRUD Repair Job Order
// ===============================================
// lunch job order index page
router.get("/service/repair/jo", function(req, res){
    res.render("service/repairJobOrder/index")
})
// populate repair jo table index
router.get("/service/repair/ajaxInit/jo", function(req, res){
    RepairJobOrder.find()
        .populate("client")
        .populate("serviceType")
        .populate("clientDevice")
        .populate("troubleFile")
        .lean()
        .exec(function(err, foundJobOrder){
        if (err){
            console.log(err)
        } else {
            res.send({foundJobOrder: foundJobOrder})
        }
    })
})
//create job order
router.post("/service/repair/jo/create", upload.array('crtJoRepSvcsTroubleFile',10),function(req, res){
    // read text file for job order number
    var joIndexLink = path.join( __dirname ,'../public/joIndex.txt')
    fs.readFile(joIndexLink, 'utf8', function(err, data) {
        if (err) {
            console.log(err)
        } else{
            // convert indexjo to object
            data = JSON.parse(data)
            // convert string of JO to object
            req.body.jo = JSON.parse(req.body.jo)
            //create joborder number
            req.body.jo.joNum = req.body.dateRecieve + "-" + data.index
            // Save images in db
            ImgVideoDb.insertMany(req.files ,function(err, newlyCreatedImgVideo){
                if (err){
                    console.log(err)
                } else {
                    // create jobOrder
                    RepairJobOrder.create(req.body.jo, function(err,newlyCreatedJo){
                        if (err){
                            console.log(err)
                        } else {
                            // increment 1 on index 
                            data.index += 1
                            //find client and it's device
                            Client.findById(req.body.clntId, function(err, newlyFoundClient){
                                if (err){
                                    console.log(err)
                                } else {
                                    DeviceDb.findById(req.body.devId, function(err, foundClientDevice){
                                        if (err){
                                            console.log(err)
                                        } else {
                                            //find service Type
                                            ServiceType.findById(req.body.typeId, function(err, foundServiceType){
                                                if (err){
                                                    console.log(err)
                                                } else {
                                                    // push all data to newly created job order
                                                    newlyCreatedJo.client.push(newlyFoundClient)
                                                    newlyCreatedJo.clientDevice.push(foundClientDevice)
                                                    newlyCreatedJo.serviceType.push(foundServiceType)
                                                    // console.log(newlyCreatedImgVideo)
                                                    // newlyCreatedJo.troubleFile.push(JSON.parse(newlyCreatedImgVideo))
                                                    for (let i = 0; i < newlyCreatedImgVideo.length; i++) {
                                                        newlyCreatedJo.troubleFile.push(newlyCreatedImgVideo[i])
                                                    }
                                                    newlyCreatedJo.save()
                                                    // save jo to client device
                                                    foundClientDevice.jobOrder.push(newlyCreatedJo)
                                                    foundClientDevice.save()
                                                    // update file
                                                    fs.writeFile(joIndexLink, JSON.stringify(data), function (err) {
                                                        if(err){
                                                            console.log(err)
                                                        }  else {
                                                            res.send({
                                                                text: 'You have successfuly created Joborder#: <strong><u>' + (data.index-1) + '</u></strong>.\
                                                                    Please wait. you will redirected to job order list.',
                                                                header: 'Create job order',
                                                                icon: 'success'
                                                            })
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    });
})
// lunch edit page of repair jo
router.get("/service/repair/jo/:joId/edit", function(req, res){
    RepairJobOrder.findById(req.params.joId)
        .populate("client")
        .populate("serviceType")
        .populate("clientDevice")
        .populate("troubleFile")
        .lean()
        .exec(function(err,foundRepairJo){
        if (err){
            console.log(err)
        } else {
            res.render("service/repairJobOrder/edit-repair-jo",{
                foundRepairJo:foundRepairJo
            })
        }
    })
})

// populate repair edit jo via ajax
router.put("/service/repair/jo/edit", upload.array('edtJoRepSvcsTroubleFile',10), function(req, res){
    // update the jo file first
    RepairJobOrder.findByIdAndUpdate(req.body.joId,req.body.jo,function(err,foundRepairJo){
        if (err) {
            console.log(err)
        } else {
            // delete part
            // verify if the delete array no empty
            // convert to array of object id the string of id to be deleted
            var imgDel = req.body.imgDel.split(",")
            var jo = JSON.parse(req.body.jo)
            // create promise for delete
            var delImgPromise = new Promise(function(resolve,reject){
                if (imgDel[0] == ''){
                    reject()
                } else {
                    resolve(imgDel)
                }
            })
            var insImgPromise = new Promise(function(resolve,reject){
                if ( req.files !== []){
                    var files = req.files
                    resolve(files)
                } else {
                    reject()
                }
            })
            Promise.allSettled([
                delImgPromise.then(function(imgDel){
                    ImgVideoDb.find({'_id':{$in:imgDel}})
                    .lean()
                    .exec(function(err, foundImgVideoDb){
                        if (err){
                            console.log(err)
                        } else {
                            // delete file on upload folder
                            foundImgVideoDb.forEach(function(imgDel){
                                fs.unlink('./public/uploads/'+ imgDel.filename,function(err){
                                    if(err){
                                        console.log(err)
                                    } 
                                })
                            })
                            // now we delete the videos in db.
                            ImgVideoDb.deleteMany({_id:{$in:imgDel}},function(err){
                                if (err){
                                    console.log(err)
                                } else {
                                    RepairJobOrder.findByIdAndUpdate(req.body.joId, {
                                        $pullAll: {
                                            troubleFile: imgDel
                                        }
                                    }, function(err){
                                        if (err){
                                            console.log(err)
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
                ,insImgPromise.then(function(files){
                    ImgVideoDb.insertMany(files ,function(err, newlyCreatedImgVideo){
                        if (err){
                            console.log(err)
                        } else {
                            RepairJobOrder.findById(req.body.joId, function(err, foundRepairJo){
                                if (err){
                                    console.log(err)
                                } else {
                                    newlyCreatedImgVideo.forEach(function(file){
                                        foundRepairJo.troubleFile.push(file)
                                    })
                                    foundRepairJo.save()
                                }
                            })
                        }
                    })
                })
            ]).then(function(value){
                // findbyid and update na to. ayaw nya kc ng manual. gusto automated buraot
                RepairJobOrder.findById(req.body.joId,function(err,foundRepairJo){
                    if (err) {
                        console.log(err)
                    } else {
                        // update data 
                        foundRepairJo.recievedBy = jo.recievedBy
                        foundRepairJo.dateRecieve = jo.dateRecieve
                        foundRepairJo.trouble = jo.trouble
                        foundRepairJo.serviceCharge = jo.serviceCharge
                        foundRepairJo.draftMat = jo.draftMat

                        foundRepairJo.save()
                        res.send({
                            text: 'You have successfuly updated Joborder#: <strong><u>' + foundRepairJo.joNum + '</u></strong>.',
                            header: 'Edit job order',
                            icon: 'success'
                        })
                    }
                })
            })
        }
    })
})
// delete job order
router.delete('/service/repair/jo/delete',function(req, res){
    //delete job order
    RepairJobOrder.findByIdAndDelete(req.body.data,function(err, deletedJo){
        if (err){
            console.log(err)
        } else {
            // find images to delete
            ImgVideoDb.find({'_id':{$in: deletedJo.troubleFile}},function(err,foundImgVideoDb){
                if (err){
                    console.log(err)
                } else {
                    //delete images on uploads folder
                    foundImgVideoDb.forEach(function(imgDel){
                        fs.unlink('./public/uploads/'+ imgDel.filename,function(err){
                            if(err){
                                console.log(err)
                            } 
                        })
                    })

                    // delete all files in imgvideo db
                    ImgVideoDb.deleteMany({'_id':{$in:deletedJo.troubleFile}}, function(err){
                        if (err) {
                            console.log(err)
                        } else {
                            // delete job order on device
                            DeviceDb.findByIdAndUpdate(deletedJo.clientDevice[0],{
                                $pull: {
                                    jobOrder: deletedJo._id
                                }
                            },function(err){
                                if (err){
                                    console.log(err)
                                } else {
                                    res.send({
                                        text: 'You have successfuly deleted Joborder#: <strong><u>' + deletedJo.joNum + '</u></strong>.',
                                        header: 'Delete job order',
                                        icon: 'success'
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})


// ===============================================
// CRUD view repair job Order
// ===============================================
// view job order
router.get("/service/repair/jo/:joId", function(req, res){
    res.render("service/repairJobOrder/view")
})
// populate view job order
router.post("/service/repair/jo/ajaxInit/view", function(req, res){
    RepairJobOrder.findById(req.body.data)
        .populate("client")
        .populate("serviceType")
        .populate("clientDevice")
        .populate("troubleFile")
        // .populate("statusReport")
        .populate({
            path : 'statusReport',
            populate : {
              path : 'statusReportFile'
            }
        })
        .lean()
        .exec(function(err, foundJo){
        if (err) {
            console.log(err)
        } else {
            res.send({
                foundJo:foundJo
            })
        }
    })
})
// add report status
router.put('/service/repair/jo/repStat',upload.array('joViewRepStatAddFile',10),function(req, res){
    console.log(req.files)
    var report = JSON.parse(req.body.report)
    ImgVideoDb.insertMany(req.files ,function(err, newlyCreatedImgVideo){
        if (err){
            console.log(err)
        } else {
            StatusReport.create(report,function(err,newlyCreatedStatusReport){
                if (err) {
                    console.log(err)
                } else {
                    if (newlyCreatedImgVideo.length !== 0){
                        for (let i = 0; i < newlyCreatedImgVideo.length; i++) {
                            newlyCreatedStatusReport.statusReportFile.push(newlyCreatedImgVideo[i])
                        }
                        newlyCreatedStatusReport.save()
                    } 
                    RepairJobOrder.findById(req.body.joId, function(err,foundRepairJo){
                        if (err){
                            console.log(err)
                        } else {
                            foundRepairJo.statusReport.push(newlyCreatedStatusReport)
                            foundRepairJo.save()
                            res.send({
                                text: 'You have successfuly updated Joborder#: <strong><u>' + foundRepairJo.joNum + '</u></strong>.',
                                header: 'Status Report Update',
                                icon: 'success'
                            })
                        }
                    })
                    
                }
            })
        }
    })
})


// ===============================================
// CRUD Marketing Job Order
// ===============================================
// lunch job order index page
router.get("/service/marketing/jo", function(req, res){
    res.render("service/marketingJobOrder/index")
})
// populate Marketing jo table index
router.get("/service/marketing/ajaxInit/jo", function(req, res){
    MarketingJobOrder.find()
        .populate("client")
        .populate("serviceType")
        .populate("clientDevice")
        .lean()
        .exec(function(err, foundJobOrder){
        if (err){
            console.log(err)
        } else {
            res.send({foundJobOrder: foundJobOrder})
        }
    })
})
module.exports = router;
