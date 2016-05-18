var express = require('express');
var session = require('express-session');
var router = express.Router();
var url = require('url');
var db = require("../db.js"); //Is this the best way to reference the database?
var searchDatabase = require("../search.js");
var login = require("../login.js");
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

/*seller sale history*/
router.get('/saleHistory',function(req,res,next){
  res.render('saleHistory');
});

/* GET sellerAdd page. */
router.get('/sellerAdd', function(req, res, next) {
    //Get the possible colours from the database
    db.getActiveListings(function (err, res2) {
        console.log(res2);
    });
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
                    //console.log(types);
                    if (req.query.ListingTitle == null) {
                        //If no data has been submitted, display the add a listing page (sellerAdd)

                        res.render('sellerAdd', {title: 'Add a listing', colours: colours, types: types });
                    } else {
                        //If data has been submitted, create a new listing record in the database
                        var SellerKey = 1; //Default for now. This should be passed in depending on the auth type we use.
                        var TypeKey = req.query.TypeKey; //Default for now. Will be passed from res.query.TypeKey
                        var ListingTitle = req.query.ListingTitle;
                        var ListingDesc = req.query.ListingDesc;
                        var ListingPrice = req.query.ListingPrice;
                        var ListingImage = "./2.jpg"; //Default for now. This part will need an upload feature.
                        //Before adding data to the database, first validate & check the data is in the right format (int, string, etc.)


                        //Now add the data to the listing table

                        db.addListing(SellerKey,TypeKey,ListingTitle,ListingDesc,ListingPrice,ListingImage,function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                //Will then need to add records to ListingColour and ListingSize tables.
                                /*
                                for (var i=0; i<colours.length; i++) {
                                    var colKey = colours[i].ColourKey;
                                    if (req.query.colKey != null) {
                                        db.addListingColour(ListingKey,colKey,function(err) {
                                            if (err) console.log(err);
                                        });
                                    }
                                }
                                */
                            }
                        });

                        //Then, display the listing on the listing page?? Or go back to the sellerAdd page?
                        res.render('sellerAdd', {title: 'Add a listing', colours: colours, types: types });
                    }
                }
            });
        }
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

    login.login(req.body.user,req.body.pass, function(result){

       // console.log("the result is == " +result);

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
        // do your thang
        res.redirect(backURL);
    }
    else {
        user.loggedIn=false;
        user.username="";
        backURL=req.header('Referer') || '/login';
        // do your thang
        res.redirect(backURL);
    }

});

router.get('/register', function(req,res){
    res.render('register');
})

router.post('/register', function(req,res){
    console.log(req.body);
    login.register(req.body,function(result){
        if(result){
            res.render('register', {message:'successfully registered!'});
        } else {
            res.render('register', {message: 'error while registering, invalid information or username already exists'});
        }

    });
})


module.exports = router;
