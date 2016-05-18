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
})();