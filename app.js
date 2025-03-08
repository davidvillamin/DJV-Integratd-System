var express                         = require("express"),
    app                             = express(),
    Moment                          = require("moment"),
    bodyParser                      = require("body-parser"),
    passport                        = require("passport"),
    LocalStrategy                   = require("passport-local"),
    methodOverride                  = require("method-override"),
    flash                           = require("connect-flash"),
    // this is for test only
    // testRoutes                      = require("./routes/test"), 
    // seedsRoutes                     = require("./routes/seeds"), 
    //include all routes
    indexRoutes                     = require("./routes/index"), 
    clientRoutes                    = require("./routes/client"), 
    // settingsRoutes                  = require("./routes/settings"),
    // warehouseRoutes                 = require("./routes/warehouse"),
    // supplierRoutes                  = require("./routes/supplier"),
    transactionRoutes               = require("./routes/transaction"),
    transactionInhouseRoutes        = require("./routes/transactionInhouse"),
    transactionOnSiteRoutes         = require("./routes/transactionOnsite"),
    transactionSalesRoutes          = require("./routes/transactionSales"),
    transactionProjectRoutes        = require("./routes/transactionProject"),
    //parts
    partsRoutes                     = require("./routes/parts"),
    //device
    deviceRoutes                    = require("./routes/device"),
    //settings
    settingsRoutes                    = require("./routes/settings"),

    // serviceRoutes                   = require("./routes/service"), 
    niceAdminRoutes                 = require("./routes/niceadmin");

//======================================================================================================
//                                      MONGOOSE CONFIG
//======================================================================================================
var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/DJVIntegratedSystem';
//Get the default connection
// mongoose.connect(mongoDB, { useNewUrlParser: true });
//connection with declaired pool size
mongoose.connect(mongoDB, {
    maxPoolSize: 50,
    // bufferMaxEntries: 0,
    // reconnectTries: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//======================================================================================================
//                                      PASSPORT CONFIG
//======================================================================================================
// app.use(require("express-session")({
//     secret: "Don_David",
//     resave: false,
//     saveUninitialized: false
// }))
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(flash());
// app.use(function(req, res, next){
//     res.locals.currentUser = req.user;
//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success");
//     next();
// })

//======================================================================================================
//                                      CONFIG
//======================================================================================================

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended: true}));
app.use('/modules', express.static(__dirname + '/node_modules/'));
// app.use('/public', express.static(__dirname + '/public/'));
// app.use('/js', express.static(__dirname + '/jquery/'));
app.use('/assets', express.static(__dirname + '/assets/'));

app.set("view engine", "ejs");
app.use(methodOverride("_method"));


app.use(indexRoutes);
app.use(clientRoutes);
app.use(transactionInhouseRoutes);
app.use(transactionOnSiteRoutes);
app.use(transactionProjectRoutes);
app.use(transactionSalesRoutes);
app.use(partsRoutes);
app.use(deviceRoutes);
app.use(settingsRoutes);

// app.use(serviceRoutes);
// app.use(settingsRoutes);
// app.use(warehouseRoutes);
app.use(niceAdminRoutes);
app.use(transactionRoutes);
// app.use(supplierRoutes);

// this is for test only
// app.use(testRoutes);

app.listen(2000, function(){
    console.log("DJV Integrated System is up and running!");
})