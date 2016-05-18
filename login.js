/**
 * Created by rob on 18/05/16.
 */

(function(){

    var file = '../data.db';
    var sqlite = require('sqlite3').verbose();
    var db = new sqlite.Database(file);

    module.exports.login = function(username,userpass,callback ){
        var result=false;

        var stmt = 'SELECT * FROM User WHERE UserName == ' + username;
        db.get(stmt, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);

                callback(results);
            }

        }, function(err,rows){
            callback(result);
        });
    }
})();




