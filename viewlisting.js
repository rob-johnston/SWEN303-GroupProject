/**
 * Created by Alex on 9/05/2016.
 */

(function(){

    var db = require('./db');

    //need a more complex search

    module.exports.getlisting = function(params, callback){
        //For testing, if no listing id is passed in, set it to a default (the first record of the database)
        if (params.query.ListingKey == null) {
            params.query.ListingKey = 1;
        }
        var listingKey = params.query.ListingKey;
        //Get listing from database
        var results = [];
        db.getListing(listingKey,function (err, listing) {
            if (err) {
                console.log(err);
            } else {
                results.push(listing);
                db.getListingColours(listingKey,function (err, colours) {
                    if (err) console.log(err);
                    else {
                        results.push(colours);
                        callback(results);
                    }
                });
            }
        });
    }

    module.exports.createListing = function(req, res, user, callback){
        var origName = "logo.png"; //Default image if no image was provided.
        if (req.file != null) {
            //getting current directory
            var directory = process.env.PWD;
            origName = req.file.originalname; //At the moment no renaming of the file is happening
            var hasError = false;

            //renaming the file to its original name
            fs.rename(req.file.path, '../public/images/' + origName,
                function(err){
                    if(err){
                        hasError = true;
                        console.log("RENAMING ERROR");
                        console.log(err);
                        //res.render('add',{title:'Failed to find the file.', error:err});
                    }
                }
            );
        }

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
                        if (req.body.ListingTitle == null) {
                            //If no data has been submitted, display the add a listing page (sellerAdd)
                            callback(colours,types);
                        } else {
                            //If data has been submitted, create a new listing record in the database
                            db.db.get('SELECT * FROM User WHERE UserName = ?', user.username, function(err, r1) {
                                if (err || !r1) {
                                    console.log(err);
                                    res.send(404);
                                } else {
                                    var SellerKey = r1.userKey; //Get userKey from db
                                    var TypeKey = req.body.TypeKey; //Drop down box on sellerAdd page, so always has a value
                                    var ListingTitle = req.body.ListingTitle; //Required on sellerAdd page, so always has a value
                                    var ListingDesc = req.body.ListingDesc; //May not have a value, but that's ok
                                    var ListingPrice = req.body.ListingPrice; //Required greater than 0.5 on sellerAdd page
                                    var ListingImage = "./" + origName; //Default is hat logo, so always has a value

                                    //Now add the data to the listing table
                                    db.addListing(SellerKey,TypeKey,ListingTitle,ListingDesc,ListingPrice,ListingImage,function(rowNum,err) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            //Will then need to add records to ListingColour and ListingSize tables.
                                            //console.log(this.lastID);
                                            db.db.get("SELECT ListingKey FROM Listing WHERE RowID=?",[this.lastID], function(ListingKey,err) {
                                                if (err) {
                                                    //ListingKey is stored in err.
                                                    for (var i=0; i<colours.length; i++) {
                                                        var colKey = colours[i].ColourKey;
                                                        console.log(colKey);
                                                        console.log("Works: " + req.body[colKey]);
                                                        if (req.body[colKey] != null && req.body[colKey] != 0) {
                                                            db.addListingColour(err.ListingKey,colKey,function(err) {
                                                                if (err) console.log(err);
                                                            });
                                                        }
                                                    }
                                                }
                                                else {

                                                }
                                            });
                                        }
                                    });

                                    callback(colours,types);
                                }
                            });
                        }
                    }
                });
            }
        });
    }
})();