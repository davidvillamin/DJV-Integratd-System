var express                             = require("express"),
    router                              = express.Router();

    // models
    Mat                                 =require('../models/mat'),
    MatBrand                            =require('../models/matBrand'),
    MatType                             =require('../models/matType');


router.get("/warehouse", function(req, res){
    res.render("warehouse/index")
});
router.get("/warehouse/mat", function(req, res){
    res.render("warehouse/mat")
});
router.get("/warehouse/mat/:matId", function(req, res){
    Mat.findById(req.params.matId)
        .populate('type')
        .populate('brand')
        .lean()
        .exec(function(err, foundMat){
            if (err){
                console.log(err)
            } else {
                res.render("warehouse/mat-view",{
                    foundMat:foundMat
                })
                
            }
        })
});
router.get("/client/:clntId", function(req, res){
    Client.findById(req.params.clntId)
        .populate("contact")
        .populate("type")
        .exec(function(err, foundClient){
        if (err){
            console.log(err)
        } else {
            res.render("client/view",{
                foundClient: foundClient
            })
        }
    })
});

// ============================================================
// populate warehouse
// ============================================================
//poplulate material type ajax
router.get("/warehouse/ajaxInit/matType", function(req, res){
    MatType.find().lean().exec(function(err, foundMatType){
        if (err){
            console.log(err)
        } else{
            res.send({
                foundMatType: foundMatType
            })
        }
    })
})
//Poplulate material brand ajax
router.get("/warehouse/ajaxInit/matBrand", function(req, res){
    MatBrand.find().lean().exec(function(err, foundMatBrand){
        if (err){
            console.log(err)
        } else{
            res.send({
                foundMatBrand: foundMatBrand
            })
        }
    })
})
//populate material table
router.get("/warehouse/ajaxInit/mat", function(req, res){
    Mat.find()
        .populate('brand')
        .populate('type')
        // .populate('serial')
        .lean()
        .exec(function(err, foundMat){
        if (err){
            console.log(err)
        } else{
            res.send({
                foundMat: foundMat
            })
        }
    })
})

// ============================================================
// Crud Create material
// ============================================================
router.post("/warehouse/mat/create", function(req, res){
    Mat.create(req.body.data.mat,function(err, newlyCreatedMat){
        if (err){
            console.log(err)
        } else{
            MatType.findById(req.body.data.matType, function(err, foundMatType){
                if (err){
                    console.log(err)
                } else {
                    MatBrand.findById(req.body.data.matBrand, function(err, foundMatBrand){
                        if (err) {
                            console.log(err)
                        } else {
                            newlyCreatedMat.brand.push(foundMatBrand)
                            newlyCreatedMat.type.push(foundMatType)
                            newlyCreatedMat.save()
                            res.send({flash: 'success', message: "New material created" })
                        }
                    })
                }
            })
        }
    })
})
// ============================================================
// Crud Edit material
// ============================================================
router.post("/warehouse/mat/edit", function(req, res){
    var clearArray = []
    Mat.findByIdAndUpdate(req.body.data.matId,req.body.data.mat,function(err, foundMat){
        if (err){
            console.log(err)
        } else{
            MatType.findById(req.body.data.matType, function(err, foundMatType){
                if (err){
                    console.log(err)
                } else {
                    MatBrand.findById(req.body.data.matBrand, function(err, foundMatBrand){
                        if (err) {
                            console.log(err)
                        } else {
                            foundMat.brand = clearArray
                            foundMat.brand.push(foundMatBrand)
                            foundMat.type =clearArray
                            foundMat.type.push(foundMatType)
                            foundMat.save()
                            res.send({flash: 'success', message: "Material Edit sucess" })
                        }
                    })
                }
            })
        }
    })
})
// ============================================================
// Crud Delete material
// ============================================================
router.delete("/warehouse/mat/delete", function(req, res){
    Mat.findByIdAndDelete(req.body.data.id,function(err){
        if (err){
            console.log(err)
        } else{
            res.send({flash: 'success', message: "Material Delete sucess" })
        }
    })
})
module.exports = router;
