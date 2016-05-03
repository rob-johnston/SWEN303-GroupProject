(function(){

    var file = '../data.db';
    var sqlite = require('sqlite3').verbose();

    var db = new sqlite.Database(file);

    //Placeholder. Need to flesh this puppy out more
    module.exports = db;

    //db.each('SELECT * FROM Colour', function(err, res){
    //    if (err){
    //        console.log(err);
    //    } else {
    //        console.log(res);
    //    }
    //});

})();
