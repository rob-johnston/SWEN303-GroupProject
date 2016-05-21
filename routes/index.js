var express = require('express');
var session = require('express-session');
var router = express.Router();
var url = require('url');
var db = require("../db.js"); //Is this the best way to reference the database?
var searchDatabase = require("../search.js");
var login = require("../login.js");
var viewlisting = require("../viewlisting.js");

//For uploading
var multer = require('multer');
var upload = multer({dest: '../public/images'});

//for renaming files
var fs = require('fs');

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
    username:"", email:"", loggedIn: false, cart: cart
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
        //ResultsArray[0] is the entire listing information.
        //ResultsArray[1] contains the colour information for this listing.
        //render listing to page
        res.render('listing', { title: "listing",user:user, results: resultsArray[0], colours: resultsArray[1]});
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

router.get('/addToCart',function(req,res,next){
    var ColourKey = req.query.ColourKey;
    var ListingKey = req.query.ListingKey;
    var ListingTitle = req.query.ListingTitle;
    var ListingImage = "/images" + req.query.ListingImage.substring(1);
    var ListingPrice = parseFloat(req.query.ListingPrice); //Have to parseFloat or it will be treated as a string and concatenated instead of added.
    //console.log(ListingKey);
    //console.log(ColourKey);
    //console.log(ListingPrice);
    //console.log(ListingImage);
    //console.log(ListingTitle);
    //Item includes the ListingKey and ColourKey so we can remove from the database on checkout.
    var item = {name: ListingTitle, imageString: ListingImage, price: ListingPrice, ListingKey: ListingKey, ColourKey: ColourKey};
    user.cart.push(item);
    res.redirect('/cart');
});


/*seller view page*/
router.get('/seller',function(req,res,next){
  var id = req.query.user;

  if (!id){
    id = 'joely';
  }
  //Find the user record
  db.db.get('SELECT * FROM User WHERE UserName = ?', id, function(err, r1){
    if (err || !r1){
      console.log(err);
      res.send(404);
    } else {

      //Find all the user reviews
      db.db.all('SELECT * FROM VReview WHERE SellerKey = ?', r1.UserKey, function(err, r2){
        var reviews = r2 ? r2 : [];
        res.render('sellerView', {user:user, seller:r1, reviews: reviews});
      })

    }
  });
});

/*seller listings page*/
router.get('/sellerListing',function(req,res,next){
  var id = req.params.user;

  if (!id){
    id = 'joely';
  }
    console.log("params: " + req.params);
    console.log("query: " + req.query);

  db.getUserListing(id, function(err, data){
    if (err){
      console.log(err);
      res.send(404);
    } else {
      console.log(data);
      res.render('sellerListing', {user:user, listings: data})
    }
  });

});

/*seller edit profile*/
router.get('/editProfile',function(req,res,next){
  res.render('editSeller');
});

/*seller sale history*/
router.get('/saleHistory',function(req,res,next){
  res.render('saleHistory');
});

/* GET sellerAdd page. */
router.get('/sellerAdd', function(req, res, next) {
    //Get the possible colours from the database
    var colours = [];
    var types = [];
    db.getAllColours(function (err, dbColours) {
        if (err) {
            console.log(err);
        } else {
            colours = dbColours;
            //Probably not ideal to call from inside the other function...
            db.getAllTypes(function (err, dbTypes) {
                if (err) {
                    console.log(err);
                } else {
                    types = dbTypes;
                    res.render('sellerAdd', {title: 'Add a listing', user:user, colours: colours, types: types });
                }
            });
        }
    });
});

router.post("/add", upload.single('fileUpload'),function(req,res,next) {
    viewlisting.createListing(req, res, user, function(colours,types) {
        res.redirect('/sellerListing?user=' + user.username); //TODO How should I be passing in username here?
        //res.render('sellerAdd', {title: 'Add a listing', user:user, colours: colours, types: types });
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
        var dummy=[];
        //check for failed data and change to safe array to pass
        if(resultsArray==undefined || resultsArray[0]==undefined){
            resultsArray=dummy;
        }
        res.render('searchpage', { results: resultsArray, resultslength: resultsArray.length});});
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

    login.login(req.body.user,req.body.pass, function(result){
        var validLogin = (result==true);
        var errorAlert;

        if(validLogin){
            errorAlert=false;
        }
        else {
            errorAlert=true;
        }
        //if  login is valid then sign user in
        if(validLogin) {
            user.username = req.body.user;
            user.loggedIn = true;
            //render success message
            res.render('login', {errorAlert: errorAlert, loggedIn: user.loggedIn, username: user.username});

            /*TODO -- here we are just rendering a shitty success message, would be cool if we could redirect to the seller home page or whatever*/

           // backURL=req.header('Referer') || '/sellerView';
           // res.redirect('sellerView');
        }
        else {
            //failed login so print error
            res.render('login', {errorAlert: errorAlert})
        }
    })
});

/* Setup route.*/
router.get('/login', function(req, res){
      res.render('login', {loggedIn: user.loggedIn, username : user.username});
});

router.get('/logout', function(req, res){
    if(user.loggedIn==false){
        backURL=req.header('Referer') || '/login';
        res.redirect(backURL);
    }
    else {
        user.loggedIn=false;
        user.username="";
        backURL=req.header('Referer') || '/login';
        // do your thang
        res.render('login', {message: 'Thanks for shopping with us!', loggedIn: user.loggedIn});
    }

});

router.get('/register', function(req,res){
    res.render('register');
})

router.post('/register', function(req,res){
    login.register(req.body,function(result){
        if(result){
            res.render('register', {message:'successfully registered!'});
        } else {
            res.render('register', {message: 'error while registering, invalid information or username already exists'});
        }

    });
})


module.exports = router;
