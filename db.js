(function(){

    var file = '../data.db';
    var sqlite = require('sqlite3').verbose();

    var db = new sqlite.Database(file);

    //Placeholder. Need to flesh this puppy out more
    module.exports = {
        db: db,
        getActiveListings: getActiveListings,
        getListing: getListing,
        getAllColours: getAllColours,
        addListing:addListing
    };

    //db.each('SELECT * FROM Colour', function(err, res){
    //    if (err){
    //        console.log(err);
    //    } else {
    //        console.log(res);
    //    }
    //});

    /**
     * Returns all the active listings from the database
     * @param cb callback function
     */
    function getActiveListings(cb) {
        var stmt = 'SELECT * FROM Listing WHERE isDeleted == 0';

        db.get(stmt, cb);
    }

    /**
     * Returns all the colours from the database
     * @param cb callback function
     */
    function getAllColours(cb) {
        var stmt = 'SELECT * FROM Colour';

        db.each(stmt, cb);
    }

    /**
     * Returns all the active listings sold by a user
     * @param key User Key
     * @param cb callback function
     */
    function getUserListings(key, cb){
        var stmt = 'SELECT * FROM VListing WHERE SellerKey = ?';

        db.get(stmt, [key], cb);
    }

    /**
     * Returns the listing matching Listing key
     * @param key Listing key
     * @param cb callback function
     */
    function getListing(key, cb){
        var stmt = 'SELECT * FROM Listing WHERE ListingKey = ?';

        db.get(stmt, [key], cb);
    }

    /**
     * Adds a new listing to the database
     * @param sell_key user key of the seller
     * @param type_key type key
     * @param title Listing title
     * @param desc Listing Description
     * @param price Listing price
     * @param image Listing image url
     * @param cb callback function (for errors)
     */
    function addListing(sell_key, type_key, title, desc, price, image, cb){
        var stmt = 'INSERT INTO Listing (SellerKey, TypeKey, ListingTitle, ListingDesc, ListingPrice, ListingImage)' +
            'VALUES (?, ?, ?, ?, ?, ?)';

        db.run(stmt, [sell_key, type_key, title, desc, price, image], cb)
    }

    /**
     * Marks a listing as deleted
     * @param key Listing key
     * @param cb callback function
     */
    function deleteListing(key, cb){
        var stmt = 'UPDATE Listing SET isDeleted = 0 WHERE ListingKey = ?';

        db.get(stmt, [key], cb);
    }
})();
