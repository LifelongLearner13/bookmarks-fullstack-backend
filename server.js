var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var jsonParser = bodyParser.json();

// https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
app.disable('etag');

// Middleware suggested by 
// https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
// Add headers
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');

  // Pass to next layer of middleware
  next();
});



app.get('/bookmarks', function(request, response) {
  getBookmarks().then(function(result) {
    response.json(result.rows);
  }, function(err) {
    response.status('404').json(err);
  });
});

app.get('/bookmarks/:folderName', function(request, response) {
  getBookmarks(request.params.folderName).then(function(result) {
    response.json(result.rows);
  }, function(err) {
    response.status('404').json(err);
  });
});

app.get('/folder/bookmarks/:folderName', function(request, response) {
  getBookmarks(request.params.folderName).then(function(result) {
    response.json(result.rows);
  }, function(err) {
    response.status('404').json(err);
  });
});

app.get('/tag/bookmarks/:tagName', function(request, response) {
  getBookmarks('', request.params.tagName).then(function(result) {
    response.json(result.rows);
  }, function(err) {
    response.status('404').json(err);
  });
});

app.get('/tags', function(request, response) {
  var connectURL = process.env.DATABASE_URL || 'postgres://localhost:5432/bookmarks';
  var query = `SELECT tag FROM tag;`;
  console.log('connectURL: ', connectURL);

  // instantiate a new client
  var client = new pg.Client(connectURL);

  // connect to database
  client.connect(function(err) {
    console.log('client connected');
    if (err) {
      console.error(err);
      response.send("Error " + err);
    }

    // execute a query on our database
    client.query(query, function(err, result) {
      console.log('query results: ', result);
      if (err) {
        console.error(err);
        response.send("Error " + err);
      }

      var resultsToReturn = result.rows.map(function(value) {
        return value.tag;
      });

      // disconnect the client
      // @question: Is disconnecting neccessary?
      client.end(function(err) {
        if (err) {
          console.error(err);
          response.send("Error " + err);
        }
      });

      response.json(resultsToReturn);
    });
  });
});

app.get('/folders', function(request, response) {
  var connectURL = process.env.DATABASE_URL || 'postgres://localhost:5432/bookmarks';
  var query = `SELECT foldername FROM folder;`;
  console.log('connectURL: ', connectURL);

  // instantiate a new client
  var client = new pg.Client(connectURL);

  // connect to database
  client.connect(function(err) {
    console.log('client connected');
    if (err) {
      console.error(err);
      response.send("Error " + err);
    }

    // execute a query on our database
    client.query(query, function(err, result) {
      console.log('query results: ', result);
      if (err) {
        console.error(err);
        response.send("Error " + err);
      }

      var resultsToReturn = result.rows.map(function(value) {
        return value.foldername;
      });

      // disconnect the client
      // @question: Is disconnecting neccessary?
      client.end(function(err) {
        if (err) {
          console.error(err);
          response.send("Error " + err);
        }
      });

      response.json(resultsToReturn);
    });
  });
});

function getBookmarks(folder, tag) {
  console.log('getbookmarks called with: ', folder, tag);
  var query = `SELECT bookmarkid, url, title, description, foldername, screenshot 
              FROM bookmark`;
  if (folder) {
    query = `SELECT bookmarkid, url, title, description, bookmark.foldername, screenshot 
            FROM bookmark JOIN folder ON bookmark.foldername = folder.foldername 
            WHERE folder.foldername = '${folder}';`;
  }
  if (tag) {
    query = `SELECT bookmark.bookmarkid, url, title, description, foldername, screenshot, tag 
            FROM bookmark JOIN bookmark_tags ON bookmark.bookmarkid = bookmark_tags.bookmarkid 
              JOIN tag ON bookmark_tags.tagid = tag.tagid 
            WHERE tag.tag = '${tag}';`;
  }
  // console.log('query: ', query);

  return new Promise(function(resolve, reject) {
    var connectURL = process.env.DATABASE_URL || 'postgres://localhost:5432/bookmarks';
    // console.log('connectURL: ', connectURL);

    // instantiate a new client
    var client = new pg.Client(connectURL);

    // connect to database
    client.connect(function(err) {
      // console.log('client connected');
      if (err) {
        console.error(err);
        response.send("Error " + err);
      }

      // execute a query on our database
      client.query(query, function(err, result) {
        // console.log('query results: ', result);
        if (err) {
          console.error(err);
          response.send("Error " + err);
        }

        // disconnect the client
        // @question: Is disconnecting neccessary?
        client.end(function(err) {
          if (err) {
            console.error(err);
            response.send("Error " + err);
          }
        });

        resolve(result);
      });
    });
  });
}


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
