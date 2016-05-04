var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET search page. */
router.get('/searchpage', function(req, res, next) {
  res.render('searchpage', { title: 'Express' });
});

module.exports = router;

router.get('/search', function(req, res, next) {
    // get the search query
   //make it suitable for the DB
  //query the DB
  // return results
  //create each listing for the page based  of each result
  //
  var exampleResult1 = {image:"1.jpg", price: 200, name:"Bondage Hat"};
  var exampleResult2 = {image:"2.jpg", price: 100, name:"S&M Hat"};
  var resultsArray = [exampleResult1, exampleResult2 ];
  res.render('searchpage', { results : resultsArray});

  });