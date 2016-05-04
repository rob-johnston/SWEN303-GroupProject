var express = require('express');
var router = express.Router();
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET search page. */
router.get('/searchpage', function(req, res, next) {
  var array = [];
  res.render('searchpage', { title: 'Express', results: array });
});

module.exports = router;

router.get('/search', function(req, res, next) {
    // get the search query
   //make it suitable for the DB
  //query the DB
  // return results
  //create each listing for the page based  of each result
  //

  //get the search params from url
  var urlparts = url.parse(req.url, true);

  var exampleResult1 = {image:"images/1.jpg", price: 200, name:"Bondage Hat"};
  var exampleResult2 = {image:"images/2.jpg", price: 100, name:"S&M Hat"};
  var exampleResult3 = {image:"images/3.jpg", price: 400, name:"Ultra Top Hat"};
  var resultsArray = [exampleResult1,
                      exampleResult2,
                      exampleResult3];

  console.log("client is searching for...");
  console.log("a hat with " + urlparts.query.searchbar);
  console.log("between " + urlparts.query.minprice + "vand " + urlparts.query.maxprice + " dollars");
  res.render('searchpage', { results: resultsArray});

  });