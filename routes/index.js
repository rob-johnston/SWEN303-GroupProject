var express = require('express');
var router = express.Router();
var url = require('url');
var db = require("../db.js"); //Is this the best way to reference the database?
var searchDatabase = require("../search.js");
var viewlisting = require("../viewlisting.js");

//authentication stuff
var auth = require('http-auth');
var basic = auth.basic({
    realm: "Fam",
    file: __dirname + "/../users.htpasswd" // testusername : testpassword
});



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

/*seller view page*/
router.get('/seller',function(req,res,next){
  res.render('sellerView');
})

/* GET sellerAdd page. */
router.get('/sellerAdd', function(req, res, next) {
    //Get the possible colours from the database
    var colours = [];
    db.getAllColours(function (err, res2) {
        if (err) {
            console.log(err);
        } else {
            //Having issues where colours array stays empty, as parts of this method are called asynchronously
            //Still need to fix this
            colours.push(res2);
            //console.log(colours);
        }
    });
    //console.log(colours);
    if (req.query.ListingTitle == null) {
        //If no data has been submitted, display the add a listing page (sellerAdd)

        res.render('sellerAdd', {title: 'Add a listing', colours: colours });
    } else {
        //If data has been submitted, create a new listing record in the database
        var SellerKey = 1; //Default for now. This should be passed in depending on the auth type we use.
        var TypeKey = 1; //Default for now. Will be passed from res.query.TypeKey
        var ListingTitle = req.query.ListingTitle;
        var ListingDesc = req.query.ListingDesc;
        var ListingPrice = req.query.ListingPrice;
        var ListingImage = "images/2.jpg"; //Default for now. This part will need an upload feature.
        //Before adding data to the database, first check the data is in the right format (int, string, etc.)

        //Now add the data to the listing table
        /* Commented out while testing the sellerAdd page
        db.addListing(SellerKey,TypeKey,ListingTitle,ListingDesc,ListingPrice,ListingImage,function(err, res2) {
            if (err) {
                console.log(err);
            }
        });
        */
        //Will then need to add records to ListingColour and ListingSize tables.

        //Then, display the listing on the listing page?? Or go back to the sellerAdd page?
        res.render('sellerAdd', {title: 'Add a listing', colours: colours });
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
router.get('/auth',auth.connect(basic), function(req, res){
    res.send("Well done you have logged in like a boss - " + req.user + "!");
    //will actually need a page to render here
    //need to take req.user to get username, search the DB for listings belonging to that user
    //then render them to a special sellers page that gives them the ability to change/remove listings etc
});

module.exports = router;
