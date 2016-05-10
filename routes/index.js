var express = require('express');
var router = express.Router();
var url = require('url');
var db = require("../db.js"); //Is this the best way to reference the database?
var searchDatabase = require("../search.js");
var viewlisting = require("../viewlisting.js");

//////////////authentication stuff - in progress/////////
var auth = require('http-auth');
var basic = auth.basic({
    realm: "Fam",
    file: __dirname + "/../users.htpasswd" // testusername : testpassword
});
////////////////////////////////////////////////


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET listing page. */
router.get('/listing', function(req, res, next) {
    //Get the individual listing ID from the url.
    var urlparts = url.parse(req.url, true);
    //Pass to viewlisting file to get the results
    viewlisting.getlisting(urlparts, function (resultsArray){
        //render results to page
        res.render('listing', { title: "listing", results: resultsArray});
    });
});

/* GET search page. */
router.get('/searchpage', function(req, res, next) {
    //passing an empty array since we assume this is the first visit to this page
  var array = [];
  res.render('searchpage', { title: 'searchpage', results: array });
});

/* Execute a search and display results on searchpage*/
router.get('/search', function(req, res, next) {
    //get the search params from url
    var urlparts = url.parse(req.url, true);
    //pass to searchdatabase file to get results
    searchDatabase.basicSearch(urlparts, function (resultsArray){
        console.log(resultsArray);
        //render results to page
        res.render('searchpage', { results: resultsArray});
    });
});


//router.use(auth.connect(basic));
// Setup route.
router.get('/auth',auth.connect(basic), function(req, res){
    res.send("Well done you have logged in like a boss - " + req.user + "!");
});

module.exports = router;

