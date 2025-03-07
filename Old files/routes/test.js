var express                             = require("express"),
    router                              = express.Router(),
    multer                              = require('multer'),
    storage                              = multer.diskStorage({ 
                                            destination: function (req, file, cb) {
                                                cb(null, './public/uploads')
                                                },
                                            filename: function (req, file, cb) {
                                                let extArray = file.mimetype.split("/");
                                                let extension = extArray[extArray.length - 1];
                                                cb(null, Date.now() + "." + extension)
                                            }
                                        }),
    // upload                              = multer({ storage: storage }).array('uploaded_file',10),
    upload                              = multer({ storage: storage }),
    fs                                  = require('fs'),
    path                                = require('path');
router.get("/test", function(req, res){
    res.render('test')
})
router.post("/test",upload.any(), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // console.log(req.file)
    // console.log(req.files)
    console.log(req.files)
    // console.log(req.files.afiles2[0])
    // console.log(req.body)
    res.send("alert('done')")
 });
// router.post("/test",upload.array('afiles',10), function (req, res) {
//     // req.file is the name of your file in the form above, here 'uploaded_file'
//     // req.body will hold the text fields, if there were any 
//     console.log(req.file)
//     console.log(req.files)
//     console.log(req.body)
//     res.send("alert('done')")
//  });
// router.delete("/test/delete", function (req, res) {
//     // req.file is the name of your file in the form above, here 'uploaded_file'
//     // req.body will hold the text fields, if there were any 
//     console.log(req.body)
//     var linkStr = path.join(__dirname, '../public/uploads/')
//     req.body.data.forEach(function(link){
//         var tempStr = linkStr + link.split('/')[3]
//         fs.unlink(tempStr,function(err){
//             if(err){
//                 console.log(err)
//             } else {
//                 console.log('deleted')
//             }
//         })
//     })
//     res.send("alert('done')")
//  });

 router.get('/getFile',function(req, res){
    var linkStr = path.join(__dirname, '../public/uploads/')
    var fileSend = []
    fs.readdir(linkStr, function (err, files) {
        //handling error
        if (err) {
            console.log(err);
        } else {
            //listing all files using forEach
            // console.log(files)
            files.forEach(function (file,i) {
                // Do whatever you want to do with the file
                fileSend.push("/public/uploads/"+file)
                // file = link + file 
            });
            res.send({fileSend:fileSend})
        }
    });
 })
module.exports = router;
