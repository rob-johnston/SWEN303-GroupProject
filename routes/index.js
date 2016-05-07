var express = require('express');
var router = express.Router();
var url = require('url');
var db = require("../db.js"); //Is this the best way to reference the database?
var searchDatabase = require("../search.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET listing page. */
router.get('/listing', function(req, res, next) {
    //Get the individual listing ID (from the url?)
    //Query the database for all info needed
    db.each('SELECT * FROM Colour', function(err, res){
        if (err){
            console.log(err);
        } else {
            console.log(res);
        }
    });
    //This data will be obtained from the database - default info at the moment
    // ------------------------------------------------------------------------
    var price = 2.00;
    var description = "Description";
    var listingTitle = "tempTitle";
    var image = "images/3.jpg";
    // ------------------------------------------------------------------------
    var resultsArray = {listingTitle: listingTitle, description: description, price: price, image: image};
    res.render('listing', { title: "listing", results: resultsArray});
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

module.exports = router;

