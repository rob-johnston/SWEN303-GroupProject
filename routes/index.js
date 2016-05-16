var express = require('express');
var session = require('express-session');
var router = express.Router();
var url = require('url');
var db = require("../db.js"); //Is this the best way to reference the database?
var searchDatabase = require("../search.js");
var viewlisting = require("../viewlisting.js");

var user = {
    username:"", email:"", loggedIn: false
};

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
        console.log(resultsArray);
        //render listing to page
        res.render('listing', { title: "listing", results: resultsArray});
    });
});

/* GET sellerAdd page. */
router.get('/sellerAdd', function(req, res, next) {
    if (req.query.ListingTitle == null) {
        //If no data has been submitted, display the add a listing page (sellerAdd)
        res.render('sellerAdd', { title: 'Add a listing' });
    } else {
        //If data has been submitted, create a new listing record in the database
        
        //Then, display the listing on the listing page?? Or go back to the sellerAdd page?
        res.render('sellerAdd', { title: 'Express' });
    }
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
    searchDatabase.basicSearch(function (resultsArray){
        //console.log(resultsArray);
        //render results to page
        res.render('searchpage', { results: resultsArray});
    });
});



/* Setup route.*/
router.get('/admin', function(req, res){
    if(!user.loggedIn){
        res.send("fuck off");
    } else
    {
        res.send("yes you are now allowed to see this page");
    }
});

/* Setup route.*/
router.get('/login', function(req, res){
      res.render('login');
});

router.get('/logout', function(req, res){
    user.loggedIn=false;
    res.send("youve logged out");
});


module.exports = router;

