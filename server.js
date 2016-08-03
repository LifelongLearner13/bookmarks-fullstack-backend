var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var jsonParser = bodyParser.json();



app.get('/bookmarks', function (request, response) {
  getBookmarks().then(function(result){
    response.json(result);
  },function(err){
    console.log(err);
  });
});

function getBookmarks(folder, tag) {
  console.log('getbookmarks called with: ', folder, tag);
  var query = 'SELECT bk_bookmarkid, bk_url, bk_title, bk_description, bk_foldername, bk_screenshot FROM bookmark';
  if(folder) {
    query = `SELECT bk_bookmarkid, bk_url, bk_title, bk_description, bk_foldername, bk_screenshot FROM bookmark JOIN folder ON bk_foldername = fr_foldername WHERE fr_foldername = 'Work';`
  }
  if(tag) {
    query = `SELECT bk_bookmarkid, bk_url, bk_title, bk_description, bk_foldername, bk_screenshot, tg_tag FROM bookmark JOIN bookmark_tags ON bk_bookmarkid = bt_bookmarkid JOIN tag ON bt_tagid = tg_tagid;`;
  }
  console.log('query: ', query);
  
  return new Promise(function(resolve, reject) {
    var connectURL = process.env.DATABASE_URL || 'postgres://localhost:5432/bookmarks';
    console.log('connectURL: ', connectURL);

    // instantiate a new client
    var client = new pg.Client(connectURL);

    // connect to database
    client.connect(function (err) {
      console.log('client connected');
      if (err) { 
        console.error(err); 
        response.send("Error " + err); 
      }

      // execute a query on our database
      client.query(query, function (err, result) {
        if (err) { 
          console.error(err); 
          response.send("Error " + err); 
        }

        // disconnect the client
        // @question: Is disconnecting neccessary?
        client.end(function (err) {
          if (err) { 
            console.error(err); 
            response.send("Error " + err); 
          }
        });

        resolve(result.rows);
      });
    });
  });
}


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
