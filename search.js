/**
 * Created by rob on 7/05/16.
 */

var results = [];

(function(){

    var db = require('./db');

    //need a more complex search

    module.exports.basicSearch = function(callback){
            results= [];

        // not actually using the search parameters,
        //but it is working like it should be
            db.getActiveListings(function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                  // console.log(res);
                    results.push(res);
                    //call back to render the results on page
                    callback(results);
                }

            }, function(err,rows){
                //originally this was the final step, but now method has changed so we dont reach here
                //have to wait to confirm how db interaction works to finalise how this shit should do its job
                callback(results);
            });
        }
    })();




