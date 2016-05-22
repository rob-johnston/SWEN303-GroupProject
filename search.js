/**
 * Created by rob on 7/05/16.
 */

var results = [];

(function(){

    var file = '../data.db';
    var sqlite = require('sqlite3').verbose();

    var db = new sqlite.Database(file);
    //need a more complex search

    module.exports.basicSearch = function(searchparameters, callback){


        var searchWords = searchparameters.query.searchbar.split(' ');

        //if a basic search from main menu, do something slightly different!!!!!!!
        if(searchparameters.query.maxprice==undefined){
            var stmt = 'SELECT * FROM VListing WHERE isDeleted == 0 ';
            for (var i=0; i< searchWords.length; i++){
                stmt += "AND (ListingTitle LIKE \'%" + searchWords[i] + "%\' OR ListingDesc LIKE \'%" + searchWords[i] +"%\'" +
                  "OR Type LIKE \'%"+ searchWords[i] + "%\' OR Seller LIKE \'%"+ searchWords[i] + "%\') ";
            }
        } else {
            //super dirty sql query
            var stmt = 'SELECT * FROM VListing WHERE isDeleted == 0 ';
            for (var i=0; i< searchWords.length; i++){
                stmt += "AND (ListingTitle LIKE \'%" + searchWords[i] + "%\' OR ListingDesc LIKE \'%" + searchWords[i] +"%\'" +
                  "OR Type LIKE \'%"+ searchWords[i] + "%\' OR Seller LIKE \'%"+ searchWords[i] + "%\') ";
            }
            //make it even dirtier
            stmt += "AND ListingPrice < " + searchparameters.query.maxprice +" AND ListingPrice > " + searchparameters.query.minprice;
        }

            db.all(stmt, function (err, res) {
                if (err) {
                    callback(results);
                } else {
                  //call back to render the results on page
                    callback(res);
                }

            });
        }
    })();




