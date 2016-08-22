var models = require('../models');
var queries = require('../db/queries');
var express = require('express');
var router = express.Router();

/**
 * @description `GET /folder/bookmark/:foldername` endpoint; returns an array of
 * bookmarks with the provided folder name.
 */
router.get('/bookmarks/:folderName', function(request, response) {
  models.sequelize.query(queries.SELECT_BOOKMARK_BY_FOLDER, {
          replacements: {
              folder: [request.params.foldername]
          },
            type: models.sequelize.QueryTypes.SELECT
          })
      .then(function(folders) {
          console.log(folders)
      })

      //     models.bookmark.findAll({
      //       attributes: ['bookmarkid', 'url', 'title', 'description', 'foldername', 'screenshot'],
      //             include: [{
      //                     model: 'folder',
      //                     where: {
      //                         folderid: models.Sequelize.col('folderid')
      //                     }
      //             }]
      //     }).then(function(folders) {
      //     console.log(folders)
      // })
  })

        /**
         * @description `GET /folders` endpoint; returns an array of
         * folders stored in the database.
         */
        router.get('/', function(request, response) {
          models.sequelize.query(queries.SELECT_FOLDER).then(function(folders) {
            console.log(folders)
          })
            // models.folder.findAll({}).then({
            //         function(folders) {
            //             console.log(folders)
            //         }
            //     })
                // Convert the array of folder objects returned from database
                // into an array of Strings.
                // var resultsToReturn = result.rows.map(function(value) {
                //     return value;
                // });
                //
                // response.json(resultsToReturn);
        });

        /**
         * @description `POST /folder` endpoint. Takes an object with the following
         * field: foldername. If insert into database is successful, then the
         * new folder name is returned to the caller.
         */
        // app.post('/folder', jsonParser, function(request, response) {
        //     if (!request.body.foldername) {
        //         response.status(422).json({
        //             message: 'Missing field: foldername'
        //         });
        //     } else {
        //         var client = new pg.Client(queries.CONNECT_URL);
        //         client.connect(function(err) {
        //             console.log('client connected');
        //             if (err) {
        //                 console.error(err);
        //                 response.sendStatus('500');
        //             }
        //             // Paramitarize query to protect against SQL injection
        //             client.query(queries.INSERT_FOLDER, [request.body.foldername],
        //                 function(err, result) {
        //                     if (err) {
        //                         console.error(err);
        //                         response.sendStatus('500');
        //                     }
        //                     response.json(result.rows[0]);
        //
        //                     // disconnect the client
        //                     client.end(function(err) {
        //                         if (err) throw err;
        //                     });
        //                 });
        //         });
        //     }
        // });
        //
        // app.put('/folder/:folderid', jsonParser, function(request, response) {
        //     const folderid = request.params.folderid;
        //     if (!request.body.foldername) {
        //         response.status(422).json({
        //             message: 'Missing field: foldername'
        //         });
        //     } else {
        //         var client = new pg.Client(queries.CONNECT_URL);
        //         client.connect(function(err) {
        //             if (err) {
        //                 response.sendStatus('500');
        //             }
        //             // Paramitarize query to protect against SQL injection
        //             client.query(queries.UPDATE_FOLDER, [request.body.foldername, folderid],
        //                 function(err, result) {
        //                     if (err) {
        //                         console.error(err);
        //                         response.sendStatus('500');
        //                     }
        //                     response.json(result.rows[0]);
        //
        //                     // disconnect the client
        //                     client.end(function(err) {
        //                         if (err) throw err;
        //                     });
        //                 });
        //         });
        //     }
        // });
        //
        // /**
        //  * @description `DELETE /folder/:folderid` endpoint.
        //  * Takes :folderid and queries the database to delete the matching folder
        //  * If deleting from the database is successful, then the
        //  * deleted folder is returned to the caller.
        //  */
        // app.delete('/folder/:folderid', function(request, response) {
        //     const folder = request.params.folderid;
        //     delBookmarkFolder(null, folder).then(function(result) {
        //         response.json(result.rows);
        //     }, function(err) {
        //         response.status('404').json(err);
        //     });
        // });
