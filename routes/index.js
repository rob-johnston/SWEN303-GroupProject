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
    username:"", email:"", loggedIn: false, cart: cart, admin: false
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
  db.db.get('SELECT * FROM User WHERE UserName = ?', user.username, function(err, result){
    if (err || !result){
      console.log(err);
      //res.sendStatus(404);
    } else {
        var userData = result ? result : [];
        console.log("userData");
        console.log(userData);
        res.render('checkout', {user:user, userData:userData});
    }
  });
  //res.render('checkout',{user:user});
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
      res.sendStatus(404);
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
  var id = req.query.user;

  if (!id){
    res.sendStatus(404);
    return;
  }

  db.getUserListings(id, function(err, data){
    if (err){
      res.sendStatus(404);
    } else {
      res.render('sellerListing', {user:user, listings: data})
    }
  });

});

/*seller edit profile*/
router.get('/editProfile',function(req,res,next){
  res.render('editSeller', {user:user} );
});

/*seller edit profile*/
router.post('/editSeller',upload.single('fileUpload'),function(req,res,next){
    //If successful, redirect to seller page
    var newName = req.body.name;
    var newDesc = req.body.description;
    var newCont = req.body.contact;
    var newPass = req.body.password;
    var initstmt = "SELECT * FROM User WHERE UserName = ?";
    db.db.get(initstmt, [newName], function(err,results) {
        if (results == null) {
            //Username doesn't already exist!
            //Change description
            if (newDesc != null && newDesc != "") {
                //Try to put user into the database, if unsuccessful show editSeller page with fields filled out.
                var stmt = 'UPDATE User SET UserDesc=? WHERE UserName=?';
                db.db.run(stmt, [newDesc, user.username],function(err, results) {
                    if (err) console.log(err);
                });
            }
            //Change contact details
            if (newCont != null && newCont != "") {
                //Try to put user into the database, if unsuccessful show editSeller page with fields filled out.
                var stmt = 'UPDATE User SET UserContact=? WHERE UserName=?';
                db.db.run(stmt, [newCont, user.username],function(err, results) {
                    if (err) console.log(err);
                    else user.email = newCont;
                });
            }
            //Change password
            if (newPass != null && newPass != "") {
                //Try to put user into the database, if unsuccessful show editSeller page with fields filled out.
                var stmt = 'UPDATE User SET UserPassword=? WHERE UserName=?';
                db.db.run(stmt, [newPass, user.username],function(err, results) {
                    if (err) console.log(err);
                });
            }
            //Change image
            if (req.file != null) {
                viewlisting.saveImage(req,res, function(imageName) {
                    var stmt = 'UPDATE User SET UserPicture=? WHERE UserName=?';
                    db.db.run(stmt, [imageName, user.username],function(err, results) {
                        if (err) console.log(err);
                    });
                });
            }
            //Change username
            if (newName != null && newName != "" && user.username != "admin" && newName != "admin") {
                //Try to put user into the database, if unsuccessful show editSeller page with fields filled out.
                var stmt = 'UPDATE User SET UserName=? WHERE UserName=?';
                db.db.run(stmt, [newName, user.username],function(err, results) {
                    if (err) console.log(err);
                    else {
                        user.username = newName;
                        res.render('editSeller', {user:user, message:"Change of details successful!"} );
                    }
                });
            } else {
                res.render('editSeller', {user:user, message:"Change of details successful!"} );
            }
        } else {
            //Username already exists, so request to change is unsuccessful.
            res.render('editSeller', {user:user, message:"A user with that Name already exists. Please choose another."} );
        }
    });
});

/*seller sale history*/
router.get('/saleHistory',function(req,res,next){
  var id = req.query.user;

  console.log(req.query.user);
  if (!id){
    res.sendStatus(404);
    return;
  }

  db.getDeletedUserListings(id, function(err, data){
    if (err){
      res.sendStatus(404);
      console.log(err);
    } else {
      res.render('saleHistory', {user:user, listings:data});
    }
  });
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

//POST to delete a listing
router.post("/sellerListing", function(req, res, next){
  var key = req.body.key;
  var seller = req.body.seller;

  console.log(key, seller);

  if (seller != user.username && !user.admin){
    res.sendStatus(401); //Check the user is allowed to delete this listing
  }

  //delete the listing, and redirect to the seller's listing page
  db.deleteListing(key, function(err){
    if (err){
      res.sendStatus(500);
    } else {
      res.redirect('/sellerListing?user=' + seller);
    }
  })
});

router.post("/add", upload.single('fileUpload'),function(req,res,next) {
    viewlisting.saveImage(req, res, function(imageName) {
        viewlisting.createListing(req, res, user, imageName, function(colours,types) {
            res.redirect('/sellerListing?user=' + user.username);
            //res.render('sellerAdd', {title: 'Add a listing', user:user, colours: colours, types: types });
        });
    });
});

/* GET search page. */
router.get('/searchpage', function(req, res, next) {
    //passing an empty array since we assume this is the first visit to this page
  var array = [];
  res.render('searchpage', { title: 'searchpage', results: array, user:user });
});



/* Execute a search and display results on searchpage*/
router.get('/search', function(req, res, next) {

    //get the search params from url
    var urlparts = url.parse(req.url, true);
    console.log(urlparts);


    //if we detect a reference to a listing key we need to delete it
    if(urlparts.query.target!=undefined){
        backURL = req.header('Referer') || '/';
        console.log(backURL);
        var urlparts = url.parse(req.url, true);
        //do the deleting
        db.deleteListing(parseInt(urlparts.query.target), function (err, ret){
            if(err){
                print(err);
            }
        });
    }
    //change the url if this was a delete
    if(url.parse(req.url, true).query.target!=undefined){
        urlparts = url.parse(backURL, true);
    }


        //now load results
        //pass to searchdatabase file to get results
        searchDatabase.basicSearch(urlparts, function (resultsArray) {
            var dummy = [];
            //check for failed data and change to safe array to pass
            if (resultsArray == undefined || resultsArray[0] == undefined) {
                resultsArray = dummy;
            }
            //if this was a delete from earlier then load the referer page given from urls path
            if(url.parse(req.url, true).query.target!=undefined){
                res.redirect(urlparts.path);
            }
            else {
                //otherwise this is a legit search so render with results from db query
                res.render('searchpage', { results: resultsArray, resultslength: resultsArray.length,user:user});
            }
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

    login.login(req.body.user,req.body.pass, function(result, userObject){
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
            //console.log(userObject);
            user.username = req.body.user;
            user.loggedIn = true;
            user.admin = userObject.UserAdmin;
            //render success message
            res.render('login', {user: user, errorAlert: errorAlert, loggedIn: user.loggedIn, username: user.username});

            /*TODO -- here we are just rendering a shitty success message, would be cool if we could redirect to the seller home page or whatever*/

           //backURL=req.header('Referer') || '/seller';
           //res.render(backURL, {user: user, errorAlert: errorAlert, loggedIn: user.loggedIn, username: user.username});
        }
        else {
            //failed login so print error
            res.render('login', {user: user, errorAlert: errorAlert})
        }
    })
});

/* Setup route.*/
router.get('/login', function(req, res){
      res.render('login', {user: user, loggedIn: user.loggedIn, username : user.username});
});

router.get('/logout', function(req, res){

    if(user.loggedIn==false){
        backURL=req.header('Referer') || '/login';
        res.redirect('/login');
    }
    else {
        //log the user out
        user.loggedIn=false;
        user.username="";

        //redirect user to login page
        res.redirect('/login');

    }

});

router.get('/register', function(req,res){
    var previous = {
        username: "",
        address: "",
        city: "",
        postcode: ""
    };
    res.render('register',{user:user, previous : previous });
})

router.post('/register', upload.single('fileUpload'), function(req,res){
    viewlisting.saveImage(req,res,function(imageName) {
        login.register(req.body,imageName,function(result){
            if(result){

                var previous = {
                    username: "",
                    address: "",
                    city: "",
                    postcode: ""
                };
                res.render('register', {user: user, message:'successfully registered!', previous: previous});

            } else {
                var previous = {
                    username: req.body.username,
                    address: req.body.address,
                    city: req.body.city,
                    postcode: req.body.postcode
                };


                res.render('register', {
                    user: user,
                    message: 'error while registering, invalid information or username already exists',
                    previous : previous
                });
            }
        });
    });
});




module.exports = router;
