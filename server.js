/* ---- Dependencies ---- */
var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');
var queries = require('./db/queries.js');
var getBookmarks = require('./helper_function');

/* ---- Initial Setup ---- */
var app = express();
var jsonParser = bodyParser.json();
app.disable('etag');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* ---- GET REQUESTS ---- */
/**
 * @description `GET /bookmarks` enpoint; returns an array of all the
 * bookmarks stored in the database.
 */
app.get('/bookmarks', function(request, response) {
  getBookmarks().then(function(result) {
    response.json(result.rows);
  }, function(err) {
    response.status('404').json(err);
  });
});

/**
 * @description `GET /folder/bookmark/:folderName` endpoint; returns an array of
 * bookmarks with the provided folder name.
 */
app.get('/folder/bookmarks/:folderName', function(request, response) {
  getBookmarks(request.params.folderName).then(function(result) {
    response.json(result.rows);
  }, function(err) {
    response.status('404').json(err);
  });
});

/**
 * @description `GET /tag/bookmark/:tagName` endpoint; returns an array of
 * bookmarks with the provided tag name.
 */
app.get('/tag/bookmarks/:tagName', function(request, response) {
  getBookmarks('', request.params.tagName).then(function(result) {
    response.json(result.rows);
  }, function(err) {
    response.status('404').json(err);
  });
});

/**
 * @description `GET /tags` endpoint; returns an array of
 * tags stored in the database.
 */
app.get('/tags', function(request, response) {
  var client = new pg.Client(queries.CONNECT_URL);
  client.connect(function(err) {
    if (err) {
      console.error(err);
      response.sendStatus('500');
    }
    client.query(queries.SELECT_TAG, function(err, result) {
      if (err) {
        console.error(err);
        response.sendStatus('500');
      }

      // Convert the array of tag objects returned from database
      // into an array of Strings.
      var resultsToReturn = result.rows.map(function(value) {
        return value.tag;
      });

      response.json(resultsToReturn);
    });
  });
});

/**
 * @description `GET /folders` endpoint; returns an array of
 * folders stored in the database.
 */
app.get('/folders', function(request, response) {
  var client = new pg.Client(queries.CONNECT_URL);
  client.connect(function(err) {
    console.log('client connected');
    if (err) {
      console.error(err);
      response.sendStatus('500');
    }
    client.query(queries.SELECT_FOLDER, function(err, result) {
      if (err) {
        console.error(err);
        response.sendStatus('500');
      }

      // Convert the array of folder objects returned from database
      // into an array of Strings.
      var resultsToReturn = result.rows.map(function(value) {
        return value.foldername;
      });

      response.json(resultsToReturn);
    });
  });
});

/* ---- POST REQUESTS ---- */

/**
 * @description `POST /bookmark` endpoint. Takes an object with the following
 * fields: url, title, description (optional), foldername,
 * screenshot (optional). If insert into database is successful, then the
 * new bookmark is returned to the caller.
 */
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
    // Handle the two optional bookmark fields. If user did not provide a
    // value use defaults.
    var bdescription = request.body.description ? request.body.description : '';
    var bscreenshot = request.body.screenshot ? request.body.screenshot : 'http://placekitten.com/200/300';

    var client = new pg.Client(queries.CONNECT_URL);
    client.connect(function(err) {
      if (err) {
        console.error(err);
        response.sendStatus('500');
      }

      // Paramitarize query to protect against SQL injection
      client.query(queries.INSERT_BOOKMARK,
        [request.body.url, request.body.title, bdescription, request.body.foldername, bscreenshot, 1],
        function(err, result) {
        if (err) {
          console.error(err);
          response.sendStatus('500');
        }
        response.status(201).json(result.rows[0]);
      });
    });
  }
});

/**
 * @description `POST /folder` endpoint. Takes an object with the following
 * field: foldername. If insert into database is successful, then the
 * new folder name is returned to the caller.
 */
app.post('/folder', jsonParser, function(request, response) {
  if(!request.body.foldername) {
    response.status(422).json({
      message: 'Missing field: foldername'
    });
  } else {
    var client = new pg.Client(queries.CONNECT_URL);
    client.connect(function(err) {
      console.log('client connected');
      if (err) {
        console.error(err);
        response.sendStatus('500');
      }
      // Paramitarize query to protect against SQL injection
      client.query(queries.INSERT_FOLDER,
        [request.body.foldername],
        function(err, result) {
        if (err) {
          console.error(err);
          response.sendStatus('500');
        }
        response.json(result.rows[0]);
      });
    });
  }
});

/* ---- Set port and start server ---- */
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
