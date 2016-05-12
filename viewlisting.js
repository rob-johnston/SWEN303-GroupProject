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
        //Will eventually use this db function, but at the moment using SQL directly
        //db.getListing(listingKey,callback);
        db.db.get('SELECT * FROM Listing WHERE ListingKey = ?', [listingKey], function (err, res) {
            if (err) {
                console.log(err);
            } else {
                callback(res);
            }
        });
    }
})();