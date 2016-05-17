var express = require('express');
var session = require('express-session');
var router = express.Router();
var url = require('url');
var db = require("../db.js"); //Is this the best way to reference the database?
var searchDatabase = require("../search.js");
var viewlisting = require("../viewlisting.js");

var item = {
    name: "top hat",
    imageString: "/images/1.jpg",
    price: 16
}

var item1 = {
    name: "top hat",
    imageString: "/images/1.jpg",
    price: 16
}




var cart = [item,item1];
var user = {
    username:"", email:"", loggedIn: false, cart
};


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { user:user });
});

/* GET chinese home page. */
router.get('/c', function(req, res, next) {
    res.render('indexc', { user:user });
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

/*cart*/
router.get('/cart',function(req,res,next){
  res.render('cart',{user:user});
});

/*removing item from cart*/
router.get('/removeItem/:index',function(req,res,next){
  var index = req.params.index;
  user.cart.splice(index,1);
  res.redirect('/cart');
});

/**checkout page**/
router.get('/checkout',function(req,res,next){
  res.render('checkout',{user:user});
});

/**confirmation page**/
router.get('/confirmation',function(req,res,next){
  user.cart=[];
  res.redirect('/checkedOut');
});

router.get('/checkedOut',function(req,res,next){
  res.render('confirmation',{user:user});
});



/*seller view page*/
router.get('/seller',function(req,res,next){
  res.render('sellerView');
});

/*seller listings page*/
router.get('/sellerListing',function(req,res,next){
  res.render('sellerListing');
});

/*seller sale history*/
router.get('/saleHistory',function(req,res,next){
  res.render('saleHistory');
});


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
router.get('/admin', function(req, res){
    if(!user.loggedIn){
        res.send("fuck off");
    } else
    {
        res.send("yes you are now allowed to see this page");
    }
});

router.post('/login', function(req, res){

    //check database for pass assigned to username
    //if it checks out
    user.username=req.body.user;
    user.loggedIn=true;
    res.render('login');

    //otherwise render error message
});

/* Setup route.*/
router.get('/login', function(req, res){
      res.render('login');
});

router.get('/logout', function(req, res){
    user.loggedIn=false;
    user.username="";
    res.send("youve logged out");
});


module.exports = router;
