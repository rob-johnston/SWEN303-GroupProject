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
        addListing:addListing,
        getAllTypes:getAllTypes,
        addListingColour:addListingColour,
        getUserListings: getUserListings,
        getDeletedUserListings: getDeletedUserListings,
        deleteListing: deleteListing,
        getListingColours: getListingColours
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
        var stmt = 'SELECT * FROM VListing WHERE isDeleted == 0';

        db.all(stmt, cb);
    }

    /**
     * Returns all the colours from the database
     * @param cb callback function
     */
    function getAllColours(cb) {
        var stmt = 'SELECT * FROM Colour';

        db.all(stmt, cb);
    }

    /**
     * Returns all the colours that correspond to this listing, including the colourName
     * @param key Listing key
     * @param cb callback function
     */
    function getListingColours(key, cb){
        var stmt = 'SELECT * FROM ListingColour LEFT JOIN Colour ON ListingColour.ColourKey=Colour.ColourKey WHERE ListingKey = ?';

        db.all(stmt, [key], cb);
    }

    /**
     * Returns all the types from the database
     * @param cb callback function
     */
    function getAllTypes(cb) {
        var stmt = 'SELECT * FROM Type';

        db.all(stmt, cb);
    }

    /**
     * Returns all the active listings sold by a user
     * @param user User name
     * @param cb callback function
     */
    function getUserListings(user, cb){
        var stmt = 'SELECT * FROM VListing WHERE Seller = ? AND IsDeleted = 0';

        db.all(stmt, [user], cb);
    }

    function getDeletedUserListings(user, cb){
        //Order by the put newly created listings first
        var stmt = 'SELECT * FROM VListing WHERE Seller = ? AND IsDeleted = 1 ORDER BY ListingKey DESC';

        db.all(stmt, [user], cb);
    }

    /**
     * Returns the listing matching Listing key
     * @param key Listing key
     * @param cb callback function
     */
    function getListing(key, cb){
        var stmt = 'SELECT * FROM VListing WHERE ListingKey = ?';

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
     * Adds a new listing colour to the database
     * @param list_key listing key
     * @param col_key colour key
     * @param cb callback function (for errors)
     */
    function addListingColour(list_key, col_key, cb){
        var stmt = 'INSERT INTO ListingColour (ListingKey, ColourKey)' +
            'VALUES (?, ?)';

        db.run(stmt, [list_key, col_key], cb)
    }

    /**
     * Marks a listing as deleted
     * @param key Listing key
     * @param cb callback function
     */
    function deleteListing(key, cb){
        var stmt = 'UPDATE Listing SET isDeleted = 1 WHERE ListingKey = ?';

        db.run(stmt, [key], cb);
    }
})();
