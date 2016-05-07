/**
 * Created by rob on 7/05/16.
 */

var results = [];




(function(){


    var db = require('./db');

    //need a more complex search

    module.exports.basicSearch = function(params, callback){
            results= [];

        // not actually using the search parameters,
        //but it is working like it should be
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
        }
    })();




