/* ---- Dependencies ---- */
var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');

const connectURL = process.env.DATABASE_URL || 'postgres://localhost:5432/bookmarks';

/* ---- Initial Setup ---- */
var app = express();
var jsonParser = bodyParser.json();
app.disable('etag');
app.use(function(req, res, next) {
  // @TODO: This approach is insecure change '*' to reflect front-end address
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  next();
});


/* */
app.get('/bookmarks', function(request, response) {
  getBookmarks().then(function(result) {
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
  var query = `SELECT tag FROM tag;`;

  // instantiate a new client
  var client = new pg.Client(connectURL);

  client.connect(function(err) {
    if (err) {
      console.error(err);
      response.sendStatus('500');
    }

    client.query(query, function(err, result) {
      if (err) {
        console.error(err);
        response.sendStatus('500');
      }

      // Convert the array of tag objects returned from database into an array of Strings
      var resultsToReturn = result.rows.map(function(value) {
        return value.tag;
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
      response.sendStatus('500');
    }

    // execute a query on our database
    client.query(query, function(err, result) {
      console.log('query results: ', result);
      if (err) {
        console.error(err);
        response.sendStatus('500');
      }

      var resultsToReturn = result.rows.map(function(value) {
        return value.foldername;
      });

      response.json(resultsToReturn);
    });
  });
});

app.post('/bookmark', jsonParser, function(request, response) {
  if (!request.body.url) {
    response.status(422).json({
      message: 'Missing field: URL'
    });
  } else if (!request.body.title) {
    response.status(422).json({
      message: 'Incorrect field type: title'
    });
  } else if (!request.body.foldername) {
    response.status(422).json();
  } else {
    var infoToinsert = `'${request.body.url}', 
      '${request.body.title}', 
      ${request.body.description ? ('\'' + request.body.description + '\', ') : ''} 
      '${request.body.foldername}' , 
      ${request.body.screenshot ? ('\'' + request.body.screenshot + '\', ') : '' } 
      ${'1'}`;

    var query = `INSERT INTO bookmark(url, title, ${request.body.description ? 'description,' : ''} foldername, ${request.body.screenshot ? 'screenshot,' : ''} userid)
    VALUES (${infoToinsert})
    RETURNING bookmarkid, url, title, description, foldername, screenshot;`;
    console.log('query: ', query);
    var client = new pg.Client(connectURL);
    client.connect(function(err) {
      console.log('client connected');
      if (err) {
        console.error(err);
        response.sendStatus('500');
      }

      // execute a query on our database
      client.query(query, function(err, result) {
        console.log('query results: ', result);
        if (err) {
          console.error(err);
          response.sendStatus('500');
        }
        response.json(result);
      });
    });
  }
});

app.post('/folder', jsonParser, function(request, response) {
  console.log('app.post:', request.body);
  if(!request.body.foldername) {
    response.status(422).json({
      message: 'Missing field: foldername'
    });
  } else {
    var client = new pg.Client(connectURL);
    client.connect(function(err) {
      console.log('client connected');
      if (err) {
        console.error(err);
        response.sendStatus('500');
      }

      var query = `INSERT INTO folder(foldername) 
                    VALUES ('${request.body.foldername}')
                    RETURNING foldername`;
      console.log('query: ', query);
      // execute a query on our database
      client.query(query, function(err, result) {
        console.log('query results: ', result);
        if (err) {
          console.error(err);
          response.sendStatus('500');
        }

        response.json(result.rows[0]);
      });
    });
  }
});

function getBookmarks(folder, tag) {
  var query = `SELECT bookmarkid, url, title, description, foldername, screenshot 
              FROM bookmark`;
  if (folder) {
    query = `SELECT bookmarkid, url, title, description, bookmark.foldername, screenshot 
            FROM bookmark JOIN folder ON bookmark.foldername = folder.foldername 
            WHERE folder.foldername = '${folder}';`;
  }
  if (tag) {
    // @todo: create an array of tags for each bookmark
    query = `SELECT bookmark.bookmarkid , url, title, description, foldername, screenshot, tag
            FROM bookmark JOIN bookmark_tags ON bookmark.bookmarkid = bookmark_tags.bookmarkid 
            JOIN tag ON bookmark_tags.tagid = tag.tagid 
            WHERE bookmark.bookmarkid in ( 
              SELECT bookmark.bookmarkid 
                FROM bookmark JOIN bookmark_tags ON bookmark.bookmarkid = bookmark_tags.bookmarkid 
                JOIN tag ON bookmark_tags.tagid = tag.tagid 
                WHERE tag.tag = '${tag}');`;
  }

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
        response.sendStatus('500');
      }

      // execute a query on our database
      client.query(query, function(err, result) {
        // console.log('query results: ', result);
        if (err) {
          console.error(err);
          response.sendStatus('500');
        }

        resolve(result);
      });
    });
  });
}


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
