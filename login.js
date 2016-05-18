/**
 * Created by rob on 18/05/16.
 */

(function(){

    var file = '../data.db';
    var sqlite = require('sqlite3').verbose();
    var db = new sqlite.Database(file);

    module.exports.login = function(username,userpass,callback ){
        var result=false;
        console.log("checking " + username + " " + userpass);

        var stmt = "SELECT * FROM User WHERE UserName =" + "\'"+username+"\'";
        db.get(stmt, function(err,res){

            if(res==null){
                result=false;
            }
            else if(res.UserPassword==userpass){
                result = true;
            }
            else {
                result = false;
            }
            callback(result);
        });
    }
})();




