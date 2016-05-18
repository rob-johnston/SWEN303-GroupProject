/**
 * Created by rob on 18/05/16.
 */

(function(){

    var file = '../data.db';
    var sqlite = require('sqlite3').verbose();
    var db = new sqlite.Database(file);

    module.exports = {login:login,
                      register: register};

    function login(username,userpass,callback){
        var result=false;
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


    function register(req, callback){
        var result=false;
        var initstmt = "SELECT * FROM User WHERE UserName =" + "\'"+req.username+"\'";
        db.get(initstmt, function(err,res){

            if(res==null){
                result=true;
                //no previous results so submit it to database
                    var stmt = 'INSERT INTO User (UserName, UserPassword, UserPicture)' +
                        'VALUES (?, ?, ?)';
                    db.run(stmt, [req.username, req.password, null]);

            }
            else {
                result = false;
            }
            callback(result);
        });
    };
})();




