// Where the database is located
const CONNECT_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/bookmarks';

/* ---- Postgres Queries Used by the API ---- */
const SELECT_TAG = 'SELECT tag FROM tag;';
const SELECT_FOLDER = 'SELECT foldername FROM folder;';
const SELECT_BOOKMARK = 'SELECT bookmarkid, url, title, description, foldername, screenshot FROM bookmark;';
const SELECT_BOOKMARK_BY_FOLDER = function(folder) {
    return `SELECT bookmarkid, url, title, description, bookmark.foldername, screenshot
              FROM bookmark JOIN folder ON bookmark.foldername = folder.foldername
              WHERE folder.foldername = '${folder}';`;
};
const SELECT_BOOKMARK_BY_TAG = function(tag) {
  return `SELECT bookmark.bookmarkid , url, title, description, foldername, screenshot, tag
          FROM bookmark JOIN bookmark_tags ON bookmark.bookmarkid = bookmark_tags.bookmarkid
          JOIN tag ON bookmark_tags.tagid = tag.tagid
          WHERE bookmark.bookmarkid in (
            SELECT bookmark.bookmarkid
              FROM bookmark JOIN bookmark_tags ON bookmark.bookmarkid = bookmark_tags.bookmarkid
              JOIN tag ON bookmark_tags.tagid = tag.tagid
              WHERE tag.tag = '${tag}');`;
};
const INSERT_BOOKMARK = 'INSERT INTO bookmark(url, title, description, foldername, screenshot, userid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING bookmarkid, url, title, description, foldername, screenshot;';
const INSERT_FOLDER = 'INSERT INTO folder(foldername) VALUES ($1) RETURNING foldername;';

exports.CONNECT_URL = CONNECT_URL;
exports.SELECT_TAG = SELECT_TAG;
exports.SELECT_FOLDER = SELECT_FOLDER;
exports.SELECT_BOOKMARK = SELECT_BOOKMARK;
exports.SELECT_BOOKMARK_BY_FOLDER = SELECT_BOOKMARK_BY_FOLDER;
exports.SELECT_BOOKMARK_BY_TAG = SELECT_BOOKMARK_BY_TAG;
exports.INSERT_BOOKMARK = INSERT_BOOKMARK;
exports.INSERT_FOLDER = INSERT_FOLDER;
