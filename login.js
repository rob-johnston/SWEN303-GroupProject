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
            callback(result,res);
        });
    }


    function register(req, imageName, callback){
        var result=false;
        var initstmt = "SELECT * FROM User WHERE UserName =" + "\'"+req.username+"\'";
        db.get(initstmt, function(err,res){

            if(res==null){
                //if null then user doesnt already exist!
                result=true;

                  if(req.username==undefined || req.password==undefined || req.address ==undefined || req.city==undefined){
                      result=false;
                  }
                //no previous results so submit it to database
                    //if credit card fields are left blank
                   else if(req.cc==undefined || req.exp == undefined)   {

                        var stmt = 'INSERT INTO User (UserName, UserPassword, UserPicture, UserAddress, UserCity)' +
                        'VALUES (?, ?, ?, ?, ?)';
                         db.run(stmt, [req.username, req.password, imageName, req.address, req.city]);
                    }
                    else {
                    //otherwise assume credit card details are legit
                        var stmt = 'INSERT INTO User (UserName, UserPassword, UserPicture, UserAddress, UserCity, UserCreditCard)' +
                        'VALUES (?, ?, ?, ?, ?, ?, ?)';
                         db.run(stmt, [req.username, req.password, imageName, req.address, req.city, req.cc]);
                }
            }
            else {
                result = false;

            }
            callback(result);
        });
    };
})();




