var express                             = require("express"),
    router                              = express.Router();

router.get("/niceAdmin", function(req, res){
    res.render("niceAdmin/index")
});

router.get("/niceAdmin/charts-apexcharts", function(req, res){
    res.render("niceAdmin/charts-apexcharts")
});
router.get("/niceAdmin/charts-chartjs", function(req, res){
    res.render("niceAdmin/charts-chartjs")
});
router.get("/niceAdmin/charts-echarts", function(req, res){
    res.render("niceAdmin/charts-echarts")
});
router.get("/niceAdmin/components-accordion", function(req, res){
    res.render("niceAdmin/components-accordion")
});
router.get("/niceAdmin/components-alerts", function(req, res){
    res.render("niceAdmin/components-alerts")
});
router.get("/niceAdmin/components-badges", function(req, res){
    res.render("niceAdmin/components-badges")
});
router.get("/niceAdmin/components-breadcrumbs", function(req, res){
    res.render("niceAdmin/components-breadcrumbs")
});
router.get("/niceAdmin/components-buttons", function(req, res){
    res.render("niceAdmin/components-buttons")
});

router.get("/niceAdmin/components-cards", function(req, res){
    res.render("niceAdmin/components-cards")
});
router.get("/niceAdmin/components-carousel", function(req, res){
    res.render("niceAdmin/components-carousel")
});
router.get("/niceAdmin/components-modal", function(req, res){
    res.render("niceAdmin/components-modal")
});
router.get("/niceAdmin/components-pagination", function(req, res){
    res.render("niceAdmin/components-pagination")
});
router.get("/niceAdmin/components-progress", function(req, res){
    res.render("niceAdmin/components-progress")
});
router.get("/niceAdmin/components-spinners", function(req, res){
    res.render("niceAdmin/components-spinners")
});
router.get("/niceAdmin/components-tabs", function(req, res){
    res.render("niceAdmin/components-tabs")
});
router.get("/niceAdmin/components-tooltips", function(req, res){
    res.render("niceAdmin/components-tooltips")
});
router.get("/niceAdmin/dashboard", function(req, res){
    res.render("niceAdmin/dashboard")
});
router.get("/niceAdmin/forms-editors", function(req, res){
    res.render("niceAdmin/forms-editors")
});
router.get("/niceAdmin/forms-elements", function(req, res){
    res.render("niceAdmin/forms-elements")
});
router.get("/niceAdmin/forms-layouts", function(req, res){
    res.render("niceAdmin/forms-layouts")
});
router.get("/niceAdmin/forms-validation", function(req, res){
    res.render("niceAdmin/forms-validation")
});
router.get("/niceAdmin/icons-bootstrap", function(req, res){
    res.render("niceAdmin/icons-bootstrap")
});
router.get("/niceAdmin/icons-boxicons", function(req, res){
    res.render("niceAdmin/icons-boxicons")
});
router.get("/niceAdmin/icons-remix", function(req, res){
    res.render("niceAdmin/icons-remix")
});
router.get("/niceAdmin/pages-blank", function(req, res){
    res.render("niceAdmin/pages-blank")
});
router.get("/niceAdmin/pages-contact", function(req, res){
    res.render("niceAdmin/pages-contact")
});
router.get("/niceAdmin/pages-error-404", function(req, res){
    res.render("niceAdmin/pages-error-404")
});
router.get("/niceAdmin/pages-faq", function(req, res){
    res.render("niceAdmin/pages-faq")
});
router.get("/niceAdmin/pages-login", function(req, res){
    res.render("niceAdmin/pages-login")
});
router.get("/niceAdmin/pages-register", function(req, res){
    res.render("niceAdmin/pages-register")
});

router.get("/niceAdmin/tables-data", function(req, res){
    res.render("niceAdmin/tables-data")
});
router.get("/niceAdmin/tables-general", function(req, res){
    res.render("niceAdmin/tables-general")
});
router.get("/niceAdmin/users-profile", function(req, res){
    res.render("niceAdmin/users-profile")
});


module.exports = router;
