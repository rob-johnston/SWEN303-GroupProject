/**
 * Created by Alex on 9/05/2016.
 */

(function(){

    var db = require('./db');

    //need a more complex search

    module.exports.getlisting = function(params, callback){
        //not actually using the search parameters,
        //This data will be obtained from the database - default info at the moment
        // ------------------------------------------------------------------------
        var price = 2.00;
        var description = "Description";
        var listingTitle = "tempTitle";
        var image = "images/3.jpg";
        // ------------------------------------------------------------------------
        var resultsArray = {listingTitle: listingTitle, description: description, price: price, image: image};
        callback(resultsArray);
        /*
        db.each('SELECT * FROM Colour', function (err, res) {
            if (err) {
                console.log(err);
            } else {
                //console.log(res);
                results.push(res);
            }
        }, function(err,rows){
            callback(results);
        });
        */
    }
})();